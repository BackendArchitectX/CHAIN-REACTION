import type { ChaosFlags, TrustState } from './types';
import type { EvidenceDiagnostics } from './evidence';
import type { LeaseResult } from './leases';

export type RuntimeTrust = {
  state: TrustState;
  evidence: 'HIGH' | 'MEDIUM' | 'LOW';
  forecastFreshness: 'HIGH' | 'LOW';
  perception: 'HIGH' | 'MEDIUM';
  hardware: 'VERIFIED' | 'UNVERIFIED' | 'DEGRADED';
  watchdog: string[];
};

export function deriveRuntimeTrust(input: { chaos: ChaosFlags; evidence: EvidenceDiagnostics; lease: LeaseResult; npuVerified: boolean }): RuntimeTrust {
  const watchdog: string[] = [];
  let evidence: RuntimeTrust['evidence'] = 'HIGH';
  if (input.evidence.contradictions) evidence = 'LOW';
  else if (input.evidence.lateEvents || input.evidence.staleEvents || input.evidence.duplicates) evidence = 'MEDIUM';
  const perception: RuntimeTrust['perception'] = input.chaos.staleCamera ? 'MEDIUM' : 'HIGH';
  const hardware: RuntimeTrust['hardware'] = input.chaos.npuUnavailable ? 'DEGRADED' : input.npuVerified ? 'VERIFIED' : 'UNVERIFIED';
  if (input.lease.status === 'EXPIRED') watchdog.push(`Forecast lease expired: ${input.lease.reason}`);
  if (evidence === 'LOW') watchdog.push('Evidence sources conflict; high-confidence planning should be withheld until replanning.');
  if (perception === 'MEDIUM') watchdog.push('Camera evidence is stale; perception trust is reduced.');
  if (input.chaos.npuUnavailable) watchdog.push('NPU unavailable; edge inference proof is degraded.');
  let state: TrustState = 'VERIFIED';
  if (watchdog.length >= 2 || (evidence === 'LOW' && perception === 'MEDIUM')) state = 'SAFE ANALYSIS';
  else if (evidence === 'LOW') state = 'UNCERTAIN';
  else if (input.lease.status === 'EXPIRED' || hardware === 'DEGRADED' || evidence === 'MEDIUM' || perception === 'MEDIUM') state = 'DEGRADED';
  return { state, evidence, forecastFreshness: input.lease.status === 'ACTIVE' ? 'HIGH' : 'LOW', perception, hardware, watchdog };
}
