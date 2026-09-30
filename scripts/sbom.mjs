import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnNpm } from './lib/npm.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

mkdirSync(dist, { recursive: true });

const result = spawnNpm(['sbom', '--sbom-format=cyclonedx'], {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 10 * 1024 * 1024,
});

if (result.error || result.status !== 0) {
  console.error('[CHAIN//REACTION] Failed to generate CycloneDX SBOM.');
  if (result.stderr) console.error(result.stderr.trim());
  process.exit(result.status ?? 1);
}

let parsed;
try {
  parsed = JSON.parse(result.stdout);
} catch {
  console.error('[CHAIN//REACTION] npm sbom returned invalid JSON.');
  process.exit(1);
}

if (parsed.bomFormat !== 'CycloneDX' || !Array.isArray(parsed.components)) {
  console.error('[CHAIN//REACTION] SBOM does not satisfy the expected CycloneDX contract.');
  process.exit(1);
}

const output = join(dist, 'sbom.cdx.json');
writeFileSync(output, JSON.stringify(parsed, null, 2) + '\n', 'utf8');

if (!existsSync(output)) {
  console.error('[CHAIN//REACTION] SBOM output was not created.');
  process.exit(1);
}

console.log(`[CHAIN//REACTION] CycloneDX SBOM written with ${parsed.components.length} component(s).`);
