import React from 'react';
import type { Mission } from '../../app/useMission';
import type { AuditEntry } from '../../app/types';
import type { TraceEvent } from '../../core/types';
import { PLANS, SCENARIO_SEED } from '../../data/city01';
import { traceFingerprint } from '../../core/integrity';
import { missionTime } from '../../shared/format';
import { Kpi, PanelTitle } from '../../ui/primitives';

export function AuditView({ mission }: { mission: Mission }) {
  const merged: AuditEntry[] = [
    ...mission.audit,
    ...mission.liveRun.final.trace.slice(-10).map((trace: TraceEvent) => ({
      time: trace.time,
      kind: (trace.kind === 'system' ? 'system' : trace.kind) as AuditEntry['kind'],
      message: trace.message,
      ref: trace.id,
    })),
  ].sort((a, b) => a.time - b.time).slice(-20);

  return <main className="stack">
    <section className="panel audit-panel">
      <PanelTitle left="AUDIT & REPLAY" right={`WORLD REV ${mission.worldRevision} · FORECAST REV ${mission.forecastRevision}`} />
      <div className="audit-legend">
        <span className="tag observed">OBS = observed</span>
        <span className="tag assumed">ASM = assumed</span>
        <span className="tag predicted">PRD = predicted</span>
        <span className="tag system">SYS = system</span>
      </div>
      {merged.map((entry, index) => (
        <div className="audit-row" key={`${entry.ref}-${index}`}>
          <span>{missionTime(entry.time)}</span>
          <b className={`tag ${entry.kind}`}>{entry.kind.toUpperCase()}</b>
          <span>{entry.message}</span>
          <code>{entry.ref}</code>
        </div>
      ))}
    </section>

    <section className="panel audit-summary">
      <div><small>SCENARIO</small><strong>MONSOON ZERO</strong></div>
      <div><small>SEED</small><strong>{SCENARIO_SEED}</strong></div>
      <div><small>SIMULATION BOUNDARY</small><strong>CITY//01 SYNTHETIC</strong></div>
      <div><small>ACTIVE PLAN</small><strong>{PLANS[mission.activePlan].name}</strong></div>
    </section>

    <section className="panel">
      <PanelTitle left="SYSTEM TRUST DECOMPOSITION" right={mission.runtimeTrust.state} />
      <div className="edge-grid">
        <Kpi label="Evidence" value={mission.runtimeTrust.evidence} />
        <Kpi label="Forecast freshness" value={mission.runtimeTrust.forecastFreshness} />
        <Kpi label="Perception" value={mission.runtimeTrust.perception} />
        <Kpi label="Hardware" value={mission.runtimeTrust.hardware} />
        <Kpi
          label="Trace fingerprint"
          value={traceFingerprint({ seed: SCENARIO_SEED, trace: mission.liveRun.final.trace, audit: mission.audit })}
        />
      </div>
      {mission.runtimeTrust.watchdog.length > 0 && (
        <div className="technical-note">
          {mission.runtimeTrust.watchdog.map(item => <span key={item}>{item}</span>)}
        </div>
      )}
    </section>

    <section className="panel capsule-panel">
      <div>
        <PanelTitle left="REPRODUCIBILITY CAPSULE" right="EXPORT CURRENT RUN" />
        <p>
          Exports scenario seed, world and forecast revisions, chaos state, evidence, active/selected plans, evaluation and trace data. The capsule is designed to make judging runs inspectable and reproducible.
        </p>
      </div>
      <button onClick={mission.exportCapsule}>EXPORT .CRX.JSON</button>
    </section>
  </main>;
}
