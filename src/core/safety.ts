import type { PlanId, SafetyResult } from './types';

export type SafetyEnvelopeInput = {
  plan: PlanId;
  planFeasible: boolean;
  planInfeasibleReason?: string;
  minimumHospitalReserve: number;
  minimumCriticalCapacity: number;
  firstCriticalImpactSec: number | null;
};

/**
 * Deliberately small, deterministic and independent of the planner.
 * The Safety Kernel consumes simulation outputs and hard constraints only;
 * it does not optimize, rank, or generate interventions.
 */
export function evaluateSafetyEnvelope(input: SafetyEnvelopeInput): SafetyResult {
  const violations: string[] = [];

  if (!input.planFeasible && input.plan !== 'NO_ACTION') {
    violations.push(input.planInfeasibleReason ?? 'Plan prerequisites are not satisfied.');
  }
  if (input.minimumHospitalReserve < 10) {
    violations.push('Hospital reserve falls below 10%.');
  }
  if (input.minimumCriticalCapacity < 35) {
    violations.push('A critical service drops below the CITY//01 35% safety-capacity floor.');
  }
  if (input.plan === 'NO_ACTION' && input.firstCriticalImpactSec != null) {
    violations.push('No-action branch allows critical-service impact.');
  }

  return { pass: violations.length === 0, violations };
}
