import React from 'react';
import { NODES, PLANS, SCENARIO_DURATION_SEC } from '../../data/city01';
import type { PlanEvaluation, PlanId } from '../../core/types';
import type { Mission } from '../../app/useMission';
import { formatSeconds } from '../../shared/format';
import { STATUS_GLYPH, STATUS_LABEL } from '../../shared/status';
import { Kpi, PanelTitle } from '../../ui/primitives';

export function FuturesView({ mission }: { mission: Mission }) {
  const selectedEvaluation = mission.selectedEvaluation;
  const selectedSnapshot = mission.futureSnapshots[mission.selectedPlan];
  const noActionSnapshot = mission.futureSnapshots.NO_ACTION;
  const hospitalWithPlan = STATUS_LABEL[selectedSnapshot.nodes.hospN.status];
  const hospitalWithoutPlan = STATUS_LABEL[noActionSnapshot.nodes.hospN.status];
  const preventionRate = mission.prevention.atRiskWithout === 0
    ? 0
    : Math.round((mission.prevention.prevented / mission.prevention.atRiskWithout) * 100);
  const commitBlockedReason = mission.lease === 'EXPIRED'
    ? 'Replan before committing because the forecast lease has expired.'
    : selectedEvaluation.safety === 'REJECT'
      ? 'The Safety Kernel rejected this intervention.'
      : selectedEvaluation.decisionMargin === 'MISSED'
        ? 'The intervention window has already been missed.'
        : null;

  return <main className="stack">
    {mission.lease === 'EXPIRED' && (
      <div className="lease-alert" role="alert">
        <div>
          <b>FORECAST LEASE EXPIRED</b>
          <span>
            {mission.leaseInfo.reason === 'WORLD_CHANGED'
              ? 'New evidence changed the world model.'
              : 'The forecast validity window elapsed.'}{' '}
            Existing branch results are stale.
          </span>
        </div>
        <button onClick={mission.replan}>REPLAN NOW</button>
      </div>
    )}

    <section className="panel future-toolbar">
      <PanelTitle left="REALITY FORKS" right={`SNAPSHOT T+${mission.forecastCommitSec}s · COMMON RANDOMNESS`} />
      <div className="timeline-row">
        <span>+30s</span>
        <input
          aria-label="Future horizon"
          type="range"
          min="30"
          max="240"
          step="15"
          value={mission.futureOffset}
          aria-valuetext={`View future at +${mission.futureOffset} seconds`}
          onChange={event => mission.setFutureOffset(Number(event.target.value))}
        />
        <span>+240s</span>
        <strong>VIEW +{mission.futureOffset}s</strong>
      </div>
    </section>

    <section className="branch-grid" aria-label="Intervention choices">
      {mission.evaluations.map(evaluation => (
        <BranchCard
          key={evaluation.plan}
          evaluation={evaluation}
          selected={mission.selectedPlan === evaluation.plan}
          onSelect={() => mission.setSelectedPlan(evaluation.plan)}
          snapshot={mission.futureSnapshots[evaluation.plan]}
        />
      ))}
    </section>

    <section className="panel compare-panel">
      <PanelTitle
        left="SYNCHRONIZED FUTURE COMPARISON"
        right={`T+${Math.min(SCENARIO_DURATION_SEC, mission.forecastCommitSec + mission.futureOffset)}s`}
      />
      <div className="compare-grid">
        <FutureColumn title="NO ACTION" snapshot={noActionSnapshot} highlight={false} />
        <div className="divergence-column">
          <small>WHY DIFFERENT?</small>
          <strong>
            {mission.selectedPlan === 'NO_ACTION'
              ? 'BASELINE'
              : `${PLANS[mission.selectedPlan].name} changes the downstream capacity path.`}
          </strong>
          <p>
            Hospital North is <b>{hospitalWithoutPlan}</b> without action and <b>{hospitalWithPlan}</b> in the selected branch at the synchronized future time.
          </p>
          <div className="causal-trace">SUBSTATION 03 → TELECOM 07 → HOSPITAL NORTH</div>
        </div>
        <FutureColumn title={PLANS[mission.selectedPlan].name} snapshot={selectedSnapshot} highlight />
      </div>
    </section>

    <section className="panel decision-panel">
      <div className="decision-summary">
        <div><small>SAFETY KERNEL</small><strong className={selectedEvaluation.safety === 'REJECT' ? 'text-danger' : ''}>{selectedEvaluation.safety}</strong></div>
        <div><small>DECISION MARGIN</small><strong>{selectedEvaluation.decisionMargin}</strong></div>
        <div><small>RECOVERY DEBT</small><strong>{selectedEvaluation.recoveryDebt}</strong></div>
        <div><small>DECISION STABILITY</small><strong>{mission.stability.state}</strong><span>{mission.stability.fragility}% fragility</span></div>
        <div><small>PROOF OF PREVENTION</small><strong>{preventionRate}%</strong><span>{mission.prevention.prevented}/{mission.prevention.atRiskWithout} paired hospital-risk futures prevented</span></div>
      </div>
      {selectedEvaluation.infeasibleReason && (
        <div className="infeasible"><b>INFEASIBILITY CERTIFICATE</b><span>{selectedEvaluation.infeasibleReason}</span></div>
      )}
      <div className="action-row">
        <button
          onClick={mission.commitPlan}
          disabled={commitBlockedReason != null}
          aria-describedby={commitBlockedReason ? 'commit-blocked-reason' : undefined}
        >
          COMMIT TO SIMULATION
        </button>
        <button className="secondary" onClick={() => mission.setTab('COMMAND')}>RETURN TO COMMAND</button>
        {commitBlockedReason && <span id="commit-blocked-reason" className="muted-label">{commitBlockedReason}</span>}
      </div>
    </section>
  </main>;
}

function BranchCard({
  evaluation,
  selected,
  onSelect,
  snapshot,
}: {
  evaluation: PlanEvaluation;
  selected: boolean;
  onSelect: () => void;
  snapshot: Mission['futureSnapshots'][PlanId];
}) {
  const hospital = snapshot.nodes.hospN.status;
  return <button
    className={`branch-card ${selected ? 'selected' : ''}`}
    onClick={onSelect}
    aria-pressed={selected}
    aria-label={`${PLANS[evaluation.plan].name}, robustness ${evaluation.robustness} percent, safety ${evaluation.safety}`}
  >
    <div className="branch-top">
      <small>{PLANS[evaluation.plan].name}</small>
      <span className={`safety-chip ${evaluation.safety.toLowerCase()}`}>{evaluation.safety}</span>
    </div>
    <strong>{evaluation.robustness}%</strong>
    <span className="muted-label">ROBUSTNESS · {evaluation.safeFutures}/{evaluation.totalFutures} SAFE FUTURES</span>
    <div className="branch-kpis">
      <Kpi label="Decision horizon" value={formatSeconds(evaluation.decisionHorizonSec)} />
      <Kpi label="Decision margin" value={evaluation.decisionMargin} />
      <Kpi label="Hospital @ view" value={STATUS_LABEL[hospital]} />
      <Kpi label="Recovery debt" value={evaluation.recoveryDebt} />
      <Kpi label="Median failures" value={String(evaluation.medianFailures)} />
      <Kpi label="Worst failures" value={String(evaluation.worstFailures)} />
    </div>
  </button>;
}

function FutureColumn({
  title,
  snapshot,
  highlight,
}: {
  title: string;
  snapshot: Mission['futureSnapshots'][PlanId];
  highlight: boolean;
}) {
  return <div className={`future-column ${highlight ? 'highlight' : ''}`}>
    <small>{title}</small>
    {['sub03', 'tel07', 'hospN', 'ems01'].map(id => {
      const meta = NODES.find(node => node.id === id)!;
      const node = snapshot.nodes[id];
      return <div className="future-node" key={id}>
        <span>{meta.label}</span>
        <b className={`state-${node.status}`}>{STATUS_GLYPH[node.status]} {STATUS_LABEL[node.status]}</b>
      </div>;
    })}
  </div>;
}
