import { describe, expect, it } from 'vitest';
import { evaluateForecastLease } from '../src/core/leases';

describe('Forecast Lease', () => {
  it('expires immediately when the world revision changes', () => {
    expect(evaluateForecastLease({ worldRevision: 2, forecastRevision: 1, nowSec: 20, issuedSec: 10 }).reason).toBe('WORLD_CHANGED');
  });

  it('expires when its validity interval elapses', () => {
    expect(evaluateForecastLease({ worldRevision: 1, forecastRevision: 1, nowSec: 91, issuedSec: 10, ttlSec: 60 }).reason).toBe('TTL_EXPIRED');
  });

  it('reports remaining validity while current', () => {
    expect(evaluateForecastLease({ worldRevision: 1, forecastRevision: 1, nowSec: 40, issuedSec: 10, ttlSec: 60 }).expiresInSec).toBe(30);
  });
});
