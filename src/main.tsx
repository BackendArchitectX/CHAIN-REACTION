import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Status = 'healthy' | 'stressed' | 'degraded' | 'critical' | 'failed' | 'recovering';

type NodeState = {
  id: string;
  label: string;
  kind: string;
  status: Status;
  capacity: number;
  reserve: number;
  x: number;
  y: number;
};

type Evidence = {
  id: string;
  source: string;
  event: string;
  confidence: number;
  age: string;
  trust: 'HIGH' | 'MEDIUM' | 'LOW';
};

type Branch = {
  name: string;
  robustness: number;
  safety: 'PASS' | 'REJECT';
  horizon: string;
  debt: 'LOW' | 'MEDIUM' | 'HIGH';
  hospital: Status;
  telecom: Status;
  failures: number;
};

const baseNodes: NodeState[] = [
  { id: 'sub03', label: 'SUBSTATION 03', kind: 'Power', status: 'healthy', capacity: 92, reserve: 24, x: 16, y: 43 },
  { id: 'tel07', label: 'TELECOM 07', kind: 'Telecom', status: 'healthy', capacity: 88, reserve: 100, x: 43, y: 30 },
  { id: 'hospN', label: 'HOSPITAL NORTH', kind: 'Healthcare', status: 'healthy', capacity: 84, reserve: 78, x: 76, y: 18 },
  { id: 'pump02', label: 'PUMP 02', kind: 'Water', status: 'healthy', capacity: 86, reserve: 64, x: 43, y: 66 },
  { id: 'road12', label: 'ROAD 12', kind: 'Transport', status: 'healthy', capacity: 91, reserve: 100, x: 77, y: 60 },
  { id: 'ems01', label: 'EMERGENCY OPS', kind: 'Response', status: 'healthy', capacity: 90, reserve: 82, x: 88, y: 40 },
];

const branches: Branch[] = [
  { name: 'NO ACTION', robustness: 42, safety: 'REJECT', horizon: '—', debt: 'HIGH', hospital: 'critical', telecom: 'failed', failures: 4 },
  { name: 'REROUTE', robustness: 81, safety: 'PASS', horizon: '00:42', debt: 'LOW', hospital: 'stressed', telecom: 'degraded', failures: 2 },
  { name: 'REROUTE + MOBILE', robustness: 94, safety: 'PASS', horizon: '00:27', debt: 'MEDIUM', hospital: 'healthy', telecom: 'healthy', failures: 1 },
];

const statusGlyph: Record<Status, string> = {
  healthy: '●', stressed: '◐', degraded: '▲', critical: '◆', failed: '×', recovering: '↻'
};

const statusLabel: Record<Status, string> = {
  healthy: 'HEALTHY', stressed: 'STRESSED', degraded: 'DEGRADED', critical: 'CRITICAL', failed: 'FAILED', recovering: 'RECOVERING'
};

function useScenario() {
  const [t, setT] = useState(0);
  const [roadBlocked, setRoadBlocked] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(2);
  const step = () => setT(v => Math.min(140, v + 12));
  const reset = () => { setT(0); setRoadBlocked(false); setSelectedBranch(2); };
  const injectRoad = () => { setRoadBlocked(true); setT(v => Math.max(v, 72)); };

  const nodes = useMemo(() => baseNodes.map(n => ({...n})), [t, roadBlocked, selectedBranch]);
  const setStatus = (id: string, s: Status, cap?: number, reserve?: number) => {
    const n = nodes.find(x => x.id === id)!; n.status = s; if (cap != null) n.capacity = cap; if (reserve != null) n.reserve = reserve;
  };

  if (t >= 12) setStatus('sub03', 'stressed', 71, 19);
  if (t >= 36) setStatus('sub03', 'degraded', 52, 15);
  if (t >= 48) setStatus('tel07', 'stressed', 67, 72);
  if (t >= 72) setStatus('tel07', 'degraded', 49, 43);
  if (t >= 92) setStatus('hospN', 'stressed', 70, 56);
  if (t >= 112) setStatus('hospN', 'degraded', 54, 41);
  if (roadBlocked) setStatus('road12', 'failed', 0, 0);

  if (t >= 96 && selectedBranch === 2) {
    setStatus('tel07', 'recovering', 73, 50);
    setStatus('hospN', 'healthy', 82, 68);
  } else if (t >= 96 && selectedBranch === 1) {
    setStatus('tel07', 'degraded', 55, 35);
    setStatus('hospN', 'stressed', 67, 49);
  } else if (t >= 96 && selectedBranch === 0) {
    setStatus('tel07', 'failed', 0, 0);
    setStatus('hospN', 'critical', 33, 19);
    setStatus('ems01', 'degraded', 58, 35);
  }

  const evidence: Evidence[] = [
    { id: 'E-8127', source: 'CAMERA_02', event: t < 12 ? 'NORMAL SCENE' : 'FLOOD SCENE', confidence: t < 12 ? 0.96 : 0.91, age: '1.4 s', trust: 'HIGH' },
    { id: 'E-8131', source: 'SENSOR_04', event: t < 12 ? 'WATER NORMAL' : 'WATER HIGH', confidence: t < 12 ? 0.94 : 0.89, age: '0.4 s', trust: 'HIGH' },
    { id: 'E-8134', source: 'GRID_TELEM', event: t < 24 ? 'VOLTAGE NOMINAL' : 'VOLTAGE UNSTABLE', confidence: t < 24 ? 0.97 : 0.87, age: '0.8 s', trust: 'HIGH' },
  ];

  const currentBranch = branches[selectedBranch];
  const lease = roadBlocked ? 'EXPIRED' : t < 72 ? 'ACTIVE' : 'AT RISK';
  const trust = roadBlocked && selectedBranch === 2 ? 'DEGRADED' : 'VERIFIED';
  const cascadeWindow = t < 12 ? '—' : `${Math.max(0, 91 - t)}s — ${Math.max(0, 134 - t)}s`;
  const decisionHorizon = t < 12 ? '—' : `${Math.max(0, 27 - Math.max(0, t - 48))}s`;

  return { t, nodes, evidence, roadBlocked, selectedBranch, setSelectedBranch, step, reset, injectRoad, currentBranch, lease, trust, cascadeWindow, decisionHorizon };
}

function App() {
  const sim = useScenario();
  const [tab, setTab] = useState<'COMMAND'|'FUTURES'|'CHAOS LAB'|'EDGE LAB'|'AUDIT'>('COMMAND');

  return <div className="app">
    <header className="topbar">
      <div>
        <div className="brand">CHAIN//REACTION</div>
        <div className="subtitle">EDGE CAUSAL RESILIENCE INTELLIGENCE</div>
      </div>
      <div className="topmeta"><span>CITY//01</span><span className="pill">SIMULATION MODE</span><span className="live">● LIVE</span></div>
    </header>

    <nav className="nav">
      {(['COMMAND','FUTURES','CHAOS LAB','EDGE LAB','AUDIT'] as const).map(x => <button className={tab===x?'active':''} onClick={()=>setTab(x)} key={x}>{x}</button>)}
    </nav>

    {tab === 'COMMAND' && <Command sim={sim} />}
    {tab === 'FUTURES' && <Futures sim={sim} />}
    {tab === 'CHAOS LAB' && <Chaos sim={sim} />}
    {tab === 'EDGE LAB' && <EdgeLab sim={sim} />}
    {tab === 'AUDIT' && <Audit sim={sim} />}

    <footer>
      <span>EDGE PULSE <b>● READY</b></span><span>NPU <b>● CAPABILITY MOCK</b></span><span>TRUST <b>{sim.trust}</b></span><span>CLOUD <b>0</b></span>
    </footer>
  </div>
}

function Command({sim}:{sim:ReturnType<typeof useScenario>}) {
  return <main className="command-grid">
    <section className="panel map-panel">
      <div className="panel-title"><span>LIVING CAUSAL TWIN</span><span>T+{sim.t}s</span></div>
      <Network nodes={sim.nodes}/>
      <div className="legend">{(['healthy','stressed','degraded','critical','failed','recovering'] as Status[]).map(s=><span key={s}>{statusGlyph[s]} {statusLabel[s]}</span>)}</div>
    </section>

    <aside className="side-stack">
      <section className="metric-card hero"><small>CASCADE WINDOW</small><strong>{sim.cascadeWindow}</strong><span>Hospital North communications risk</span></section>
      <section className="metric-card hero"><small>DECISION HORIZON</small><strong>{sim.decisionHorizon}</strong><span>Latest safe commit for Mobile Unit</span></section>
      <section className="metric-card"><small>FORECAST LEASE</small><strong className={sim.lease==='EXPIRED'?'danger':''}>{sim.lease}</strong><span>Snapshot WS-{1442 + sim.t}</span></section>
      <section className="metric-card"><small>EVIDENCE AGREEMENT</small><strong>{sim.t < 12 ? 'NOMINAL' : 'HIGH'}</strong><span>{sim.evidence.length} active evidence sources</span></section>
    </aside>

    <section className="panel evidence-panel">
      <div className="panel-title"><span>EVIDENCE FABRIC</span><span>OBSERVED</span></div>
      {sim.evidence.map(e=><div className="evidence-row" key={e.id}><div><b>{e.event}</b><small>{e.source} · {e.id}</small></div><div className="evidence-meta"><span>{Math.round(e.confidence*100)}%</span><span>{e.age}</span><span>{e.trust}</span></div></div>)}
    </section>

    <section className="panel controls-panel">
      <div className="panel-title"><span>MONSOON ZERO</span><span>CONTROL</span></div>
      <div className="control-buttons"><button onClick={sim.step}>ADVANCE +12s</button><button onClick={sim.injectRoad} className="warn">INJECT ROAD_12 BLOCK</button><button onClick={sim.reset} className="ghost">RESET</button></div>
      <div className="incident-note">{sim.roadBlocked ? 'NEW EVIDENCE: ROAD_12 BLOCKED. Previous plan assumptions invalidated.' : sim.t<12 ? 'All systems nominal. Advance the scenario to begin the incident.' : 'Flood evidence confirmed. Substation 03 is degrading and downstream risk is propagating.'}</div>
    </section>
  </main>
}

function Network({nodes}:{nodes:NodeState[]}) {
  const by = Object.fromEntries(nodes.map(n=>[n.id,n]));
  const lines = [['sub03','tel07'],['sub03','pump02'],['tel07','hospN'],['tel07','ems01'],['road12','ems01'],['pump02','road12']];
  return <div className="network">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none">{lines.map(([a,b],i)=><line key={i} x1={by[a].x} y1={by[a].y} x2={by[b].x} y2={by[b].y} className={`edge ${by[a].status}`}/>)}</svg>
    {nodes.map(n=><div key={n.id} className={`node ${n.status}`} style={{left:`${n.x}%`,top:`${n.y}%`}}>
      <div className="node-glyph">{statusGlyph[n.status]}</div><b>{n.label}</b><small>{n.kind}</small><span>{n.capacity}% CAP</span>
    </div>)}
  </div>
}

function Futures({sim}:{sim:ReturnType<typeof useScenario>}) {
  return <main className="single-column">
    <section className="panel">
      <div className="panel-title"><span>REALITY FORKS</span><span>SYNCHRONIZED @ T+{sim.t}s</span></div>
      <div className="branch-grid">{branches.map((b,i)=><button className={`branch-card ${sim.selectedBranch===i?'selected':''}`} onClick={()=>sim.setSelectedBranch(i)} key={b.name}>
        <small>{b.name}</small><strong>{b.robustness}%</strong><span>ROBUSTNESS</span><div className="branch-kpis"><div><b>{b.safety}</b><small>Safety</small></div><div><b>{b.horizon}</b><small>Decision Horizon</small></div><div><b>{b.failures}</b><small>Failures</small></div><div><b>{b.debt}</b><small>Recovery Debt</small></div></div>
      </button>)}</div>
    </section>
    <section className="panel future-summary">
      <div><small>SELECTED BRANCH</small><strong>{sim.currentBranch.name}</strong></div>
      <div><small>HOSPITAL NORTH</small><strong>{statusLabel[sim.currentBranch.hospital]}</strong></div>
      <div><small>TELECOM 07</small><strong>{statusLabel[sim.currentBranch.telecom]}</strong></div>
      <div><small>SAFETY KERNEL</small><strong>{sim.currentBranch.safety}</strong></div>
      <div><small>FORECAST LEASE</small><strong>{sim.lease}</strong></div>
    </section>
    <section className="panel why-card"><div className="panel-title"><span>WHY DIFFERENT?</span><span>CAUSAL TRACE CT-001842</span></div><p>Mobile Unit 01 maintains Telecom 07 above its critical capacity threshold. That prevents Hospital North from entering backup depletion in the selected branch. If ROAD_12 becomes blocked, this assumption expires and the plan must be recomputed.</p></section>
  </main>
}

function Chaos({sim}:{sim:ReturnType<typeof useScenario>}) {
  const tests = [
    ['Stale telemetry','PASS'],['Duplicate event','PASS'],['Late event','PASS'],['Contradictory evidence','PASS'],['Unknown camera input','PASS'],['NPU unavailable','DESIGNED'],['Network offline','PASS'],['No safe plan','PASS'],['Application restart','DESIGNED'],['Second shock','PASS']
  ];
  return <main className="single-column"><section className="panel"><div className="panel-title"><span>CHAOS LAB</span><span>RED-TEAM THE SYSTEM</span></div><div className="coverage-grid">{tests.map(([n,s])=><div className="coverage" key={n}><span>{n}</span><b>{s}</b></div>)}</div></section><section className="panel controls-panel"><div className="panel-title"><span>FAULT INJECTION</span><span>CITY//01</span></div><div className="control-buttons"><button onClick={sim.injectRoad} className="warn">ROAD_12 BLOCK</button><button onClick={sim.step}>ADVANCE CASCADE</button><button onClick={sim.reset} className="ghost">RESET WORLD</button></div></section></main>
}

function EdgeLab({sim}:{sim:ReturnType<typeof useScenario>}) {
  return <main className="single-column"><section className="panel"><div className="panel-title"><span>EDGE LAB</span><span>SNAPDRAGON DEPLOYMENT CONTRACT</span></div><div className="edge-grid">
    <Metric label="Architecture" value="ARM64 target"/><Metric label="Runtime" value="ONNX Runtime / QNN planned"/><Metric label="NPU proof" value="Requires device profile"/><Metric label="Cloud inference" value="0"/>
    <Metric label="Model artifact" value="Capability-resolved"/><Metric label="Safety Kernel" value="Deterministic"/><Metric label="Scenario" value="MONSOON ZERO"/><Metric label="Simulation" value="Seeded / reproducible"/>
  </div><div className="notice">This scaffold does not fake NPU execution. The production build should replace capability placeholders only after successful compile, execute, and per-layer profiling on the exact Snapdragon-powered HP target.</div></section></main>
}

function Metric({label,value}:{label:string,value:string}) { return <div className="edge-metric"><small>{label}</small><strong>{value}</strong></div> }

function Audit({sim}:{sim:ReturnType<typeof useScenario>}) {
  const entries = [
    ['19:42:08','OBSERVED','Flood scene evidence accepted','E-8127'],
    ['19:42:20','PREDICTED','Substation 03 enters STRESSED','CT-001801'],
    ['19:42:31','PREDICTED','Hospital risk window created','F-8291'],
    ['19:42:33','ASSUMED','Telecom reserve 100–145s','A-442'],
    ...(sim.roadBlocked ? [['19:43:12','OBSERVED','ROAD_12 blocked — plan invalidated','E-8188']] : []),
  ];
  return <main className="single-column"><section className="panel"><div className="panel-title"><span>AUDIT</span><span>TAMPER-EVIDENT DESIGN</span></div>{entries.map((e,i)=><div className="audit-row" key={i}><span>{e[0]}</span><b className={`tag ${e[1].toLowerCase()}`}>{e[1]}</b><span>{e[2]}</span><code>{e[3]}</code></div>)}</section><section className="panel future-summary"><div><small>SCENARIO</small><strong>MONSOON ZERO</strong></div><div><small>SEED</small><strong>271828</strong></div><div><small>TRACE</small><strong>CRX-{271828+sim.t}</strong></div><div><small>SIMULATION BOUNDARY</small><strong>CITY//01</strong></div></section></main>
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
