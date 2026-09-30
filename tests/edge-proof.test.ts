import { describe, expect, it } from 'vitest';
import { detectEdgeCapability, validateHardwareProof } from '../src/edge/capabilities';

const proof = {
  schema: 'chainreaction.qnn-proof.v1' as const,
  device: 'HP Snapdragon X reference target',
  provider: 'QNN',
  model: 'scene-classifier.onnx',
  modelSha256: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  npuCoveragePct: 98.4,
  p50Ms: 8.2,
  p95Ms: 10.1,
  coldLoadMs: 190,
  memoryMb: 84,
  verifiedAt: '2026-09-30T18:00:00Z',
};

describe('hardware proof gate', () => {
  it('accepts and normalizes a complete exact-device QNN profile', () => {
    const result = validateHardwareProof({ ...proof, provider: ' QNN ' });
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.proof.provider).toBe('QNN');
  });

  it('rejects a profile with insufficient NPU coverage', () => {
    expect(validateHardwareProof({ ...proof, npuCoveragePct: 42 }).valid).toBe(false);
  });

  it('rejects a non-SHA256 model identity', () => {
    expect(validateHardwareProof({ ...proof, modelSha256: 'abc123' }).valid).toBe(false);
  });

  it('rejects the unfilled template', () => {
    expect(validateHardwareProof({ ...proof, modelSha256: 'REPLACE_WITH_MODEL_SHA256' }).valid).toBe(false);
  });

  it('rejects an invalid verification timestamp', () => {
    expect(validateHardwareProof({ ...proof, verifiedAt: 'not-a-date' }).valid).toBe(false);
  });

  it('rejects numeric strings instead of coercing untrusted input', () => {
    expect(validateHardwareProof({ ...proof, p50Ms: '8.2' }).valid).toBe(false);
    expect(validateHardwareProof({ ...proof, npuCoveragePct: '98.4' }).valid).toBe(false);
  });

  it('rejects non-finite or implausibly large benchmark values', () => {
    expect(validateHardwareProof({ ...proof, p95Ms: Number.POSITIVE_INFINITY }).valid).toBe(false);
    expect(validateHardwareProof({ ...proof, memoryMb: 1_000_000 }).valid).toBe(false);
  });

  it('does not surface malformed proof metrics through capability state', () => {
    const capability = detectEdgeCapability({ ...proof, p50Ms: '8.2' }, 'ARM64');
    expect(capability.npuVerified).toBe(false);
    expect(capability.p50Ms).toBeUndefined();
    expect(capability.architecture).toBe('ARM64 detected');
  });

  it('does not read browser globals inside the edge proof boundary', () => {
    expect(detectEdgeCapability(proof).architecture).toBe('Web runtime / architecture unverified');
  });
});
