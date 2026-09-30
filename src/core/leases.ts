export type LeaseStatus = 'ACTIVE' | 'EXPIRED';

export type LeaseResult = {
  status: LeaseStatus;
  reason: 'CURRENT' | 'WORLD_CHANGED' | 'TTL_EXPIRED';
  expiresInSec: number;
};

export function evaluateForecastLease(input: {
  worldRevision: number;
  forecastRevision: number;
  nowSec: number;
  issuedSec: number;
  ttlSec?: number;
}): LeaseResult {
  const ttlSec = input.ttlSec ?? 60;
  const expiresInSec = Math.max(0, input.issuedSec + ttlSec - input.nowSec);
  if (input.worldRevision !== input.forecastRevision) {
    return { status: 'EXPIRED', reason: 'WORLD_CHANGED', expiresInSec: 0 };
  }
  if (input.nowSec >= input.issuedSec + ttlSec) {
    return { status: 'EXPIRED', reason: 'TTL_EXPIRED', expiresInSec: 0 };
  }
  return { status: 'ACTIVE', reason: 'CURRENT', expiresInSec };
}
