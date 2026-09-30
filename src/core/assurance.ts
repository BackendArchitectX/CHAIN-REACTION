import type { AssuranceProof } from './types';

export const assuranceProofs: AssuranceProof[] = [
  { claim: 'Deterministic same-seed replay', status: 'PROVEN', evidence: 'Vitest replay and trace-state invariants' },
  { claim: 'Reality Forks use common randomness', status: 'PROVEN', evidence: 'Shared future-sample generator per evaluation batch' },
  { claim: 'Unsafe plans are rejected', status: 'PROVEN', evidence: 'Safety Kernel invariants + infeasibility tests' },
  { claim: 'Core simulation works without cloud AI', status: 'PROVEN', evidence: 'No network dependency in simulation runtime' },
  { claim: 'Evidence duplicates are normalized', status: 'PROVEN', evidence: 'Evidence Fabric fingerprint + duplicate-delivery tests' },
  { claim: 'Forecasts expire after world change or TTL', status: 'PROVEN', evidence: 'Forecast Lease revision and TTL tests' },
  { claim: 'Run trace is reproducibly fingerprinted', status: 'PROVEN', evidence: 'Stable serialized trace fingerprint tests' },
  { claim: 'Snapdragon NPU execution', status: 'PENDING HARDWARE', evidence: 'Requires exact-device QNN compile, execute, and layer placement profile' },
  { claim: 'Windows ARM64 native packaging', status: 'NOT IMPLEMENTED', evidence: 'Current deliverable is the verified Vite web build; no native Tauri/Rust package is shipped' },
  { claim: 'Operational municipal effectiveness', status: 'NOT CLAIMED', evidence: 'CITY//01 is a synthetic validation environment; no municipal pilot evidence exists' },
];
