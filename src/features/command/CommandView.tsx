import React from 'react';
import { PLANS, SCENARIO_DURATION_SEC } from '../../data/city01';
import type { Status } from '../../core/types';
import type { Mission } from '../../app/useMission';
import { formatSeconds, missionTime } from '../../shared/format';
import { STATUS_GLYPH, STATUS_LABEL } from '../../shared/status';
import { Network } from '../../ui/Network';
import { EmptyState, MetricCard, PanelTitle } from '../../ui/primitives';

export function CommandView({ mission }: { mission: Mission }) {
  const snapshot = mission.liveRun.final;
  const selected = mission.selectedEvaluation;
  const nextObservation = mission.sensitivity[0];
  const decisionHorizon = selected.decisionHorizonSec == null
    ? null
    : Math.max(0, selected.decisionHorizonSec - Math.max(0, mission.t - mission.forecastCommitSec));

  return <main className="command-grid">
    <section className="panel map-panel">
      <PanelTitle left="LIVING CAUSAL TWIN" right={`T+${mission.t}s · ${missionTime(mission.t)}`} />
      <Network snapshot={snapshot} />
      <div className="legend">
        {(['healthy', 'stressed', 'degraded', 'critical', 'failed', 'recovering'] as Status[]).map(status => (
          <span key={status}>{STATUS_GLYPH[status]} {STATUS_LABEL[status]}</span>
        ))}
      </div>
    </section>

    <aside className="side-stack">
      <MetricCard
        label="CASCADE WINDOW"
        value={mission.cascadeEarliest == null ? '—' : `${formatSeconds(mission.cascadeEarliest)} — ${formatSeconds(mission.cascadeLatest)}`}
        description="Critical-service impact under plausible no-action futures"
        hero
      />
      <MetricCard
        label="DECISION HORIZON"
        value={formatSeconds(decisionHorizon)}
        description={`Latest safe commit for ${PLANS[mission.selectedPlan].name}`}
        hero
        danger={decisionHorizon != null && decisionHorizon < 20}
      />
      <MetricCard
        label="PLAN ROBUSTNESS"
        value={`${selected.robustness}%`}
        description={`${selected.safeFutures}/${selected.totalFutures} sampled futures remain inside the safety envelope`}
      />
      <MetricCard
        label="DECISION STABILITY"
        value={mission.stability.state}
        description={`${mission.stability.fragility}% fragility · ${mission.stability.explanation}`}
        danger={mission.stability.state === 'LOW'}
      />
      <MetricCard
        label="TWIN CONSISTENCY"
        value={mission.chaos.sensorConflict ? 'CONFLICT' : mission.chaos.staleCamera ? 'DEGRADED' : 'ALIGNED'}
        description={mission.chaos.sensorConflict ? 'Evidence sources disagree; confidence is reduced.' : 'Observed and simulated state remain within the demo envelope.'}
        danger={mission.chaos.sensorConflict}
      />
    </aside>

    <section className="panel evidence-panel">
      <PanelTitle
        left="EVIDENCE FABRIC"
        right={`${mission.evidenceDiagnostics.normalizedCount}/${mission.evidenceDiagnostics.rawCount} NORMALIZED`}
      />
      <div className="audit-legend">
        <span>DUP {mission.evidenceDiagnostics.duplicates}</span>
        <span>LATE {mission.evidenceDiagnostics.lateEvents}</span>
        <span>STALE {mission.evidenceDiagnostics.staleEvents}</span>
        <span>SKEW {mission.evidenceDiagnostics.clockSkewedSources}</span>
        <span>CONFLICT {mission.evidenceDiagnostics.contradictions}</span>
      </div>
      {mission.evidence.length === 0 && (
        <EmptyState title="NO INCIDENT EVIDENCE" copy="Advance MONSOON ZERO to T+8 to begin the incident." />
      )}
      {mission.evidence.map(event => (
        <div className="evidence-row" key={event.id}>
          <div>
            <div className="eyebrow">{event.kind.toUpperCase()}</div>
            <b>{event.event}</b>
            <small>{event.source} · {event.id} · event T+{event.eventTime}s</small>
          </div>
          <div className="evidence-meta">
            <span>{Math.round(event.confidence * 100)}%</span>
            <span>{Math.max(0, mission.t - event.eventTime)}s age</span>
            <span>{event.trust}</span>
          </div>
        </div>
      ))}
    </section>

    <section className="panel control-panel">
      <PanelTitle left="MONSOON ZERO" right="SCENARIO CONTROL" />
      <div className="scenario-clock">
        <small>MISSION CLOCK</small>
        <strong>{missionTime(mission.t)}</strong>
        <span>T+{mission.t} / {SCENARIO_DURATION_SEC}s</span>
      </div>
      <div className="control-buttons">
        <button onClick={() => mission.setPlaying(!mission.playing)} className={mission.playing ? 'attention' : ''}>
          {mission.playing ? 'PAUSE LIVE RUN' : 'RUN MONSOON ZERO'}
        </button>
        <button onClick={() => mission.advance(15)} className="secondary">ADVANCE +15s</button>
        <button onClick={() => mission.setTab('FUTURES')} className="secondary">OPEN REALITY FORKS</button>
        <button onClick={mission.replan} className={mission.lease === 'EXPIRED' ? 'attention' : 'secondary'}>
          REPLAN FROM CURRENT WORLD
        </button>
        <button onClick={mission.reset} className="ghost">RESET CITY//01</button>
      </div>
      <div className="next-observation">
        <small>NEXT BEST OBSERVATION</small>
        <strong>{nextObservation?.nextObservation ?? 'No additional observation required'}</strong>
        <span>
          {nextObservation
            ? `Information value: ${mission.nextObservationValue.band} (${mission.nextObservationValue.score}) · ${nextObservation.label}`
            : ''}
        </span>
      </div>
    </section>
  </main>;
}
