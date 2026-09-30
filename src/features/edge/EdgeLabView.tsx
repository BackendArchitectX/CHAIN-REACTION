import React from 'react';
import type { Mission } from '../../app/useMission';
import { assuranceProofs } from '../../core/assurance';
import { EdgeMetric, PanelTitle } from '../../ui/primitives';

export function EdgeLabView({ mission }: { mission: Mission }) {
  const capability = mission.edgeCapability;

  return <main className="stack">
    <section className="panel">
      <PanelTitle left="EDGE LAB" right="SNAPDRAGON CAPABILITY CONTRACT" />
      <div className="edge-grid">
        <EdgeMetric label="Architecture" value={capability.architecture} />
        <EdgeMetric label="Runtime" value={capability.runtime} />
        <EdgeMetric
          label="NPU execution proof"
          value={mission.chaos.npuUnavailable
            ? 'UNAVAILABLE / EXPLICIT FALLBACK'
            : capability.profileAccepted
              ? 'PROFILE ACCEPTED / NOT ATTESTED'
              : 'PENDING EXACT-DEVICE PROFILE'}
        />
        <EdgeMetric label="Cloud inference" value="0" />
        <EdgeMetric label="Perception artifact" value={capability.modelArtifact} />
        <EdgeMetric label="Simulation workload" value="Deterministic CPU" />
        <EdgeMetric label="Safety Kernel" value="Deterministic CPU" />
        <EdgeMetric label="Visualization" value="Browser GPU / compositor" />
        <EdgeMetric label="Reported NPU layer coverage" value={capability.npuCoveragePct != null ? `${capability.npuCoveragePct}%` : '—'} />
        <EdgeMetric
          label="Reported warm latency P50/P95"
          value={capability.p50Ms != null ? `${capability.p50Ms} / ${capability.p95Ms} ms` : '—'}
        />
        <EdgeMetric
          label="Reported cold load / memory"
          value={capability.coldLoadMs != null ? `${capability.coldLoadMs} ms / ${capability.memoryMb} MB` : '—'}
        />
      </div>

      <div className="technical-note">
        <div>
          <b>{capability.profileAccepted ? 'EVIDENCE PROFILE ACCEPTED — NOT ATTESTED' : 'LOAD EXACT-DEVICE QNN PROFILE'}</b>
          <span>{capability.proofReason}</span>
        </div>
        <label>
          LOAD PROFILE
          <input
            type="file"
            accept="application/json,.json"
            onChange={event => {
              const file = event.target.files?.[0];
              if (file) void mission.loadHardwareProof(file);
            }}
          />
        </label>
      </div>

      <div className="technical-note">
        <b>NO FAKE NPU METRICS.</b>{' '}
        Metrics are displayed only from a structurally valid loaded profile and are labeled as reported evidence. Browser-side profile acceptance does not independently attest the device, profiler, or execution provenance.
      </div>
    </section>

    <section className="panel">
      <PanelTitle left="ASSURANCE CASE" right="CLAIM → EVIDENCE" />
      <div className="assurance-list">
        {assuranceProofs.map(proof => (
          <div className="assurance-row" key={proof.claim}>
            <div><b>{proof.claim}</b><span>{proof.evidence}</span></div>
            <strong className={`proof-${proof.status.toLowerCase().replaceAll(' ', '-')}`}>{proof.status}</strong>
          </div>
        ))}
      </div>
    </section>
  </main>;
}
