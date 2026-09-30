import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { App } from '../src/app/App';

describe('application render contract', () => {
  it('renders the primary mission-control shell without browser-only startup dependencies', () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain('CHAIN//REACTION');
    expect(html).toContain('EDGE CAUSAL RESILIENCE INTELLIGENCE');
    expect(html).toContain('role="tablist"');
    expect(html).toContain('COMMAND');
    expect(html).toContain('FUTURES');
    expect(html).toContain('CHAOS LAB');
    expect(html).toContain('EDGE LAB');
    expect(html).toContain('AUDIT');
    expect(html).toContain('role="status"');
    expect(html).toContain('CLOUD INFERENCE');
  });
});
