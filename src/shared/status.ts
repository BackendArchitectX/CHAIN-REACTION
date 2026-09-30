import type { Status } from '../core/types';

export const STATUS_GLYPH: Record<Status, string> = {
  healthy: '●',
  stressed: '◐',
  degraded: '▲',
  critical: '◆',
  failed: '×',
  recovering: '↻',
};

export const STATUS_LABEL: Record<Status, string> = {
  healthy: 'HEALTHY',
  stressed: 'STRESSED',
  degraded: 'DEGRADED',
  critical: 'CRITICAL',
  failed: 'FAILED',
  recovering: 'RECOVERING',
};

export function statusSeverity(status: Status) {
  return ({ healthy: 0, recovering: 1, stressed: 2, degraded: 3, critical: 4, failed: 5 } as const)[status];
}
