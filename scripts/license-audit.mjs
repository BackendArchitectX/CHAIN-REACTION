import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const lock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'));
const packages = lock.packages ?? {};

const reviewedLicenses = new Set([
  'MIT',
  'ISC',
  'Apache-2.0',
  'BSD-3-Clause',
  'CC-BY-4.0',
]);

const failures = [];
const counts = new Map();
const runtime = [];

for (const [path, metadata] of Object.entries(packages)) {
  if (!path) continue;

  const name = typeof metadata.name === 'string'
    ? metadata.name
    : path.replace(/^node_modules\//, '');
  const version = typeof metadata.version === 'string' ? metadata.version : 'unknown';
  const license = typeof metadata.license === 'string' ? metadata.license.trim() : '';

  if (!license) {
    failures.push(`${name}@${version}: missing license metadata`);
    continue;
  }

  counts.set(license, (counts.get(license) ?? 0) + 1);

  if (!reviewedLicenses.has(license)) {
    failures.push(`${name}@${version}: unreviewed license identifier "${license}"`);
  }

  if (metadata.dev !== true) {
    runtime.push({ name, version, license });
  }
}

if (failures.length) {
  console.error('[CHAIN//REACTION] Dependency license metadata audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  console.error('[CHAIN//REACTION] Review newly introduced license metadata deliberately before updating the reviewed set.');
  process.exit(1);
}

console.log('[CHAIN//REACTION] Dependency license metadata audit passed.');
for (const [license, count] of [...counts.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  console.log(`  ${license}: ${count}`);
}
console.log('[CHAIN//REACTION] Runtime dependency metadata:');
for (const dependency of runtime.sort((a, b) => a.name.localeCompare(b.name))) {
  console.log(`  ${dependency.name}@${dependency.version}: ${dependency.license}`);
}
console.log('[CHAIN//REACTION] Metadata review is an engineering gate, not a legal-compliance certification.');
