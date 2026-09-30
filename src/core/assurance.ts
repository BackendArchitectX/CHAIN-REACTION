import type { AssuranceProof } from './types';

export const assuranceProofs: AssuranceProof[] = [
  { claim: 'Deterministic same-seed replay', status: 'PROVEN', evidence: 'Vitest replay and trace-state invariants' },
  { claim: 'Reality Forks use common randomness', status: 'PROVEN', evidence: 'Shared future-sample generator per evaluation batch' },
  { claim: 'Unsafe plans are rejected', status: 'PROVEN', evidence: 'Safety Kernel invariants + infeasibility tests' },
  { claim: 'Core simulation works without cloud AI', status: 'PROVEN', evidence: 'No network dependency in simulation runtime' },
  { claim: 'Snapdragon NPU execution', status: 'PENDING HARDWARE', evidence: 'Requires exact-device QNN compile, execute, and layer placement profile' },
  { claim: 'Windows ARM64 packaging', status: 'DESIGNED', evidence: 'Tauri/Rust production architecture documented; Vite web build currently runnable' },
  { claim: 'Operational municipal effectiveness', status: 'DESIGNED', evidence: 'Explicitly not claimed; CITY//01 is a synthetic validation environment' },
];
