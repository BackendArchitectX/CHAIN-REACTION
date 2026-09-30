import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const checks = [
  ['src/app/App.tsx', 'className="skip-link"', 'skip link'],
  ['src/app/App.tsx', 'role="tablist"', 'tablist semantics'],
  ['src/app/App.tsx', 'role="tabpanel"', 'tabpanel semantics'],
  ['src/app/App.tsx', 'aria-live="polite"', 'live status'],
  ['src/features/command/CommandView.tsx', 'aria-pressed={mission.playing}', 'run toggle state'],
  ['src/features/futures/FuturesView.tsx', 'aria-pressed={selected}', 'plan selection state'],
  ['src/features/chaos/ChaosLabView.tsx', 'aria-pressed={mission.chaos[key]}', 'chaos toggle state'],
  ['src/ui/Network.tsx', 'className="sr-only"', 'topology text equivalent'],
  ['src/styles.css', ':focus-visible', 'visible keyboard focus'],
  ['src/styles.css', 'prefers-reduced-motion:reduce', 'reduced motion'],
];

const failures = checks.filter(([path, token]) => !readFileSync(join(root, path), 'utf8').includes(token));

if (failures.length) {
  console.error('[CHAIN//REACTION] Accessibility contract failed:');
  for (const [path, , label] of failures) console.error(`- ${path}: missing ${label}`);
  process.exit(1);
}

console.log(`[CHAIN//REACTION] Accessibility contract passed: ${checks.length} checks.`);
