import type { AppTab } from './types';

export const DEFAULT_TAB: AppTab = 'COMMAND';

export const APP_TABS: readonly AppTab[] = [
  'COMMAND',
  'FUTURES',
  'CHAOS LAB',
  'EDGE LAB',
  'AUDIT',
];

export function tabSlug(tab: AppTab): string {
  return tab.toLowerCase().replaceAll(' ', '-');
}

export function tabFromHash(hash: string): AppTab | null {
  const normalized = hash.trim().replace(/^#/, '').toLowerCase();
  if (!normalized) return DEFAULT_TAB;

  return APP_TABS.find(tab => tabSlug(tab) === normalized) ?? null;
}
