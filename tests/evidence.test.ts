import { describe, expect, it } from 'vitest';
import { analyzeEvidence, normalizeEvidence } from '../src/core/evidence';
import type { EvidenceEvent } from '../src/core/types';

const base: EvidenceEvent = {
  id: 'E-1', source: 'CAMERA', event: 'FLOOD SCENE', kind: 'observed', eventTime: 8, receivedTime: 8.1,
  confidence: 0.9, trust: 'HIGH', detail: 'test',
};

describe('Evidence Fabric normalization', () => {
  it('deduplicates equivalent observations without amplifying evidence', () => {
    const events = [base, { ...base, id: 'E-2', receivedTime: 42, confidence: 0.8 }];
    expect(normalizeEvidence(events)).toHaveLength(1);
    expect(analyzeEvidence(events, 42).duplicates).toBe(1);
  });

  it('surfaces late and clock-skewed telemetry', () => {
    const events = [{ ...base, id: 'E-LATE', eventTime: 10, receivedTime: 30, clockOffsetSec: 7.4 } as EvidenceEvent & { clockOffsetSec: number }];
    const diagnostics = analyzeEvidence(events, 30);
    expect(diagnostics.lateEvents).toBe(1);
    expect(diagnostics.clockSkewedSources).toBe(1);
  });
});
