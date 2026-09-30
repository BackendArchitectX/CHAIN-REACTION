import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const lock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'));
const packages = lock.packages ?? {};

if (!existsSync(dist) || !statSync(dist).isDirectory()) {
  console.error('[CHAIN//REACTION] dist/ does not exist. Run the production build before generating third-party notices.');
  process.exit(1);
}

function licenseFiles(packageDirectory) {
  if (!existsSync(packageDirectory)) return [];
  return readdirSync(packageDirectory)
    .filter(name => /^(?:licen[cs]e|copying)(?:[._-].*)?$/i.test(name))
    .sort((a, b) => a.localeCompare(b));
}

const runtimePackages = Object.entries(packages)
  .filter(([path, metadata]) => path.startsWith('node_modules/') && metadata.dev !== true)
  .map(([path, metadata]) => ({
    path,
    name: typeof metadata.name === 'string' ? metadata.name : path.replace(/^node_modules\//, ''),
    version: typeof metadata.version === 'string' ? metadata.version : 'unknown',
    license: typeof metadata.license === 'string' ? metadata.license.trim() : 'UNKNOWN',
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const failures = [];
const sections = [
  'CHAIN//REACTION THIRD-PARTY LICENSE NOTICES',
  '',
  'Generated deterministically from installed runtime npm packages.',
  'This file is an engineering attribution artifact, not a legal-compliance certification.',
  '',
];

for (const dependency of runtimePackages) {
  const packageDirectory = join(root, dependency.path);
  const files = licenseFiles(packageDirectory);

  if (files.length === 0) {
    failures.push(`${dependency.name}@${dependency.version}: no LICENSE/LICENCE/COPYING file found in installed package`);
    continue;
  }

  sections.push('='.repeat(78));
  sections.push(`${dependency.name}@${dependency.version}`);
  sections.push(`Declared license: ${dependency.license}`);
  sections.push('');

  const seen = new Set();
  for (const file of files) {
    const content = readFileSync(join(packageDirectory, file), 'utf8')
      .replace(/\r\n/g, '\n')
      .trim();

    if (!content || seen.has(content)) continue;
    seen.add(content);
    sections.push(`--- ${file} ---`);
    sections.push(content);
    sections.push('');
  }
}

if (failures.length) {
  console.error('[CHAIN//REACTION] Third-party notice generation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const output = sections.join('\n').trimEnd() + '\n';
writeFileSync(join(dist, 'THIRD_PARTY_LICENSES.txt'), output, 'utf8');
console.log(`[CHAIN//REACTION] Third-party notices written for ${runtimePackages.length} runtime package(s).`);
