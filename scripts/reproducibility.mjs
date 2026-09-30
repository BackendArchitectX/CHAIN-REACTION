import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnNpm } from './lib/npm.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = join(root, 'dist', 'build-manifest.json');

function fail(message) {
  console.error(`[CHAIN//REACTION] Reproducibility gate failed: ${message}`);
  process.exit(1);
}

function normalizedManifest() {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  return JSON.stringify({
    schema: manifest.schema,
    product: manifest.product,
    version: manifest.version,
    target: manifest.target,
    files: [...manifest.files].sort((a, b) => a.path.localeCompare(b.path)),
  });
}

const first = normalizedManifest();
const secondBuild = spawnNpm(['run', 'build'], {
  cwd: root,
  stdio: 'inherit',
});

if (secondBuild.error) fail(secondBuild.error.message);
if (secondBuild.status !== 0) process.exit(secondBuild.status ?? 1);

const second = normalizedManifest();
if (first !== second) {
  fail('Two consecutive production builds produced different artifact manifests.');
}

console.log('[CHAIN//REACTION] Reproducible-build gate passed: consecutive production manifests are identical.');
