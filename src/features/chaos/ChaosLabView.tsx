import React from 'react';
import type { Mission } from '../../app/useMission';
import type { ChaosFlags } from '../../core/types';
import { PanelTitle } from '../../ui/primitives';

const CHAOS_CASES: Array<[keyof ChaosFlags, string, string, number]> = [
  ['roadBlocked', 'ROAD_12 BLOCK', 'Invalidates the mobile-unit access assumption before activation.', 74],
  ['sensorConflict', 'CONTRADICTORY SENSOR', 'Water sensor reports normal while camera evidence reports flood.', 24],
  ['staleCamera', 'STALE CAMERA FEED', 'Reduces perception freshness and trust without hiding the incident.', 36],
  ['secondShock', 'SECONDARY LOAD SPIKE', 'Tests post-intervention resilience and recovery debt.', 185],
  ['npuUnavailable', 'NPU UNAVAILABLE', 'Forces explicit degraded edge state; simulation remains operational.', 0],
];

const COVERAGE = [
  ['Deterministic replay', 'PROVEN'],
  ['Common-randomness forks', 'PROVEN'],
  ['Late/duplicate event contract', 'PROVEN'],
  ['Evidence conflict', 'PROVEN'],
  ['Forecast invalidation', 'PROVEN'],
  ['No-safe-plan behavior', 'PROVEN'],
  ['Network offline core', 'PROVEN'],
  ['NPU fallback state', 'PROVEN'],
  ['Application recovery journal', 'NOT IMPLEMENTED'],
  ['Operational city validation', 'NOT CLAIMED'],
] as const;

export function ChaosLabView({ mission }: { mission: Mission }) {
  return <main className="stack">
    <section className="panel">
      <PanelTitle left="CHAOS LAB" right="RED-TEAM THE SYSTEM, NOT JUST THE CITY" />
      <div className="chaos-grid">
        {CHAOS_CASES.map(([key, title, detail, time]) => (
          <button
            key={key}
            className={`chaos-card ${mission.chaos[key] ? 'active' : ''}`}
            aria-pressed={mission.chaos[key]}
            aria-label={`${title}. ${detail}. ${mission.chaos[key] ? 'Active' : 'Inactive'}.`}
            onClick={() => mission.toggleChaos(key, time, title)}
          >
            <span>{mission.chaos[key] ? 'ACTIVE' : 'INJECT'}</span>
            <b>{title}</b>
            <small>{detail}</small>
          </button>
        ))}
      </div>
    </section>

    <section className="panel coverage-panel">
      <PanelTitle left="COVERAGE ATLAS" right="ASSURANCE MATRIX" />
      <div className="coverage-grid">
        {COVERAGE.map(([name, state]) => (
          <div className="coverage" key={name}><span>{name}</span><b>{state}</b></div>
        ))}
      </div>
    </section>
  </main>;
}
