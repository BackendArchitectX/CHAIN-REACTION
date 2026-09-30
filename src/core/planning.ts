import { BASE_PARAMETERS, PLANS, SCENARIO_SEED } from '../data/city01';
import { between, mulberry32 } from './rng';
import { earliestNoActionImpact, simulate } from './engine';
import type { ChaosFlags, FutureSample, PlanEvaluation, PlanId, SensitivityItem, WorldParameters } from './types';

function percentile(values: number[], p: number) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.round((sorted.length - 1) * p)));
  return sorted[index];
}

function median(values: number[]) {
  return percentile(values, 0.5);
}

export function generateFutureSamples(count = 256, seed = SCENARIO_SEED): FutureSample[] {
  const rng = mulberry32(seed);
  return Array.from({ length: count }, (_, index) => ({
    index,
    parameters: {
      floodGrowth: between(rng, 0.82, 1.28),
      telecomBackupSec: between(rng, 85, 150),
      gridSparePct: between(rng, 14, 30),
      mobileTravelSec: between(rng, 22, 55),
      repairDelaySec: between(rng, 210, 340),
      perceptionConfidence: between(rng, 0.80, 0.98),
    },
  }));
}

function recoveryDebtFor(gridReservePct: number, failures: number, minCapacity: number): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (failures > 0 || minCapacity < 28) return 'HIGH';
  if (gridReservePct < 9 || minCapacity < 48) return 'MEDIUM';
  return 'LOW';
}

export function evaluatePlan(
  plan: PlanId,
  chaos: ChaosFlags,
  commitSec: number,
  samples: FutureSample[],
): PlanEvaluation {
  const runs = samples.map(sample => simulate({
    untilSec: 420,
    plan,
    parameters: sample.parameters,
    chaos,
    interventionCommitSec: commitSec,
  }));

  const safeRuns = runs.filter(run => run.safety.pass);
  const recovery = runs.flatMap(run => run.recoverySec == null || run.firstCriticalImpactSec == null ? [] : [run.recoverySec - run.firstCriticalImpactSec]);
  const failures = runs.map(run => run.failures);
  const preserved = runs.map(run => run.criticalServicesPreserved);
  const medianFailures = median(failures) ?? 0;
  const worstFailures = Math.max(...failures);
  const medianRecoverySec = median(recovery);
  const p90RecoverySec = percentile(recovery, 0.9);

  const baseImpact = earliestNoActionImpact(BASE_PARAMETERS, chaos, commitSec);
  const planMeta = PLANS[plan];
  const effectiveLead = plan === 'REROUTE_MOBILE' ? Math.max(planMeta.leadTimeSec, BASE_PARAMETERS.mobileTravelSec) : planMeta.leadTimeSec;
  const decisionHorizonSec = baseImpact == null || plan === 'NO_ACTION'
    ? null
    : Math.floor(baseImpact - commitSec - effectiveLead - planMeta.safetyMarginSec);

  const safety: PlanEvaluation['safety'] = safeRuns.length === runs.length ? 'PASS' : safeRuns.length === 0 ? 'REJECT' : 'CONDITIONAL';
  const reference = simulate({ untilSec: 420, plan, parameters: BASE_PARAMETERS, chaos, interventionCommitSec: commitSec });
  const finalGridReserve = reference.final.resources.gridReservePct;
  const recoveryDebt = recoveryDebtFor(finalGridReserve, reference.failures, reference.minimumCriticalCapacity);
  const decisionMargin: PlanEvaluation['decisionMargin'] = decisionHorizonSec == null ? 'N/A' : decisionHorizonSec <= 0 ? 'MISSED' : decisionHorizonSec < 20 ? 'NARROW' : 'STRONG';

  return {
    plan,
    robustness: Math.round((safeRuns.length / Math.max(1, runs.length)) * 100),
    safeFutures: safeRuns.length,
    totalFutures: runs.length,
    criticalServicesPreservedMedian: median(preserved) ?? 0,
    medianFailures,
    worstFailures,
    medianRecoverySec,
    p90RecoverySec,
    recoveryDebt,
    decisionHorizonSec,
    decisionMargin,
    safety,
    infeasibleReason: reference.final.planInfeasibleReason,
  };
}

export function evaluateAllPlans(chaos: ChaosFlags, commitSec: number, count = 256, seed = SCENARIO_SEED) {
  const samples = generateFutureSamples(count, seed);
  return (Object.keys(PLANS) as PlanId[]).map(plan => evaluatePlan(plan, chaos, commitSec, samples));
}

export function selectedPlanSensitivity(plan: PlanId, chaos: ChaosFlags, commitSec: number): SensitivityItem[] {
  const baseline = simulate({ untilSec: 420, plan, parameters: BASE_PARAMETERS, chaos, interventionCommitSec: commitSec });
  const score = (parameters: WorldParameters) => {
    const run = simulate({ untilSec: 420, plan, parameters, chaos, interventionCommitSec: commitSec });
    return Math.abs(run.minimumCriticalCapacity - baseline.minimumCriticalCapacity) + Math.abs(run.failures - baseline.failures) * 20;
  };

  const variants: Array<[keyof WorldParameters, string, string, WorldParameters]> = [
    ['telecomBackupSec', 'Telecom 07 reserve', 'Verify Telecom 07 battery reserve', { ...BASE_PARAMETERS, telecomBackupSec: BASE_PARAMETERS.telecomBackupSec * 0.72 }],
    ['gridSparePct', 'Grid B spare capacity', 'Verify Grid B spare capacity', { ...BASE_PARAMETERS, gridSparePct: BASE_PARAMETERS.gridSparePct * 0.72 }],
    ['mobileTravelSec', 'Mobile unit travel time', 'Verify Mobile Unit 01 route and ETA', { ...BASE_PARAMETERS, mobileTravelSec: BASE_PARAMETERS.mobileTravelSec + 18 }],
    ['repairDelaySec', 'Substation repair ETA', 'Confirm repair crew ETA', { ...BASE_PARAMETERS, repairDelaySec: BASE_PARAMETERS.repairDelaySec + 80 }],
    ['floodGrowth', 'Flood progression', 'Re-measure flood progression near Substation 03', { ...BASE_PARAMETERS, floodGrowth: BASE_PARAMETERS.floodGrowth * 1.16 }],
  ];

  return variants
    .map(([key, label, nextObservation, parameters]) => ({ key, label, nextObservation, score: score(parameters) }))
    .sort((a, b) => b.score - a.score);
}

export function pairedPrevention(plan: PlanId, chaos: ChaosFlags, commitSec: number, count = 256, seed = SCENARIO_SEED) {
  const samples = generateFutureSamples(count, seed);
  let atRiskWithout = 0;
  let prevented = 0;
  for (const sample of samples) {
    const noAction = simulate({ untilSec: 420, plan: 'NO_ACTION', parameters: sample.parameters, chaos, interventionCommitSec: commitSec });
    const withPlan = simulate({ untilSec: 420, plan, parameters: sample.parameters, chaos, interventionCommitSec: commitSec });
    const noActionHospital = noAction.checkpoints.some(s => ['critical', 'failed'].includes(s.nodes.hospN.status));
    const withPlanHospital = withPlan.checkpoints.some(s => ['critical', 'failed'].includes(s.nodes.hospN.status));
    if (noActionHospital) {
      atRiskWithout += 1;
      if (!withPlanHospital) prevented += 1;
    }
  }
  return { atRiskWithout, prevented, total: count };
}
