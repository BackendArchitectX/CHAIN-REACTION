import React from 'react';
import { useMission } from './useMission';
import type { AppTab } from './types';
import { CommandView } from '../features/command/CommandView';
import { FuturesView } from '../features/futures/FuturesView';
import { ChaosLabView } from '../features/chaos/ChaosLabView';
import { EdgeLabView } from '../features/edge/EdgeLabView';
import { AuditView } from '../features/audit/AuditView';

const TABS: AppTab[] = ['COMMAND', 'FUTURES', 'CHAOS LAB', 'EDGE LAB', 'AUDIT'];

export function App() {
  const mission = useMission();

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand-block">
        <div className="brand">CHAIN//REACTION</div>
        <div className="subtitle">EDGE CAUSAL RESILIENCE INTELLIGENCE</div>
      </div>
      <div className="topmeta">
        <span>CITY//01</span>
        <span className="mode-badge">SIMULATION MODE</span>
        <span className={`trust-badge trust-${mission.trust.toLowerCase().replace(' ', '-')}`}>{mission.trust}</span>
      </div>
    </header>

    <nav className="nav" aria-label="Primary">
      {TABS.map(tab => (
        <button key={tab} className={mission.tab === tab ? 'active' : ''} onClick={() => mission.setTab(tab)}>
          {tab}
        </button>
      ))}
    </nav>

    {mission.tab === 'COMMAND' && <CommandView mission={mission} />}
    {mission.tab === 'FUTURES' && <FuturesView mission={mission} />}
    {mission.tab === 'CHAOS LAB' && <ChaosLabView mission={mission} />}
    {mission.tab === 'EDGE LAB' && <EdgeLabView mission={mission} />}
    {mission.tab === 'AUDIT' && <AuditView mission={mission} />}

    <footer className="statusbar">
      <span>EDGE PULSE <b>{mission.chaos.npuUnavailable ? 'DEGRADED' : 'READY'}</b></span>
      <span>
        NPU{' '}
        <b>
          {mission.chaos.npuUnavailable
            ? 'UNAVAILABLE / CPU FALLBACK'
            : mission.edgeCapability.npuVerified
              ? `VERIFIED ${mission.edgeCapability.npuCoveragePct}%`
              : 'PROOF PENDING HARDWARE'}
        </b>
      </span>
      <span>
        FORECAST LEASE{' '}
        <b className={mission.lease === 'EXPIRED' ? 'text-danger' : ''}>
          {mission.lease}{mission.lease === 'ACTIVE' ? ` · ${mission.leaseInfo.expiresInSec}s` : ''}
        </b>
      </span>
      <span>CLOUD INFERENCE <b>0</b></span>
    </footer>
  </div>;
}
