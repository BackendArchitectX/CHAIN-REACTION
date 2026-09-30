import type { EvidenceEvent } from './types';

export type EvidenceDiagnostics = {
  rawCount: number;
  normalizedCount: number;
  duplicates: number;
  lateEvents: number;
  staleEvents: number;
  clockSkewedSources: number;
  contradictions: number;
};

export function evidenceFingerprint(event: EvidenceEvent) {
  return `${event.source}|${event.event}|${event.eventTime}`;
}

export function normalizeEvidence(events: EvidenceEvent[]) {
  const chosen = new Map<string, EvidenceEvent>();
  for (const event of events) {
    const key = evidenceFingerprint(event);
    const previous = chosen.get(key);
    if (!previous || event.confidence > previous.confidence) chosen.set(key, event);
  }
  return [...chosen.values()].sort((a, b) => a.eventTime - b.eventTime || a.receivedTime - b.receivedTime);
}

export function analyzeEvidence(events: EvidenceEvent[], nowSec: number): EvidenceDiagnostics {
  const normalized = normalizeEvidence(events);
  const duplicates = Math.max(0, events.length - normalized.length);
  const lateEvents = events.filter(event => event.receivedTime - event.eventTime > 8).length;
  const staleEvents = normalized.filter(event => nowSec - event.eventTime > 45).length;
  const clockSkewedSources = normalized.filter(event => Math.abs((event as EvidenceEvent & { clockOffsetSec?: number }).clockOffsetSec ?? 0) > 3).length;
  const floodSignals = normalized.filter(event => event.event.includes('FLOOD') || event.event.includes('WATER LEVEL'));
  const hasPositive = floodSignals.some(event => /FLOOD|HIGH/.test(event.event) && !/NORMAL/.test(event.event));
  const hasNegative = floodSignals.some(event => /NORMAL/.test(event.event));
  return { rawCount: events.length, normalizedCount: normalized.length, duplicates, lateEvents, staleEvents, clockSkewedSources, contradictions: hasPositive && hasNegative ? 1 : 0 };
}
