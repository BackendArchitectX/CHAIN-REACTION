export function formatSeconds(value: number | null) {
  if (value == null) return '—';
  if (value <= 0) return '00:00';
  const minutes = Math.floor(value / 60).toString().padStart(2, '0');
  const seconds = Math.floor(value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function missionTime(t: number) {
  const base = 19 * 3600 + 42 * 60;
  const total = base + t;
  const hh = Math.floor(total / 3600) % 24;
  const mm = Math.floor((total % 3600) / 60);
  const ss = total % 60;
  return [hh, mm, ss].map(value => String(value).padStart(2, '0')).join(':');
}
