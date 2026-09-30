import { describe, expect, it } from 'vitest';
import { validateHardwareProof } from '../src/edge/capabilities';

const proof = {
  schema: 'chainreaction.qnn-proof.v1' as const,
  device: 'HP Snapdragon X reference target',
  provider: 'QNN',
  model: 'scene-classifier.onnx',
  modelSha256: 'abc123',
  npuCoveragePct: 98.4,
  p50Ms: 8.2,
  p95Ms: 10.1,
  coldLoadMs: 190,
  memoryMb: 84,
  verifiedAt: '2026-09-30T18:00:00Z',
};

describe('hardware proof gate', () => {
  it('accepts a complete exact-device QNN profile', () => {
    expect(validateHardwareProof(proof).valid).toBe(true);
  });

  it('rejects a profile with insufficient NPU coverage', () => {
    expect(validateHardwareProof({ ...proof, npuCoveragePct: 42 }).valid).toBe(false);
  });

  it('rejects the unfilled template', () => {
    expect(validateHardwareProof({ ...proof, modelSha256: 'REPLACE_WITH_MODEL_SHA256' }).valid).toBe(false);
  });
});
