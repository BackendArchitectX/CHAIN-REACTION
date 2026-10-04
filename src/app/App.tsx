import React from 'react';
import { useMission, type Mission } from './useMission';
import { CommandView } from '../features/command/CommandView';
import { FuturesView } from '../features/futures/FuturesView';
import { ChaosLabView } from '../features/chaos/ChaosLabView';
import { EdgeLabView } from '../features/edge/EdgeLabView';
import { AuditView } from '../features/audit/AuditView';
import { APP_TABS, tabSlug } from './navigation';


function CausalBrand({ mission }: { mission: Mission }) {
  const latestTrace = mission.liveRun.final.trace.at(-1);
  const latestNode = latestTrace?.ref ? mission.liveRun.final.nodes[latestTrace.ref] : undefined;
  const activationTime = mission.activePlan !== 'NO_ACTION' && mission.liveRun.final.planActivated
    ? mission.liveRun.final.planActivationTime
    : null;
  const activationIsLatest = activationTime != null && activationTime >= (latestTrace?.time ?? -1);
  const eventKey = activationIsLatest
    ? `plan-${mission.activePlan}-${activationTime}`
    : latestTrace?.id ?? 'idle';
  const signal = activationIsLatest ? 'intervention' : latestNode?.status ?? (mission.playing ? 'live' : 'idle');

  return (
    <div
      className={`brand causal-brand ${mission.playing ? 'is-live' : ''} ${eventKey !== 'idle' ? 'has-event' : ''} is-${signal}`}
      role="img"
      aria-label="CHAIN//REACTION"
    >
      <span className="brand-word" aria-hidden="true">CHAIN</span>
      <span className="brand-reactor" key={eventKey} aria-hidden="true">
        <svg className="brand-reactor-svg" viewBox="0 0 52 54" focusable="false">
          <path className="brand-slash brand-slash-one" d="M16 4 L8 50" />
          <path className="brand-slash brand-slash-two" d="M44 4 L36 50" />
        </svg>
      </span>
      <span className="brand-word" aria-hidden="true">REACTION</span>
    </div>
  );
}

export function App() {
  const mission = useMission();

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % APP_TABS.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + APP_TABS.length) % APP_TABS.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = APP_TABS.length - 1;
    if (nextIndex == null) return;

    event.preventDefault();
    const nextTab = APP_TABS[nextIndex];
    mission.setTab(nextTab);
    window.requestAnimationFrame(() => document.getElementById(`tab-${tabSlug(nextTab)}`)?.focus());
  };

  return <div className="app-shell">
    <a className="skip-link" href="#workspace">Skip to mission workspace</a>

    <header className="topbar">
      <div className="brand-block">
        <CausalBrand mission={mission} />
        <div className="subtitle">EDGE CAUSAL RESILIENCE INTELLIGENCE</div>
      </div>
      <div className="topmeta">
        <span>CITY//01</span>
        <span className="mode-badge">SIMULATION MODE</span>
        <span className={`trust-badge trust-${mission.trust.toLowerCase().replace(' ', '-')}`}>{mission.trust}</span>
      </div>
    </header>

    <nav className="nav" aria-label="Mission workspaces" role="tablist">
      {APP_TABS.map((tab, index) => (
        <button
          key={tab}
          id={`tab-${tabSlug(tab)}`}
          role="tab"
          aria-selected={mission.tab === tab}
          aria-controls="workspace"
          tabIndex={mission.tab === tab ? 0 : -1}
          className={mission.tab === tab ? 'active' : ''}
          onClick={() => mission.setTab(tab)}
          onKeyDown={event => handleTabKeyDown(event, index)}
        >
          {tab}
        </button>
      ))}
    </nav>

    <div
      id="workspace"
      role="tabpanel"
      aria-labelledby={`tab-${tabSlug(mission.tab)}`}
      tabIndex={-1}
    >
      {mission.tab === 'COMMAND' && <CommandView mission={mission} />}
      {mission.tab === 'FUTURES' && <FuturesView mission={mission} />}
      {mission.tab === 'CHAOS LAB' && <ChaosLabView mission={mission} />}
      {mission.tab === 'EDGE LAB' && <EdgeLabView mission={mission} />}
      {mission.tab === 'AUDIT' && <AuditView mission={mission} />}
    </div>

    <footer className="statusbar" role="status" aria-live="polite" aria-atomic="true">
      <span>SIMULATION <b>LOCAL / IN-PROCESS</b></span>
      <span>
        NPU{' '}
        <b>
          {mission.chaos.npuUnavailable
            ? 'UNAVAILABLE / CPU FALLBACK'
            : mission.edgeCapability.profileAccepted
              ? `PROFILE ACCEPTED ${mission.edgeCapability.npuCoveragePct}% / NOT ATTESTED`
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
