import { EDGES, NODES, PLANS } from '../data/city01';
import type {
  ChaosFlags,
  EvidenceEvent,
  NodeRuntime,
  PlanId,
  ResourceState,
  SimulationOptions,
  SimulationRun,
  Status,
  TraceEvent,
  WorldParameters,
  WorldSnapshot,
} from './types';

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const approach = (current: number, target: number, rate: number) => current + (target - current) * rate;

function statusFor(capacity: number, recovering = false): Status {
  if (recovering && capacity >= 45 && capacity < 86) return 'recovering';
  if (capacity >= 80) return 'healthy';
  if (capacity >= 65) return 'stressed';
  if (capacity >= 45) return 'degraded';
  if (capacity >= 25) return 'critical';
  return 'failed';
}

export function floodSeverityAt(time: number, growth = 1) {
  if (time < 8) return 0;
  if (time < 160) return clamp(((time - 8) / 152) * growth, 0, 1.2);
  if (time < 240) return clamp(growth, 0, 1.2);
  return clamp((1 - (time - 240) / 200) * growth, 0.12, 1.2);
}

function initialNodes(parameters: WorldParameters): Record<string, NodeRuntime> {
  return {
    sub03: { id: 'sub03', status: 'healthy', capacity: 100, reserve: 25, load: 76, stress: 0, recoveringFor: 0 },
    tel07: { id: 'tel07', status: 'healthy', capacity: 100, reserve: parameters.telecomBackupSec, load: 68, stress: 0, recoveringFor: 0 },
    hospN: { id: 'hospN', status: 'healthy', capacity: 100, reserve: 90, load: 72, stress: 0, recoveringFor: 0 },
    pump02: { id: 'pump02', status: 'healthy', capacity: 100, reserve: 72, load: 64, stress: 0, recoveringFor: 0 },
    road12: { id: 'road12', status: 'healthy', capacity: 100, reserve: 100, load: 48, stress: 0, recoveringFor: 0 },
    ems01: { id: 'ems01', status: 'healthy', capacity: 100, reserve: 84, load: 58, stress: 0, recoveringFor: 0 },
  };
}

function cloneNodes(nodes: Record<string, NodeRuntime>) {
  return Object.fromEntries(Object.entries(nodes).map(([id, node]) => [id, { ...node }]));
}

export function evidenceAt(time: number, chaos: ChaosFlags, parameters: WorldParameters): EvidenceEvent[] {
  const events: EvidenceEvent[] = [];
  if (time >= 8) {
    events.push({
      id: 'E-8127', source: 'CAMERA_02', event: 'FLOOD SCENE', kind: 'observed', eventTime: 8,
      receivedTime: chaos.staleCamera ? Math.max(8, time - 34) : 8.1,
      confidence: chaos.staleCamera ? 0.61 : parameters.perceptionConfidence,
      trust: chaos.staleCamera ? 'MEDIUM' : 'HIGH', detail: chaos.staleCamera ? 'Camera feed is stale; confidence decays.' : 'Flood-like scene detected near Substation 03.',
    });
  }
  if (time >= 20) {
    events.push({
      id: 'E-8134', source: 'WATER_SENSOR_04', event: chaos.sensorConflict ? 'WATER LEVEL NORMAL' : 'WATER LEVEL HIGH', kind: 'observed', eventTime: 20,
      receivedTime: 20.1, confidence: 0.97, trust: 'HIGH', detail: chaos.sensorConflict ? 'Conflicts with camera evidence.' : 'Physical sensor corroborates flood scene.',
    });
  }
  if (time >= 30) {
    events.push({
      id: 'E-8141', source: 'GRID_TELEMETRY', event: 'VOLTAGE UNSTABLE', kind: 'observed', eventTime: 30,
      receivedTime: 30.05, confidence: 0.99, trust: 'HIGH', detail: 'Voltage variability detected at Substation 03.',
    });
  }
  if (chaos.roadBlocked && time >= 74) {
    events.push({
      id: 'E-8188', source: 'ROAD_SENSOR_12', event: 'ROAD 12 BLOCKED', kind: 'observed', eventTime: 74,
      receivedTime: 74.2, confidence: 0.98, trust: 'HIGH', detail: 'Primary mobile-unit route is unavailable.',
    });
  }
  if (chaos.secondShock && time >= 185) {
    events.push({
      id: 'E-8215', source: 'TELECOM_MONITOR', event: 'SECONDARY LOAD SPIKE', kind: 'observed', eventTime: 185,
      receivedTime: 185.1, confidence: 0.96, trust: 'HIGH', detail: 'Emergency-call volume spikes during recovery.',
    });
  }
  return events;
}

function planActivationTime(plan: PlanId, commitSec: number, parameters: WorldParameters) {
  const base = PLANS[plan];
  if (plan === 'REROUTE_MOBILE') return commitSec + Math.max(base.leadTimeSec, parameters.mobileTravelSec);
  return commitSec + base.leadTimeSec;
}

export function simulate(options: SimulationOptions): SimulationRun {
  const { untilSec, plan, parameters, chaos, interventionCommitSec } = options;
  const nodes = initialNodes(parameters);
  const resources: ResourceState = { gridReservePct: parameters.gridSparePct, mobileUnits: 1, generators: 1, repairCrews: 2 };
  const trace: TraceEvent[] = [];
  const checkpoints: WorldSnapshot[] = [];
  const activation = planActivationTime(plan, interventionCommitSec, parameters);
  let planFeasible = true;
  let planInfeasibleReason: string | undefined;
  let firstCriticalImpactSec: number | null = null;
  let firstFailureSec: number | null = null;
  let recoverySec: number | null = null;
  let minimumCriticalCapacity = 100;
  let minimumHospitalReserve = 100;
  let previousStatuses = Object.fromEntries(Object.keys(nodes).map(id => [id, nodes[id].status]));

  for (let t = 0; t <= untilSec; t += 1) {
    let flood = floodSeverityAt(t, parameters.floodGrowth);
    if (nodes.pump02.capacity < 45) flood = clamp(flood + ((45 - nodes.pump02.capacity) / 100) * 0.35, 0, 1.25);

    const rerouteRequested = plan === 'REROUTE' || plan === 'REROUTE_MOBILE';
    const shedRequested = plan === 'SHED_LOAD';
    const mobileRequested = plan === 'REROUTE_MOBILE';
    const gridReserveSufficient = !rerouteRequested || parameters.gridSparePct >= PLANS[plan].gridReserveCost;
    const mobileRouteBlocked = chaos.roadBlocked && 74 <= activation;

    if (mobileRequested && mobileRouteBlocked && t >= 74) {
      planFeasible = false;
      planInfeasibleReason = 'Mobile Unit 01 cannot reach Telecom 07 because ROAD_12 is blocked before activation.';
    }
    if (!gridReserveSufficient) {
      planFeasible = false;
      planInfeasibleReason = 'Insufficient grid reserve for requested reroute.';
    }

    const rerouteActive = rerouteRequested && gridReserveSufficient && t >= interventionCommitSec + PLANS.REROUTE.leadTimeSec;
    const shedActive = shedRequested && t >= activation;
    const mobileActive = mobileRequested && gridReserveSufficient && t >= activation && !mobileRouteBlocked && resources.mobileUnits > 0;

    let subTarget = 100 - flood * 74;
    if (chaos.secondShock && t >= 185) subTarget -= 10;
    if (rerouteActive) subTarget += Math.min(27, parameters.gridSparePct * 0.95);
    if (shedActive) subTarget += 19;
    if (t >= parameters.repairDelaySec) subTarget += Math.min(26, (t - parameters.repairDelaySec) * 0.18);
    nodes.sub03.capacity = clamp(approach(nodes.sub03.capacity, subTarget, subTarget < nodes.sub03.capacity ? 0.13 : 0.07));
    nodes.sub03.load = clamp(76 + flood * 18 - (shedActive ? 16 : 0));

    const subDeficit = Math.max(0, 54 - nodes.sub03.capacity);
    if (subDeficit > 0) nodes.tel07.reserve = Math.max(0, nodes.tel07.reserve - (0.72 + subDeficit / 75));
    else nodes.tel07.reserve = Math.min(parameters.telecomBackupSec, nodes.tel07.reserve + 0.3);
    const telecomReserveRatio = parameters.telecomBackupSec === 0 ? 0 : nodes.tel07.reserve / parameters.telecomBackupSec;
    let telecomTarget = subDeficit === 0 ? 96 : 35 + 48 * telecomReserveRatio;
    if (mobileActive) telecomTarget += 36;
    if (chaos.secondShock && t >= 185) telecomTarget -= 14;
    nodes.tel07.capacity = clamp(approach(nodes.tel07.capacity, telecomTarget, telecomTarget < nodes.tel07.capacity ? 0.11 : 0.08));
    nodes.tel07.load = clamp(68 + (chaos.secondShock && t >= 185 ? 28 : flood * 5));

    const pumpTarget = nodes.sub03.capacity >= 58 ? 94 : 25 + nodes.sub03.capacity * 0.72;
    nodes.pump02.capacity = clamp(approach(nodes.pump02.capacity, pumpTarget, pumpTarget < nodes.pump02.capacity ? 0.1 : 0.06));
    if (nodes.pump02.capacity < 48) nodes.pump02.reserve = Math.max(0, nodes.pump02.reserve - 0.4);
    else nodes.pump02.reserve = Math.min(72, nodes.pump02.reserve + 0.2);

    let roadTarget = 100 - flood * 35 - Math.max(0, 50 - nodes.pump02.capacity) * 0.45;
    if (chaos.roadBlocked && t >= 74) roadTarget = 6;
    nodes.road12.capacity = clamp(approach(nodes.road12.capacity, roadTarget, roadTarget < nodes.road12.capacity ? 0.18 : 0.05));

    const telecomDeficit = Math.max(0, 60 - nodes.tel07.capacity);
    if (telecomDeficit > 0) nodes.hospN.reserve = Math.max(0, nodes.hospN.reserve - (0.25 + telecomDeficit / 90));
    else nodes.hospN.reserve = Math.min(90, nodes.hospN.reserve + 0.18);
    const hospitalTarget = telecomDeficit === 0 ? 97 : 30 + nodes.hospN.reserve * 0.42;
    nodes.hospN.capacity = clamp(approach(nodes.hospN.capacity, hospitalTarget, hospitalTarget < nodes.hospN.capacity ? 0.09 : 0.07));

    const roadAccessCeiling = 100 - Math.max(0, 45 - nodes.road12.capacity) * 0.6;
    const emsTarget = Math.min(nodes.tel07.capacity * 1.03, roadAccessCeiling, 100);
    nodes.ems01.capacity = clamp(approach(nodes.ems01.capacity, emsTarget, emsTarget < nodes.ems01.capacity ? 0.12 : 0.07));
    if (nodes.ems01.capacity < 50) nodes.ems01.reserve = Math.max(0, nodes.ems01.reserve - 0.45);
    else nodes.ems01.reserve = Math.min(84, nodes.ems01.reserve + 0.12);

    for (const node of Object.values(nodes)) {
      const was = previousStatuses[node.id];
      const recovering = t > 240 && node.capacity > 45 && node.capacity > (was === 'failed' ? 20 : 0) && flood < 0.75;
      node.status = statusFor(node.capacity, recovering);
      node.stress = clamp(100 - node.capacity + Math.max(0, node.load - node.capacity) * 0.7);
      node.recoveringFor = node.status === 'recovering' ? node.recoveringFor + 1 : 0;
      if (node.status !== was) {
        trace.push({ id: `CT-${t}-${node.id}`, time: t, kind: 'predicted', message: `${NODES.find(n => n.id === node.id)?.label ?? node.id}: ${was.toUpperCase()} → ${node.status.toUpperCase()}`, ref: node.id });
      }
      previousStatuses[node.id] = node.status;
    }

    const criticalNodes = NODES.filter(n => n.critical).map(n => nodes[n.id]);
    minimumCriticalCapacity = Math.min(minimumCriticalCapacity, ...criticalNodes.map(n => n.capacity));
    minimumHospitalReserve = Math.min(minimumHospitalReserve, nodes.hospN.reserve);
    if (firstCriticalImpactSec == null && criticalNodes.some(n => n.status === 'critical' || n.status === 'failed')) firstCriticalImpactSec = t;
    if (firstFailureSec == null && criticalNodes.some(n => n.status === 'failed')) firstFailureSec = t;
    if (firstCriticalImpactSec != null && recoverySec == null && t > firstCriticalImpactSec + 20 && criticalNodes.every(n => ['healthy', 'recovering', 'stressed'].includes(n.status))) recoverySec = t;

    if (t % 15 === 0 || t === untilSec) {
      checkpoints.push({
        time: t, nodes: cloneNodes(nodes), resources: { ...resources }, activePlan: plan,
        planActivated: t >= activation, planActivationTime: activation, planFeasible, planInfeasibleReason,
        observations: evidenceAt(t, chaos, parameters), trace: [...trace],
      });
    }
  }

  if ((plan === 'REROUTE' || plan === 'REROUTE_MOBILE') && planFeasible) resources.gridReservePct = Math.max(0, resources.gridReservePct - PLANS[plan].gridReserveCost);
  if (plan === 'REROUTE_MOBILE' && planFeasible) resources.mobileUnits = 0;

  const final: WorldSnapshot = {
    time: untilSec, nodes: cloneNodes(nodes), resources: { ...resources }, activePlan: plan,
    planActivated: untilSec >= activation, planActivationTime: activation, planFeasible, planInfeasibleReason,
    observations: evidenceAt(untilSec, chaos, parameters), trace,
  };
  const critical = NODES.filter(n => n.critical).map(n => final.nodes[n.id]);
  const failures = critical.filter(n => n.status === 'failed').length;
  const preserved = critical.filter(n => n.status !== 'failed' && n.status !== 'critical').length;
  const safetyViolations: string[] = [];
  if (!planFeasible && plan !== 'NO_ACTION') safetyViolations.push(planInfeasibleReason ?? 'Plan prerequisites are not satisfied.');
  if (minimumHospitalReserve < 10) safetyViolations.push('Hospital reserve falls below 10%.');
  if (minimumCriticalCapacity < 35) safetyViolations.push('A critical service drops below the CITY//01 35% safety-capacity floor.');
  if (plan === 'NO_ACTION' && firstCriticalImpactSec != null) safetyViolations.push('No-action branch allows critical-service impact.');

  return {
    final, checkpoints, firstCriticalImpactSec, firstFailureSec, recoverySec,
    failures, criticalServicesPreserved: preserved, minimumCriticalCapacity, minimumHospitalReserve,
    safety: { pass: safetyViolations.length === 0, violations: safetyViolations },
  };
}

export function snapshotAt(run: SimulationRun, time: number): WorldSnapshot {
  const sorted = [...run.checkpoints].sort((a, b) => a.time - b.time);
  let best = sorted[0];
  for (const snap of sorted) {
    if (snap.time <= time) best = snap;
    else break;
  }
  return best;
}

export function earliestNoActionImpact(parameters: WorldParameters, chaos: ChaosFlags, fromSec = 0) {
  const run = simulate({ untilSec: 420, plan: 'NO_ACTION', parameters, chaos, interventionCommitSec: fromSec });
  return run.firstCriticalImpactSec;
}

export function deriveTrustState(time: number, chaos: ChaosFlags): 'VERIFIED' | 'DEGRADED' | 'UNCERTAIN' | 'SAFE ANALYSIS' {
  if (chaos.sensorConflict && chaos.staleCamera) return 'SAFE ANALYSIS';
  if (chaos.sensorConflict) return 'UNCERTAIN';
  if (chaos.staleCamera || chaos.npuUnavailable) return 'DEGRADED';
  if (time < 8) return 'VERIFIED';
  return 'VERIFIED';
}

export function edgeState(sourceId: string, snapshot: WorldSnapshot) {
  return snapshot.nodes[sourceId]?.status ?? 'healthy';
}

export function edgeMetadata(edgeId: string) {
  return EDGES.find(e => e.id === edgeId);
}
