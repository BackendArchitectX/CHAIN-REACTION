import { describe, expect, it } from 'vitest';
import { BASE_PARAMETERS, SCENARIO_SEED } from '../src/data/city01';
import { simulate } from '../src/core/engine';
import { evaluateAllPlans, generateFutureSamples, pairedPrevention } from '../src/core/planning';
import type { ChaosFlags } from '../src/core/types';

const quiet: ChaosFlags = { roadBlocked: false, sensorConflict: false, staleCamera: false, secondShock: false, npuUnavailable: false };

describe('CITY//01 deterministic simulation', () => {
  it('replays identically with the same inputs', () => {
    const options = { untilSec: 420, plan: 'REROUTE_MOBILE' as const, parameters: BASE_PARAMETERS, chaos: quiet, interventionCommitSec: 48 };
    expect(simulate(options)).toEqual(simulate(options));
  });

  it('never creates negative capacity or reserve values', () => {
    const run = simulate({ untilSec: 420, plan: 'NO_ACTION', parameters: BASE_PARAMETERS, chaos: quiet, interventionCommitSec: 48 });
    for (const checkpoint of run.checkpoints) {
      for (const node of Object.values(checkpoint.nodes)) {
        expect(node.capacity).toBeGreaterThanOrEqual(0);
        expect(node.capacity).toBeLessThanOrEqual(100);
        expect(node.reserve).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('marks mobile deployment infeasible when ROAD_12 blocks before activation', () => {
    const run = simulate({
      untilSec: 180,
      plan: 'REROUTE_MOBILE',
      parameters: { ...BASE_PARAMETERS, mobileTravelSec: 40 },
      chaos: { ...quiet, roadBlocked: true },
      interventionCommitSec: 48,
    });
    expect(run.final.planFeasible).toBe(false);
    expect(run.final.planInfeasibleReason).toContain('ROAD_12');
  });
});

describe('robust counterfactual planning', () => {
  it('uses reproducible future samples for common-randomness comparisons', () => {
    expect(generateFutureSamples(32, SCENARIO_SEED)).toEqual(generateFutureSamples(32, SCENARIO_SEED));
  });

  it('evaluates every intervention against the same number of futures', () => {
    const results = evaluateAllPlans(quiet, 48, 48, SCENARIO_SEED);
    expect(results).toHaveLength(4);
    expect(new Set(results.map(result => result.totalFutures))).toEqual(new Set([48]));
  });

  it('produces paired prevention evidence without exceeding the risk cohort', () => {
    const proof = pairedPrevention('REROUTE_MOBILE', quiet, 48, 64, SCENARIO_SEED);
    expect(proof.prevented).toBeLessThanOrEqual(proof.atRiskWithout);
    expect(proof.total).toBe(64);
  });
});
