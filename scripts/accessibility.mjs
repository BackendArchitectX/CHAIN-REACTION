import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const structuralChecks = [
  ['src/app/App.tsx', 'className="skip-link"', 'skip link'],
  ['src/app/App.tsx', 'role="tablist"', 'tablist semantics'],
  ['src/app/App.tsx', 'role="tabpanel"', 'tabpanel semantics'],
  ['src/app/App.tsx', 'aria-live="polite"', 'live status'],
  ['src/features/command/CommandView.tsx', 'aria-pressed={mission.playing}', 'simulation toggle state'],
  ['src/features/futures/FuturesView.tsx', 'aria-pressed={selected}', 'plan selection state'],
  ['src/features/chaos/ChaosLabView.tsx', 'aria-pressed={mission.chaos[key]}', 'chaos toggle state'],
  ['src/ui/Network.tsx', 'className="sr-only"', 'topology text equivalent'],
  ['src/styles.css', ':focus-visible', 'visible keyboard focus'],
  ['src/styles.css', 'prefers-reduced-motion:reduce', 'reduced motion'],
];

const failures = structuralChecks
  .filter(([path, token]) => !readFileSync(join(root, path), 'utf8').includes(token))
  .map(([path, , label]) => `${path}: missing ${label}`);

function parseHex(value) {
  if (!/^#[0-9a-f]{6}$/i.test(value)) return null;
  return [
    Number.parseInt(value.slice(1, 3), 16),
    Number.parseInt(value.slice(3, 5), 16),
    Number.parseInt(value.slice(5, 7), 16),
  ];
}

function relativeLuminance(hex) {
  const rgb = parseHex(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map(channel => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  if (foregroundLuminance == null || backgroundLuminance == null) return null;
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

const css = readFileSync(join(root, 'src/styles.css'), 'utf8');
const lightThemeMarker = '/* Premium light mission-control theme */';
const markerIndex = css.indexOf(lightThemeMarker);
let contrastCheckCount = 0;

if (markerIndex < 0) {
  failures.push('src/styles.css: missing premium light-theme contract marker');
} else {
  const lightTheme = css.slice(markerIndex);
  const color = name => lightTheme.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1] ?? null;
  const contrastChecks = [
    ['primary text / panel', color('text'), color('panel')],
    ['muted text / panel', color('muted'), color('panel')],
    ['muted text / secondary panel', color('muted'), color('panel2')],
    ['soft text / panel', color('soft'), color('panel')],
    ['danger text / panel', color('danger'), color('panel')],
    ['warning text / panel', color('warn'), color('panel')],
    ['good-state text / panel', color('good'), color('panel')],
    ['network secondary text / network surface', color('muted-strong'), color('network-bg')],
  ];
  contrastCheckCount = contrastChecks.length;

  for (const [label, foreground, background] of contrastChecks) {
    if (!foreground || !background) {
      failures.push(`src/styles.css: missing color token for ${label}`);
      continue;
    }
    const ratio = contrastRatio(foreground, background);
    if (ratio == null || ratio < 4.5) {
      failures.push(`src/styles.css: ${label} contrast ${ratio?.toFixed(2) ?? 'invalid'}:1 is below the 4.5:1 small-text contract`);
    }
  }
}

if (failures.length) {
  console.error('[CHAIN//REACTION] Accessibility contract failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`[CHAIN//REACTION] Accessibility contract passed: ${structuralChecks.length} structural checks + ${contrastCheckCount} light-theme contrast checks.`);
