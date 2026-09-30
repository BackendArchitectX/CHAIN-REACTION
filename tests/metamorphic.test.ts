import { describe, expect, it } from 'vitest';
import { BASE_PARAMETERS } from '../src/data/city01';
import { simulate } from '../src/core/engine';
import type { ChaosFlags } from '../src/core/types';

const quiet: ChaosFlags = { roadBlocked: false, sensorConflict: false, staleCamera: false, secondShock: false, npuUnavailable: false };

describe('metamorphic safety properties', () => {
  it('more telecom backup does not reduce the minimum hospital reserve in the same world', () => {
    const low = simulate({ untilSec: 260, plan: 'NO_ACTION', parameters: { ...BASE_PARAMETERS, telecomBackupSec: 95 }, chaos: quiet, interventionCommitSec: 48 });
    const high = simulate({ untilSec: 260, plan: 'NO_ACTION', parameters: { ...BASE_PARAMETERS, telecomBackupSec: 145 }, chaos: quiet, interventionCommitSec: 48 });
    expect(high.minimumHospitalReserve).toBeGreaterThanOrEqual(low.minimumHospitalReserve);
  });

  it('a blocked road cannot make the mobile plan become feasible if it was blocked before arrival', () => {
    const blocked = simulate({ untilSec: 180, plan: 'REROUTE_MOBILE', parameters: { ...BASE_PARAMETERS, mobileTravelSec: 40 }, chaos: { ...quiet, roadBlocked: true }, interventionCommitSec: 48 });
    expect(blocked.final.planFeasible).toBe(false);
  });

  it('an unavailable resource is not silently treated as available', () => {
    const constrained = simulate({ untilSec: 420, plan: 'REROUTE', parameters: { ...BASE_PARAMETERS, gridSparePct: 5 }, chaos: quiet, interventionCommitSec: 48 });
    expect(constrained.final.planFeasible).toBe(false);
    expect(constrained.safety.pass).toBe(false);
  });
});
