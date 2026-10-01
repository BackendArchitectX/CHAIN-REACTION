import type { ChaosFlags } from './types';

type ChaosKey = keyof ChaosFlags;

type MutationDecision =
  | { allowed: true; effectiveTimeSec: number }
  | { allowed: false; effectiveTimeSec: number; reason: string };

const HISTORY_BOUNDARY_SEC: Partial<Record<ChaosKey, number>> = {
  staleCamera: 8,
  sensorConflict: 20,
  roadBlocked: 74,
  secondShock: 185,
};

export function evaluateChaosMutation(key: ChaosKey, nowSec: number): MutationDecision {
  if (!Number.isFinite(nowSec) || nowSec < 0) {
    return {
      allowed: false,
      effectiveTimeSec: 0,
      reason: 'simulation time is invalid',
    };
  }

  const boundary = HISTORY_BOUNDARY_SEC[key];
  if (boundary == null) {
    return { allowed: true, effectiveTimeSec: nowSec };
  }

  if (nowSec > boundary) {
    return {
      allowed: false,
      effectiveTimeSec: nowSec,
      reason: `T+${boundary} history has already elapsed; replay would become retrospective`,
    };
  }

  return { allowed: true, effectiveTimeSec: boundary };
}
