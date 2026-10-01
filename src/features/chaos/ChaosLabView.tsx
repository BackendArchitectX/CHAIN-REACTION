import React from 'react';
import type { Mission } from '../../app/useMission';
import type { ChaosFlags } from '../../core/types';
import { PanelTitle } from '../../ui/primitives';

const CHAOS_CASES: Array<[keyof ChaosFlags, string, string]> = [
  ['roadBlocked', 'ROAD_12 BLOCK', 'May be injected only through T+74, when ROAD_12 blockage first enters modeled history.'],
  ['sensorConflict', 'CONTRADICTORY SENSOR', 'May be injected only through T+20, when the water-sensor observation enters evidence history.'],
  ['staleCamera', 'STALE CAMERA FEED', 'May be injected only through T+8, when the camera observation enters evidence history.'],
  ['secondShock', 'SECONDARY LOAD SPIKE', 'May be injected only through T+185, when the secondary shock enters modeled history.'],
  ['npuUnavailable', 'NPU UNAVAILABLE', 'Current runtime capability toggle; it does not rewrite historical simulation evidence.'],
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
        {CHAOS_CASES.map(([key, title, detail]) => (
          <button
            key={key}
            className={`chaos-card ${mission.chaos[key] ? 'active' : ''}`}
            aria-pressed={mission.chaos[key]}
            aria-label={`${title}. ${detail}. ${mission.chaos[key] ? 'Active' : 'Inactive'}.`}
            onClick={() => mission.toggleChaos(key, title)}
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
