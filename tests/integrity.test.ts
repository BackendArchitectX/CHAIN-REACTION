import { describe, expect, it } from 'vitest';
import { traceFingerprint } from '../src/core/integrity';

describe('reproducibility fingerprint', () => {
  it('is stable across object key ordering', () => {
    expect(traceFingerprint({ a: 1, b: 2 })).toBe(traceFingerprint({ b: 2, a: 1 }));
  });

  it('changes when a trace-relevant value changes', () => {
    expect(traceFingerprint({ seed: 1, trace: ['a'] })).not.toBe(traceFingerprint({ seed: 1, trace: ['b'] }));
  });
});
