import type { LeaseStatus } from './leases';
import type { PlanEvaluation, SensitivityItem } from './types';

export type DecisionStability = {
  state: 'HIGH' | 'MEDIUM' | 'LOW';
  fragility: number;
  explanation: string;
};

export function decisionStability(selected: PlanEvaluation, evaluations: PlanEvaluation[], sensitivity: SensitivityItem[]): DecisionStability {
  const alternatives = evaluations.filter(item => item.plan !== selected.plan && item.safety !== 'REJECT');
  const nearest = alternatives.length ? Math.max(...alternatives.map(item => item.robustness)) : 0;
  const robustnessGap = Math.max(0, selected.robustness - nearest);
  const maxSensitivity = sensitivity[0]?.score ?? 0;
  const horizonPenalty = selected.decisionMargin === 'NARROW' ? 18 : selected.decisionMargin === 'MISSED' ? 40 : 0;
  const fragility = Math.min(100, Math.round(maxSensitivity * 2.2 + horizonPenalty + Math.max(0, 16 - robustnessGap)));
  const state = fragility >= 55 ? 'LOW' : fragility >= 28 ? 'MEDIUM' : 'HIGH';
  const explanation = state === 'LOW'
    ? 'Small changes in assumptions can materially change the feasible plan set.'
    : state === 'MEDIUM'
      ? 'The selected plan is viable, but sensitive parameters should be confirmed.'
      : 'The selected plan remains stable across the tested local perturbations.';
  return { state, fragility, explanation };
}

export function informationValue(item: SensitivityItem | undefined) {
  if (!item) return { score: 0, band: 'LOW' as const };
  const score = Math.min(100, Math.round(item.score * 3));
  return { score, band: score >= 60 ? 'HIGH' as const : score >= 25 ? 'MEDIUM' as const : 'LOW' as const };
}


export type CommitEligibility =
  | { allowed: true; code: 'READY'; message: null; auditRef: null }
  | {
      allowed: false;
      code: 'FORECAST_EXPIRED' | 'SAFETY_REJECTED' | 'DECISION_WINDOW_MISSED';
      message: string;
      auditRef: string;
    };

export function evaluateCommitEligibility(
  lease: LeaseStatus,
  evaluation: Pick<PlanEvaluation, 'safety' | 'decisionMargin'>,
): CommitEligibility {
  if (lease !== 'ACTIVE') {
    return {
      allowed: false,
      code: 'FORECAST_EXPIRED',
      message: 'Replan before committing because the forecast lease has expired.',
      auditRef: 'SK-LEASE',
    };
  }

  if (evaluation.safety === 'REJECT') {
    return {
      allowed: false,
      code: 'SAFETY_REJECTED',
      message: 'The Safety Kernel rejected this intervention.',
      auditRef: 'SK-REJECT',
    };
  }

  if (evaluation.decisionMargin === 'MISSED') {
    return {
      allowed: false,
      code: 'DECISION_WINDOW_MISSED',
      message: 'The intervention decision horizon has already been missed.',
      auditRef: 'SK-HORIZON',
    };
  }

  return { allowed: true, code: 'READY', message: null, auditRef: null };
}
