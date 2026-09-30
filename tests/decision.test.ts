import { describe, expect, it } from 'vitest';
import { evaluateCommitEligibility } from '../src/core/decision';
import type { PlanEvaluation } from '../src/core/types';

function evaluation(overrides: Partial<PlanEvaluation> = {}): PlanEvaluation {
  return {
    plan: 'REROUTE',
    robustness: 90,
    safeFutures: 230,
    totalFutures: 256,
    criticalServicesPreservedMedian: 4,
    medianFailures: 0,
    worstFailures: 1,
    medianRecoverySec: 180,
    p90RecoverySec: 240,
    recoveryDebt: 'LOW',
    decisionHorizonSec: 90,
    decisionMargin: 'STRONG',
    safety: 'PASS',
    ...overrides,
  };
}

describe('intervention commit eligibility', () => {
  it('allows a current, safe intervention inside its decision window', () => {
    expect(evaluateCommitEligibility('ACTIVE', evaluation())).toEqual({
      allowed: true,
      code: 'READY',
      message: null,
      auditRef: null,
    });
  });

  it('blocks commits from an expired forecast before any other consideration', () => {
    const result = evaluateCommitEligibility('EXPIRED', evaluation({ safety: 'REJECT', decisionMargin: 'MISSED' }));
    expect(result.allowed).toBe(false);
    expect(result.code).toBe('FORECAST_EXPIRED');
  });

  it('blocks a Safety Kernel rejection', () => {
    const result = evaluateCommitEligibility('ACTIVE', evaluation({ safety: 'REJECT' }));
    expect(result.allowed).toBe(false);
    expect(result.code).toBe('SAFETY_REJECTED');
  });

  it('blocks an intervention after its decision window is missed', () => {
    const result = evaluateCommitEligibility('ACTIVE', evaluation({ decisionMargin: 'MISSED' }));
    expect(result.allowed).toBe(false);
    expect(result.code).toBe('DECISION_WINDOW_MISSED');
  });
});
