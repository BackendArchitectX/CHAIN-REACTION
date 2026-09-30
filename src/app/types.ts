import type { EvidenceKind } from '../core/types';

export type AppTab = 'COMMAND' | 'FUTURES' | 'CHAOS LAB' | 'EDGE LAB' | 'AUDIT';

export type AuditEntry = {
  time: number;
  kind: EvidenceKind | 'system';
  message: string;
  ref: string;
};
