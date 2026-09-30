import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { BASE_PARAMETERS, EDGES, NODES, PLANS, SCENARIO_DURATION_SEC, SCENARIO_SEED } from './data/city01';
import { deriveTrustState, edgeState, evidenceAt, simulate, snapshotAt } from './core/engine';
import { evaluateAllPlans, pairedPrevention, selectedPlanSensitivity } from './core/planning';
import { assuranceProofs } from './core/assurance';
import { detectEdgeCapability } from './edge/capabilities';
import type { ChaosFlags, EvidenceKind, PlanEvaluation, PlanId, Status, TraceEvent } from './core/types';

const statusGlyph: Record<Status, string> = {
  healthy: '●', stressed: '◐', degraded: '▲', critical: '◆', failed: '×', recovering: '↻',
};
const statusLabel: Record<Status, string> = {
  healthy: 'HEALTHY', stressed: 'STRESSED', degraded: 'DEGRADED', critical: 'CRITICAL', failed: 'FAILED', recovering: 'RECOVERING',
};
const initialChaos: ChaosFlags = { roadBlocked: false, sensorConflict: false, staleCamera: false, secondShock: false, npuUnavailable: false };

type Tab = 'COMMAND' | 'FUTURES' | 'CHAOS LAB' | 'EDGE LAB' | 'AUDIT';
type AuditEntry = { time: number; kind: EvidenceKind | 'system'; message: string; ref: string };

function formatSeconds(value: number | null) {
  if (value == null) return '—';
  if (value <= 0) return '00:00';
  const minutes = Math.floor(value / 60).toString().padStart(2, '0');
  const seconds = Math.floor(value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function missionTime(t: number) {
  const base = 19 * 3600 + 42 * 60;
  const total = base + t;
  const hh = Math.floor(total / 3600) % 24;
  const mm = Math.floor((total % 3600) / 60);
  const ss = total % 60;
  return [hh, mm, ss].map(x => String(x).padStart(2, '0')).join(':');
}

function statusSeverity(status: Status) {
  return ({ healthy: 0, recovering: 1, stressed: 2, degraded: 3, critical: 4, failed: 5 } as const)[status];
}

function useMission() {
  const [t, setT] = useState(0);
  const [tab, setTab] = useState<Tab>('COMMAND');
  const [chaos, setChaos] = useState<ChaosFlags>(initialChaos);
  const [worldRevision, setWorldRevision] = useState(0);
  const [forecastRevision, setForecastRevision] = useState(0);
  const [forecastChaos, setForecastChaos] = useState<ChaosFlags>(initialChaos);
  const [forecastCommitSec, setForecastCommitSec] = useState(48);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('REROUTE_MOBILE');
  const [activePlan, setActivePlan] = useState<PlanId>('NO_ACTION');
  const [activeCommitSec, setActiveCommitSec] = useState(0);
  const [futureOffset, setFutureOffset] = useState(90);
  const [audit, setAudit] = useState<AuditEntry[]>([
    { time: 0, kind: 'system', message: 'CITY//01 initialized with deterministic seed 271828.', ref: 'SYS-0001' },
  ]);

  const appendAudit = (kind: AuditEntry['kind'], message: string, ref: string, at = t) => {
    setAudit(items => [...items, { time: at, kind, message, ref }]);
  };

  const liveRun = useMemo(() => simulate({
    untilSec: t,
    plan: activePlan,
    parameters: BASE_PARAMETERS,
    chaos,
    interventionCommitSec: activeCommitSec,
  }), [t, activePlan, activeCommitSec, chaos]);

  const evaluations = useMemo(
    () => evaluateAllPlans(forecastChaos, forecastCommitSec, 256, SCENARIO_SEED),
    [forecastChaos, forecastCommitSec],
  );
  const selectedEvaluation = evaluations.find(e => e.plan === selectedPlan)!;
  const sensitivity = useMemo(
    () => selectedPlanSensitivity(selectedPlan, forecastChaos, forecastCommitSec),
    [selectedPlan, forecastChaos, forecastCommitSec],
  );
  const prevention = useMemo(
    () => pairedPrevention(selectedPlan, forecastChaos, forecastCommitSec, 256, SCENARIO_SEED),
    [selectedPlan, forecastChaos, forecastCommitSec],
  );

  const futureSnapshots = useMemo(() => {
    const until = Math.min(SCENARIO_DURATION_SEC, forecastCommitSec + futureOffset);
    return Object.keys(PLANS).reduce<Record<PlanId, ReturnType<typeof snapshotAt>>>((acc, id) => {
      const plan = id as PlanId;
      const run = simulate({ untilSec: until, plan, parameters: BASE_PARAMETERS, chaos: forecastChaos, interventionCommitSec: forecastCommitSec });
      acc[plan] = snapshotAt(run, until);
      return acc;
    }, {} as Record<PlanId, ReturnType<typeof snapshotAt>>);
  }, [forecastChaos, forecastCommitSec, futureOffset]);

  const lease = worldRevision === forecastRevision ? 'ACTIVE' : 'EXPIRED';
  const trust = deriveTrustState(t, chaos);
  const evidence = evidenceAt(t, chaos, BASE_PARAMETERS);

  const noActionBase = useMemo(() => simulate({ untilSec: 420, plan: 'NO_ACTION', parameters: BASE_PARAMETERS, chaos: forecastChaos, interventionCommitSec: forecastCommitSec }), [forecastChaos, forecastCommitSec]);
  const noActionAdverse = useMemo(() => simulate({ untilSec: 420, plan: 'NO_ACTION', parameters: { ...BASE_PARAMETERS, floodGrowth: 1.13, telecomBackupSec: 102 }, chaos: forecastChaos, interventionCommitSec: forecastCommitSec }), [forecastChaos, forecastCommitSec]);
  const noActionOptimistic = useMemo(() => simulate({ untilSec: 420, plan: 'NO_ACTION', parameters: { ...BASE_PARAMETERS, floodGrowth: 0.88, telecomBackupSec: 140 }, chaos: forecastChaos, interventionCommitSec: forecastCommitSec }), [forecastChaos, forecastCommitSec]);
  const impactCandidates = [noActionAdverse.firstCriticalImpactSec, noActionBase.firstCriticalImpactSec, noActionOptimistic.firstCriticalImpactSec].filter((v): v is number => v != null);
  const cascadeEarliest = impactCandidates.length ? Math.max(0, Math.min(...impactCandidates) - t) : null;
  const cascadeLatest = impactCandidates.length ? Math.max(0, Math.max(...impactCandidates) - t) : null;

  const advance = (delta = 15) => setT(value => Math.min(SCENARIO_DURATION_SEC, value + delta));
  const reset = () => {
    setT(0); setChaos(initialChaos); setWorldRevision(0); setForecastRevision(0); setForecastChaos(initialChaos); setForecastCommitSec(48);
    setSelectedPlan('REROUTE_MOBILE'); setActivePlan('NO_ACTION'); setActiveCommitSec(0); setFutureOffset(90);
    setAudit([{ time: 0, kind: 'system', message: 'CITY//01 initialized with deterministic seed 271828.', ref: 'SYS-0001' }]);
  };

  const toggleChaos = (key: keyof ChaosFlags, minimumTime: number, message: string) => {
    setT(value => Math.max(value, minimumTime));
    setChaos(current => ({ ...current, [key]: !current[key] }));
    setWorldRevision(value => value + 1);
    appendAudit('observed', message, `E-${8200 + worldRevision}` , Math.max(t, minimumTime));
  };

  const replan = () => {
    setForecastChaos({ ...chaos });
    setForecastCommitSec(t);
    setForecastRevision(worldRevision);
    appendAudit('system', 'Forecast lease renewed. Reality Forks recomputed using current world revision.', `F-${9000 + worldRevision}`);
  };

  const commitPlan = () => {
    if (lease !== 'ACTIVE') {
      appendAudit('system', 'Plan selection blocked because forecast lease is expired.', 'SK-LEASE');
      return;
    }
    if (selectedEvaluation.safety === 'REJECT' || selectedEvaluation.decisionMargin === 'MISSED') {
      appendAudit('system', `Safety Kernel rejected ${PLANS[selectedPlan].name}.`, 'SK-REJECT');
      return;
    }
    setActivePlan(selectedPlan);
    setActiveCommitSec(t);
    appendAudit('system', `${PLANS[selectedPlan].name} committed to the CITY//01 simulation.`, `P-${selectedPlan}`);
  };

  const exportCapsule = () => {
    const capsule = {
      product: 'CHAIN//REACTION', scenario: 'MONSOON ZERO', seed: SCENARIO_SEED, time: t,
      worldRevision, forecastRevision, chaos, forecastChaos, forecastCommitSec, selectedPlan, activePlan, activeCommitSec,
      evaluation: selectedEvaluation, evidence, trace: liveRun.final.trace, audit,
      simulationBoundary: 'CITY//01 synthetic environment — not operational municipal validation',
    };
    const blob = new Blob([JSON.stringify(capsule, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = `monsoon-zero-t${t}.crx.json`; link.click();
    URL.revokeObjectURL(url);
  };

  return {
    t, setT, tab, setTab, chaos, selectedPlan, setSelectedPlan, activePlan, liveRun, evaluations, selectedEvaluation,
    sensitivity, prevention, futureSnapshots, futureOffset, setFutureOffset, evidence, lease, trust, cascadeEarliest, cascadeLatest,
    forecastCommitSec, worldRevision, forecastRevision, audit, advance, reset, toggleChaos, replan, commitPlan, exportCapsule,
  };
}

function App() {
  const mission = useMission();
  return <div className="app-shell">
    <header className="topbar">
      <div className="brand-block"><div className="brand">CHAIN//REACTION</div><div className="subtitle">EDGE CAUSAL RESILIENCE INTELLIGENCE</div></div>
      <div className="topmeta">
        <span>CITY//01</span><span className="mode-badge">SIMULATION MODE</span><span className={`trust-badge trust-${mission.trust.toLowerCase().replace(' ', '-')}`}>{mission.trust}</span>
      </div>
    </header>

    <nav className="nav" aria-label="Primary">
      {(['COMMAND','FUTURES','CHAOS LAB','EDGE LAB','AUDIT'] as Tab[]).map(tab => <button key={tab} className={mission.tab === tab ? 'active' : ''} onClick={() => mission.setTab(tab)}>{tab}</button>)}
    </nav>

    {mission.tab === 'COMMAND' && <Command mission={mission} />}
    {mission.tab === 'FUTURES' && <Futures mission={mission} />}
    {mission.tab === 'CHAOS LAB' && <ChaosLab mission={mission} />}
    {mission.tab === 'EDGE LAB' && <EdgeLab mission={mission} />}
    {mission.tab === 'AUDIT' && <Audit mission={mission} />}

    <footer className="statusbar">
      <span>EDGE PULSE <b>{mission.chaos.npuUnavailable ? 'DEGRADED' : 'READY'}</b></span>
      <span>NPU <b>{mission.chaos.npuUnavailable ? 'UNAVAILABLE / CPU FALLBACK' : 'PROOF PENDING HARDWARE'}</b></span>
      <span>FORECAST LEASE <b className={mission.lease === 'EXPIRED' ? 'text-danger' : ''}>{mission.lease}</b></span>
      <span>CLOUD INFERENCE <b>0</b></span>
    </footer>
  </div>;
}

type Mission = ReturnType<typeof useMission>;

function Command({ mission }: { mission: Mission }) {
  const snap = mission.liveRun.final;
  const selected = mission.selectedEvaluation;
  const nextObs = mission.sensitivity[0];
  const decisionHorizon = selected.decisionHorizonSec == null ? null : Math.max(0, selected.decisionHorizonSec - Math.max(0, mission.t - mission.forecastCommitSec));

  return <main className="command-grid">
    <section className="panel map-panel">
      <PanelTitle left="LIVING CAUSAL TWIN" right={`T+${mission.t}s · ${missionTime(mission.t)}`} />
      <Network snapshot={snap} />
      <div className="legend">{(['healthy','stressed','degraded','critical','failed','recovering'] as Status[]).map(s => <span key={s}>{statusGlyph[s]} {statusLabel[s]}</span>)}</div>
    </section>

    <aside className="side-stack">
      <MetricCard label="CASCADE WINDOW" value={mission.cascadeEarliest == null ? '—' : `${formatSeconds(mission.cascadeEarliest)} — ${formatSeconds(mission.cascadeLatest)}`} description="Critical-service impact under plausible no-action futures" hero />
      <MetricCard label="DECISION HORIZON" value={formatSeconds(decisionHorizon)} description={`Latest safe commit for ${PLANS[mission.selectedPlan].name}`} hero danger={decisionHorizon != null && decisionHorizon < 20} />
      <MetricCard label="PLAN ROBUSTNESS" value={`${selected.robustness}%`} description={`${selected.safeFutures}/${selected.totalFutures} sampled futures remain inside the safety envelope`} />
      <MetricCard label="TWIN CONSISTENCY" value={mission.chaos.sensorConflict ? 'CONFLICT' : mission.chaos.staleCamera ? 'DEGRADED' : 'ALIGNED'} description={mission.chaos.sensorConflict ? 'Evidence sources disagree; confidence is reduced.' : 'Observed and simulated state remain within the demo envelope.'} danger={mission.chaos.sensorConflict} />
    </aside>

    <section className="panel evidence-panel">
      <PanelTitle left="EVIDENCE FABRIC" right={`${mission.evidence.length} SOURCES`} />
      {mission.evidence.length === 0 && <EmptyState title="NO INCIDENT EVIDENCE" copy="Advance MONSOON ZERO to T+8 to begin the incident." />}
      {mission.evidence.map(event => <div className="evidence-row" key={event.id}>
        <div><div className="eyebrow">{event.kind.toUpperCase()}</div><b>{event.event}</b><small>{event.source} · {event.id} · event T+{event.eventTime}s</small></div>
        <div className="evidence-meta"><span>{Math.round(event.confidence * 100)}%</span><span>{Math.max(0, mission.t - event.eventTime)}s age</span><span>{event.trust}</span></div>
      </div>)}
    </section>

    <section className="panel control-panel">
      <PanelTitle left="MONSOON ZERO" right="SCENARIO CONTROL" />
      <div className="scenario-clock"><small>MISSION CLOCK</small><strong>{missionTime(mission.t)}</strong><span>T+{mission.t} / {SCENARIO_DURATION_SEC}s</span></div>
      <div className="control-buttons">
        <button onClick={() => mission.advance(15)}>ADVANCE +15s</button>
        <button onClick={() => mission.setTab('FUTURES')} className="secondary">OPEN REALITY FORKS</button>
        <button onClick={mission.replan} className={mission.lease === 'EXPIRED' ? 'attention' : 'secondary'}>REPLAN FROM CURRENT WORLD</button>
        <button onClick={mission.reset} className="ghost">RESET CITY//01</button>
      </div>
      <div className="next-observation">
        <small>NEXT BEST OBSERVATION</small>
        <strong>{nextObs?.nextObservation ?? 'No additional observation required'}</strong>
        <span>{nextObs ? `Decision sensitivity: ${nextObs.score > 18 ? 'HIGH' : nextObs.score > 8 ? 'MEDIUM' : 'LOW'} · ${nextObs.label}` : ''}</span>
      </div>
    </section>
  </main>;
}

function Network({ snapshot }: { snapshot: Mission['liveRun']['final'] }) {
  const nodeMeta = Object.fromEntries(NODES.map(node => [node.id, node]));
  return <div className="network" role="img" aria-label="CITY//01 causal infrastructure topology">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
      {EDGES.map(edge => {
        const source = nodeMeta[edge.source]; const target = nodeMeta[edge.target]; const state = edgeState(edge.source, snapshot);
        const active = statusSeverity(state) >= 2;
        return <g key={edge.id}>
          <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} className={`edge ${state} ${active ? 'propagating' : ''}`} />
          <text x={(source.x + target.x) / 2} y={(source.y + target.y) / 2 - 1.2} className="edge-label">{edge.type}</text>
        </g>;
      })}
    </svg>
    {NODES.map(meta => {
      const node = snapshot.nodes[meta.id];
      return <div key={meta.id} className={`node ${node.status}`} style={{ left: `${meta.x}%`, top: `${meta.y}%` }} title={`${meta.label}: ${statusLabel[node.status]}, capacity ${Math.round(node.capacity)}%`}>
        <div className="node-head"><span className="node-glyph">{statusGlyph[node.status]}</span><span className="node-kind">{meta.kind}</span></div>
        <b>{meta.label}</b>
        <div className="node-bars"><MiniBar label="CAP" value={node.capacity} /><MiniBar label="RES" value={meta.id === 'tel07' ? Math.min(100, node.reserve / 1.2) : node.reserve} /></div>
      </div>;
    })}
  </div>;
}

function Futures({ mission }: { mission: Mission }) {
  const selectedEval = mission.selectedEvaluation;
  const selectedSnapshot = mission.futureSnapshots[mission.selectedPlan];
  const noActionSnapshot = mission.futureSnapshots.NO_ACTION;
  const hospitalDiff = statusLabel[selectedSnapshot.nodes.hospN.status];
  const noActionHospital = statusLabel[noActionSnapshot.nodes.hospN.status];
  const preventionRate = mission.prevention.atRiskWithout === 0 ? 0 : Math.round(mission.prevention.prevented / mission.prevention.atRiskWithout * 100);

  return <main className="stack">
    {mission.lease === 'EXPIRED' && <div className="lease-alert"><div><b>FORECAST LEASE EXPIRED</b><span>New evidence changed the world model. Existing branch results are stale.</span></div><button onClick={mission.replan}>REPLAN NOW</button></div>}

    <section className="panel future-toolbar">
      <PanelTitle left="REALITY FORKS" right={`SNAPSHOT T+${mission.forecastCommitSec}s · COMMON RANDOMNESS`} />
      <div className="timeline-row"><span>+30s</span><input type="range" min="30" max="240" step="15" value={mission.futureOffset} onChange={event => mission.setFutureOffset(Number(event.target.value))} /><span>+240s</span><strong>VIEW +{mission.futureOffset}s</strong></div>
    </section>

    <section className="branch-grid">
      {mission.evaluations.map(evaluation => <BranchCard key={evaluation.plan} evaluation={evaluation} selected={mission.selectedPlan === evaluation.plan} onSelect={() => mission.setSelectedPlan(evaluation.plan)} snapshot={mission.futureSnapshots[evaluation.plan]} />)}
    </section>

    <section className="panel compare-panel">
      <PanelTitle left="SYNCHRONIZED FUTURE COMPARISON" right={`T+${Math.min(SCENARIO_DURATION_SEC, mission.forecastCommitSec + mission.futureOffset)}s`} />
      <div className="compare-grid">
        <FutureColumn title="NO ACTION" snapshot={noActionSnapshot} highlight={false} />
        <div className="divergence-column">
          <small>WHY DIFFERENT?</small>
          <strong>{mission.selectedPlan === 'NO_ACTION' ? 'BASELINE' : `${PLANS[mission.selectedPlan].name} changes the downstream capacity path.`}</strong>
          <p>Hospital North is <b>{noActionHospital}</b> without action and <b>{hospitalDiff}</b> in the selected branch at the synchronized future time.</p>
          <div className="causal-trace">SUBSTATION 03 → TELECOM 07 → HOSPITAL NORTH</div>
        </div>
        <FutureColumn title={PLANS[mission.selectedPlan].name} snapshot={selectedSnapshot} highlight />
      </div>
    </section>

    <section className="panel decision-panel">
      <div className="decision-summary">
        <div><small>SAFETY KERNEL</small><strong className={selectedEval.safety === 'REJECT' ? 'text-danger' : ''}>{selectedEval.safety}</strong></div>
        <div><small>DECISION MARGIN</small><strong>{selectedEval.decisionMargin}</strong></div>
        <div><small>RECOVERY DEBT</small><strong>{selectedEval.recoveryDebt}</strong></div>
        <div><small>PROOF OF PREVENTION</small><strong>{preventionRate}%</strong><span>{mission.prevention.prevented}/{mission.prevention.atRiskWithout} paired hospital-risk futures prevented</span></div>
      </div>
      {selectedEval.infeasibleReason && <div className="infeasible"><b>INFEASIBILITY CERTIFICATE</b><span>{selectedEval.infeasibleReason}</span></div>}
      <div className="action-row"><button onClick={mission.commitPlan} disabled={mission.lease === 'EXPIRED' || selectedEval.safety === 'REJECT'}>COMMIT TO SIMULATION</button><button className="secondary" onClick={() => mission.setTab('COMMAND')}>RETURN TO COMMAND</button></div>
    </section>
  </main>;
}

function BranchCard({ evaluation, selected, onSelect, snapshot }: { evaluation: PlanEvaluation; selected: boolean; onSelect: () => void; snapshot: Mission['futureSnapshots'][PlanId] }) {
  const hospital = snapshot.nodes.hospN.status;
  return <button className={`branch-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
    <div className="branch-top"><small>{PLANS[evaluation.plan].name}</small><span className={`safety-chip ${evaluation.safety.toLowerCase()}`}>{evaluation.safety}</span></div>
    <strong>{evaluation.robustness}%</strong><span className="muted-label">ROBUSTNESS · {evaluation.safeFutures}/{evaluation.totalFutures} SAFE FUTURES</span>
    <div className="branch-kpis">
      <Kpi label="Decision horizon" value={formatSeconds(evaluation.decisionHorizonSec)} />
      <Kpi label="Decision margin" value={evaluation.decisionMargin} />
      <Kpi label="Hospital @ view" value={statusLabel[hospital]} />
      <Kpi label="Recovery debt" value={evaluation.recoveryDebt} />
      <Kpi label="Median failures" value={String(evaluation.medianFailures)} />
      <Kpi label="Worst failures" value={String(evaluation.worstFailures)} />
    </div>
  </button>;
}

function ChaosLab({ mission }: { mission: Mission }) {
  const cases: Array<[keyof ChaosFlags, string, string, number]> = [
    ['roadBlocked', 'ROAD_12 BLOCK', 'Invalidates the mobile-unit access assumption before activation.', 74],
    ['sensorConflict', 'CONTRADICTORY SENSOR', 'Water sensor reports normal while camera evidence reports flood.', 24],
    ['staleCamera', 'STALE CAMERA FEED', 'Reduces perception freshness and trust without hiding the incident.', 36],
    ['secondShock', 'SECONDARY LOAD SPIKE', 'Tests post-intervention resilience and recovery debt.', 185],
    ['npuUnavailable', 'NPU UNAVAILABLE', 'Forces explicit degraded edge state; simulation remains operational.', 0],
  ];
  return <main className="stack">
    <section className="panel">
      <PanelTitle left="CHAOS LAB" right="RED-TEAM THE SYSTEM, NOT JUST THE CITY" />
      <div className="chaos-grid">{cases.map(([key, title, detail, time]) => <button key={key} className={`chaos-card ${mission.chaos[key] ? 'active' : ''}`} onClick={() => mission.toggleChaos(key, time, `${title} injected into CITY//01.`)}>
        <span>{mission.chaos[key] ? 'ACTIVE' : 'INJECT'}</span><b>{title}</b><small>{detail}</small>
      </button>)}</div>
    </section>
    <section className="panel coverage-panel">
      <PanelTitle left="COVERAGE ATLAS" right="ASSURANCE MATRIX" />
      <div className="coverage-grid">
        {[
          ['Deterministic replay','PROVEN'],['Common-randomness forks','PROVEN'],['Late/duplicate event contract','DESIGNED'],['Evidence conflict','PROVEN'],['Forecast invalidation','PROVEN'],['No-safe-plan behavior','PROVEN'],['Network offline core','PROVEN'],['NPU fallback state','DESIGNED'],['Application recovery journal','DESIGNED'],['Operational city validation','NOT CLAIMED'],
        ].map(([name, state]) => <div className="coverage" key={name}><span>{name}</span><b>{state}</b></div>)}
      </div>
    </section>
  </main>;
}

function EdgeLab({ mission }: { mission: Mission }) {
  const capability = detectEdgeCapability();
  return <main className="stack">
    <section className="panel">
      <PanelTitle left="EDGE LAB" right="SNAPDRAGON CAPABILITY CONTRACT" />
      <div className="edge-grid">
        <EdgeMetric label="Architecture" value={capability.architecture} />
        <EdgeMetric label="Runtime" value={capability.runtime} />
        <EdgeMetric label="NPU execution proof" value={mission.chaos.npuUnavailable ? 'UNAVAILABLE / EXPLICIT FALLBACK' : 'PENDING EXACT-DEVICE PROFILE'} />
        <EdgeMetric label="Cloud inference" value="0" />
        <EdgeMetric label="Perception artifact" value={capability.modelArtifact} />
        <EdgeMetric label="Simulation workload" value="Deterministic CPU" />
        <EdgeMetric label="Safety Kernel" value="Deterministic CPU" />
        <EdgeMetric label="Visualization" value="Browser GPU / compositor" />
      </div>
      <div className="technical-note"><b>NO FAKE NPU METRICS.</b> The hardware gate is: compile → execute → profile on the exact Snapdragon-powered HP target → verify per-layer placement → then publish measured P50/P95, load time, memory, and NPU coverage.</div>
    </section>

    <section className="panel">
      <PanelTitle left="ASSURANCE CASE" right="CLAIM → EVIDENCE" />
      <div className="assurance-list">{assuranceProofs.map(proof => <div className="assurance-row" key={proof.claim}><div><b>{proof.claim}</b><span>{proof.evidence}</span></div><strong className={`proof-${proof.status.toLowerCase().replaceAll(' ', '-')}`}>{proof.status}</strong></div>)}</div>
    </section>
  </main>;
}

function Audit({ mission }: { mission: Mission }) {
  const merged: AuditEntry[] = [
    ...mission.audit,
    ...mission.liveRun.final.trace.slice(-10).map((trace: TraceEvent) => ({ time: trace.time, kind: (trace.kind === 'system' ? 'system' : trace.kind) as AuditEntry['kind'], message: trace.message, ref: trace.id })),
  ].sort((a, b) => a.time - b.time).slice(-20);
  return <main className="stack">
    <section className="panel audit-panel">
      <PanelTitle left="AUDIT & REPLAY" right={`WORLD REV ${mission.worldRevision} · FORECAST REV ${mission.forecastRevision}`} />
      <div className="audit-legend"><span className="tag observed">OBS = observed</span><span className="tag assumed">ASM = assumed</span><span className="tag predicted">PRD = predicted</span><span className="tag system">SYS = system</span></div>
      {merged.map((entry, index) => <div className="audit-row" key={`${entry.ref}-${index}`}><span>{missionTime(entry.time)}</span><b className={`tag ${entry.kind}`}>{entry.kind.toUpperCase()}</b><span>{entry.message}</span><code>{entry.ref}</code></div>)}
    </section>

    <section className="panel audit-summary">
      <div><small>SCENARIO</small><strong>MONSOON ZERO</strong></div><div><small>SEED</small><strong>{SCENARIO_SEED}</strong></div><div><small>SIMULATION BOUNDARY</small><strong>CITY//01 SYNTHETIC</strong></div><div><small>ACTIVE PLAN</small><strong>{PLANS[mission.activePlan].name}</strong></div>
    </section>

    <section className="panel capsule-panel">
      <div><PanelTitle left="REPRODUCIBILITY CAPSULE" right="EXPORT CURRENT RUN" /><p>Exports scenario seed, world and forecast revisions, chaos state, evidence, active/selected plans, evaluation and trace data. The capsule is designed to make judging runs inspectable and reproducible.</p></div>
      <button onClick={mission.exportCapsule}>EXPORT .CRX.JSON</button>
    </section>
  </main>;
}

function FutureColumn({ title, snapshot, highlight }: { title: string; snapshot: Mission['futureSnapshots'][PlanId]; highlight: boolean }) {
  return <div className={`future-column ${highlight ? 'highlight' : ''}`}><small>{title}</small>{['sub03','tel07','hospN','ems01'].map(id => { const meta = NODES.find(n => n.id === id)!; const node = snapshot.nodes[id]; return <div className="future-node" key={id}><span>{meta.label}</span><b className={`state-${node.status}`}>{statusGlyph[node.status]} {statusLabel[node.status]}</b></div>; })}</div>;
}

function PanelTitle({ left, right }: { left: string; right: string }) { return <div className="panel-title"><span>{left}</span><span>{right}</span></div>; }
function MetricCard({ label, value, description, hero = false, danger = false }: { label: string; value: string; description: string; hero?: boolean; danger?: boolean }) { return <section className={`metric-card ${hero ? 'hero' : ''}`}><small>{label}</small><strong className={danger ? 'text-danger' : ''}>{value}</strong><span>{description}</span></section>; }
function EdgeMetric({ label, value }: { label: string; value: string }) { return <div className="edge-metric"><small>{label}</small><strong>{value}</strong></div>; }
function Kpi({ label, value }: { label: string; value: string }) { return <div><b>{value}</b><small>{label}</small></div>; }
function MiniBar({ label, value }: { label: string; value: number }) { return <div className="mini-bar"><span>{label}</span><div><i style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div><b>{Math.round(value)}</b></div>; }
function EmptyState({ title, copy }: { title: string; copy: string }) { return <div className="empty-state"><b>{title}</b><span>{copy}</span></div>; }

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
