import { describe, expect, it } from 'vitest';
import { evaluateSafetyEnvelope } from '../src/core/safety';

describe('independent Safety Kernel', () => {
  it('passes a feasible branch inside hard constraints', () => {
    expect(evaluateSafetyEnvelope({
      plan: 'REROUTE',
      planFeasible: true,
      minimumHospitalReserve: 42,
      minimumCriticalCapacity: 56,
      firstCriticalImpactSec: null,
    })).toEqual({ pass: true, violations: [] });
  });

  it('rejects infeasible resources even if capacities otherwise look safe', () => {
    const result = evaluateSafetyEnvelope({
      plan: 'REROUTE_MOBILE',
      planFeasible: false,
      planInfeasibleReason: 'ROAD_12 blocked',
      minimumHospitalReserve: 55,
      minimumCriticalCapacity: 65,
      firstCriticalImpactSec: null,
    });
    expect(result.pass).toBe(false);
    expect(result.violations).toContain('ROAD_12 blocked');
  });

  it('rejects a critical-capacity floor violation independently of the planner', () => {
    const result = evaluateSafetyEnvelope({
      plan: 'SHED_LOAD',
      planFeasible: true,
      minimumHospitalReserve: 40,
      minimumCriticalCapacity: 34.9,
      firstCriticalImpactSec: 120,
    });
    expect(result.pass).toBe(false);
    expect(result.violations.some(v => v.includes('35%'))).toBe(true);
  });
});
