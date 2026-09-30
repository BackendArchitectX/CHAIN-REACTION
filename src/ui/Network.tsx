import React from 'react';
import { EDGES, NODES } from '../data/city01';
import { edgeState } from '../core/engine';
import type { Mission } from '../app/useMission';
import { STATUS_GLYPH, STATUS_LABEL, statusSeverity } from '../shared/status';
import { MiniBar } from './primitives';

export function Network({ snapshot }: { snapshot: Mission['liveRun']['final'] }) {
  const nodeMeta = Object.fromEntries(NODES.map(node => [node.id, node]));
  const textSummary = NODES
    .map(meta => {
      const node = snapshot.nodes[meta.id];
      return `${meta.label}: ${STATUS_LABEL[node.status]}, capacity ${Math.round(node.capacity)} percent, reserve ${Math.round(node.reserve)}.`;
    })
    .join(' ');

  return <>
    <div
      className="network"
      role="img"
      aria-label="CITY//01 causal infrastructure topology"
      aria-describedby="network-summary"
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {EDGES.map(edge => {
          const source = nodeMeta[edge.source];
          const target = nodeMeta[edge.target];
          const state = edgeState(edge.source, snapshot);
          const active = statusSeverity(state) >= 2;
          return <g key={edge.id}>
            <line
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              className={`edge ${state} ${active ? 'propagating' : ''}`}
            />
            <text x={(source.x + target.x) / 2} y={(source.y + target.y) / 2 - 1.2} className="edge-label">
              {edge.type}
            </text>
          </g>;
        })}
      </svg>

      {NODES.map(meta => {
        const node = snapshot.nodes[meta.id];
        return <div
          key={meta.id}
          className={`node ${node.status}`}
          style={{ left: `${meta.x}%`, top: `${meta.y}%` }}
          title={`${meta.label}: ${STATUS_LABEL[node.status]}, capacity ${Math.round(node.capacity)}%`}
          aria-hidden="true"
        >
          <div className="node-head">
            <span className="node-glyph">{STATUS_GLYPH[node.status]}</span>
            <span className="node-kind">{meta.kind}</span>
          </div>
          <b>{meta.label}</b>
          <div className="node-bars">
            <MiniBar label="CAP" value={node.capacity} />
            <MiniBar label="RES" value={meta.id === 'tel07' ? Math.min(100, node.reserve / 1.2) : node.reserve} />
          </div>
        </div>;
      })}
    </div>
    <div id="network-summary" className="sr-only">
      {textSummary}
    </div>
  </>;
}
