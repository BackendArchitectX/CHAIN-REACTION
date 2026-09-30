import { describe, expect, it } from 'vitest';
import { APP_TABS, DEFAULT_TAB, tabFromHash, tabSlug } from '../src/app/navigation';

describe('workspace navigation contract', () => {
  it('creates stable hash slugs for every mission workspace', () => {
    expect(APP_TABS.map(tab => [tab, tabSlug(tab)])).toEqual([
      ['COMMAND', 'command'],
      ['FUTURES', 'futures'],
      ['CHAOS LAB', 'chaos-lab'],
      ['EDGE LAB', 'edge-lab'],
      ['AUDIT', 'audit'],
    ]);
  });

  it('resolves direct workspace hashes case-insensitively', () => {
    expect(tabFromHash('#futures')).toBe('FUTURES');
    expect(tabFromHash('#EDGE-LAB')).toBe('EDGE LAB');
    expect(tabFromHash('audit')).toBe('AUDIT');
  });

  it('maps an empty location to the default workspace and rejects unrelated anchors', () => {
    expect(tabFromHash('')).toBe(DEFAULT_TAB);
    expect(tabFromHash('#workspace')).toBeNull();
    expect(tabFromHash('#unknown')).toBeNull();
  });
});
