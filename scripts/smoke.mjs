import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const manifestPath = join(dist, 'build-manifest.json');
const failures = [];

function fail(message) {
  failures.push(message);
}

function walk(directory) {
  return readdirSync(directory).flatMap(name => {
    const absolute = join(directory, name);
    return statSync(absolute).isDirectory() ? walk(absolute) : [absolute];
  });
}

if (!existsSync(join(dist, 'index.html'))) fail('dist/index.html is missing.');
if (!existsSync(join(dist, 'THIRD_PARTY_LICENSES.txt'))) fail('dist/THIRD_PARTY_LICENSES.txt is missing.');
if (!existsSync(manifestPath)) fail('dist/build-manifest.json is missing.');

if (failures.length === 0) {
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  if (!html.includes('id="root"')) fail('Production HTML does not contain the React root.');
  if (/script-src[^;]*'unsafe-inline'/i.test(html)) fail('Production CSP must not permit unsafe-inline scripts.');
  if (!(manifest.files ?? []).some(entry => entry.path === 'THIRD_PARTY_LICENSES.txt')) {
    fail('Production manifest does not include THIRD_PARTY_LICENSES.txt.');
  }
  if (html.includes('/src/main.tsx')) fail('Production HTML still references the development TypeScript entry point.');
  if (/\b(?:src|href)=["']https?:\/\//i.test(html)) fail('Production HTML contains an external runtime asset reference.');

  const references = [...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)]
    .map(match => match[1])
    .filter(value => !value.startsWith('#') && !value.startsWith('data:'))
    .map(value => value.split(/[?#]/)[0].replace(/^\.\//, '').replace(/^\//, ''));

  for (const reference of references) {
    if (!existsSync(join(dist, reference))) fail(`Referenced production asset is missing: ${reference}`);
  }

  for (const entry of manifest.files ?? []) {
    const absolute = join(dist, entry.path);
    if (!existsSync(absolute)) {
      fail(`Manifest file is missing: ${entry.path}`);
      continue;
    }
    const actual = createHash('sha256').update(readFileSync(absolute)).digest('hex');
    if (actual !== entry.sha256) fail(`Manifest hash mismatch: ${entry.path}`);
  }

  const productionFiles = walk(dist).filter(path => !['.map'].includes(extname(path)));
  const sourceMaps = walk(dist).filter(path => path.endsWith('.map'));
  if (sourceMaps.length > 0) fail('Production source maps must not be emitted.');

  const jsBytes = productionFiles.filter(path => extname(path) === '.js').reduce((sum, path) => sum + statSync(path).size, 0);
  const cssBytes = productionFiles.filter(path => extname(path) === '.css').reduce((sum, path) => sum + statSync(path).size, 0);
  const assetBytes = productionFiles.reduce((sum, path) => sum + statSync(path).size, 0);

  const budgets = {
    javascript: 1_500_000,
    css: 500_000,
    total: 2_500_000,
  };

  if (jsBytes > budgets.javascript) fail(`JavaScript budget exceeded: ${jsBytes} > ${budgets.javascript} bytes.`);
  if (cssBytes > budgets.css) fail(`CSS budget exceeded: ${cssBytes} > ${budgets.css} bytes.`);
  if (assetBytes > budgets.total) fail(`Total production budget exceeded: ${assetBytes} > ${budgets.total} bytes.`);

  console.log(`[CHAIN//REACTION] Production budgets — JS ${jsBytes} B, CSS ${cssBytes} B, total ${assetBytes} B.`);
}

if (failures.length) {
  console.error(`[CHAIN//REACTION] Production smoke gate failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('[CHAIN//REACTION] Production smoke and artifact-integrity gate passed.');
