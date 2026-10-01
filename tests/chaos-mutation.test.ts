import { describe, expect, it } from 'vitest';
import { evaluateChaosMutation } from '../src/core/chaos';

describe('chaos mutation temporal integrity', () => {
  it.each([
    ['staleCamera', 8],
    ['sensorConflict', 20],
    ['roadBlocked', 74],
    ['secondShock', 185],
  ] as const)('anchors %s to its earliest affected history at T+%i', (key, boundary) => {
    expect(evaluateChaosMutation(key, 0)).toEqual({ allowed: true, effectiveTimeSec: boundary });
    expect(evaluateChaosMutation(key, boundary)).toEqual({ allowed: true, effectiveTimeSec: boundary });
  });

  it.each([
    ['staleCamera', 8],
    ['sensorConflict', 20],
    ['roadBlocked', 74],
    ['secondShock', 185],
  ] as const)('rejects late %s mutation after T+%i', (key, boundary) => {
    const result = evaluateChaosMutation(key, boundary + 1);
    expect(result.allowed).toBe(false);
    expect(result.effectiveTimeSec).toBe(boundary + 1);
  });

  it('keeps NPU capability changes current-time mutable', () => {
    expect(evaluateChaosMutation('npuUnavailable', 237)).toEqual({ allowed: true, effectiveTimeSec: 237 });
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, -1])('fails closed for invalid simulation time %s', nowSec => {
    expect(evaluateChaosMutation('roadBlocked', nowSec).allowed).toBe(false);
  });
});
