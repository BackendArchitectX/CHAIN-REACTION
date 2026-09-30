import React from 'react';

export function PanelTitle({ left, right }: { left: string; right: string }) {
  return <div className="panel-title"><span>{left}</span><span>{right}</span></div>;
}

export function MetricCard({
  label,
  value,
  description,
  hero = false,
  danger = false,
}: {
  label: string;
  value: string;
  description: string;
  hero?: boolean;
  danger?: boolean;
}) {
  return <section className={`metric-card ${hero ? 'hero' : ''}`}>
    <small>{label}</small>
    <strong className={danger ? 'text-danger' : ''}>{value}</strong>
    <span>{description}</span>
  </section>;
}

export function EdgeMetric({ label, value }: { label: string; value: string }) {
  return <div className="edge-metric"><small>{label}</small><strong>{value}</strong></div>;
}

export function Kpi({ label, value }: { label: string; value: string }) {
  return <div><b>{value}</b><small>{label}</small></div>;
}

export function MiniBar({ label, value }: { label: string; value: number }) {
  return <div className="mini-bar">
    <span>{label}</span>
    <div><i style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>
    <b>{Math.round(value)}</b>
  </div>;
}

export function EmptyState({ title, copy }: { title: string; copy: string }) {
  return <div className="empty-state"><b>{title}</b><span>{copy}</span></div>;
}
