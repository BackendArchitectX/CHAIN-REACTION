import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const checked = [];

function fail(rule, target, detail) {
  failures.push({ rule, target, detail });
}

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap(name => {
    const absolute = join(directory, name);
    return statSync(absolute).isDirectory() ? walk(absolute) : [absolute];
  });
}

function projectPath(absolute) {
  return relative(root, absolute).replaceAll('\\', '/');
}

function readJson(path) {
  return JSON.parse(readFileSync(join(root, path), 'utf8'));
}

function isExactVersion(version) {
  return /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version);
}

const packageLockPath = join(root, 'package-lock.json');

if (!existsSync(packageLockPath)) {
  fail('reproducible-install', 'package-lock.json', 'Committed npm lockfile is required.');
} else {
  const pkg = readJson('package.json');
  const lock = readJson('package-lock.json');
  const rootLock = lock.packages?.[''];

  if (lock.lockfileVersion !== 3) fail('lockfile-version', 'package-lock.json', `Expected lockfileVersion 3, found ${lock.lockfileVersion}.`);
  if (lock.version !== pkg.version || rootLock?.version !== pkg.version) {
    fail('version-parity', 'package-lock.json', `package.json=${pkg.version}, lock=${lock.version}, root=${rootLock?.version ?? 'missing'}.`);
  }
  if (rootLock?.engines?.node !== pkg.engines?.node || rootLock?.engines?.npm !== pkg.engines?.npm) {
    fail('engine-parity', 'package-lock.json', 'Root lockfile engine contract must match package.json.');
  }

  const requiredScripts = {
    start: 'node ./scripts/bootstrap.mjs',
    lint: 'node ./scripts/quality.mjs',
    a11y: 'node ./scripts/accessibility.mjs',
    'git:identity': 'node ./scripts/git-identity.mjs',
    smoke: 'node ./scripts/smoke.mjs',
    'runtime:smoke': 'node ./scripts/runtime-smoke.mjs',
    sbom: 'node ./scripts/sbom.mjs',
    reproducibility: 'node ./scripts/reproducibility.mjs',
  };
  for (const [name, expected] of Object.entries(requiredScripts)) {
    if (pkg.scripts?.[name] !== expected) fail('script-contract', `package.json:scripts.${name}`, `Expected "${expected}".`);
  }
  if (!pkg.scripts?.build?.includes('build-manifest.mjs')) {
    fail('artifact-manifest', 'package.json:scripts.build', 'Production build must emit the SHA-256 build manifest.');
  }
  if (!pkg.scripts?.verify?.includes('npm run a11y') || !pkg.scripts?.verify?.includes('npm run smoke') || !pkg.scripts?.verify?.includes('npm run runtime:smoke') || !pkg.scripts?.verify?.includes('npm run sbom') || !pkg.scripts?.verify?.includes('npm run reproducibility')) {
    fail('release-gate', 'package.json:scripts.verify', 'Verification must include accessibility, reproducibility, static smoke, runtime smoke, and SBOM gates.');
  }

  for (const [group, dependencies] of Object.entries({ dependencies: pkg.dependencies ?? {}, devDependencies: pkg.devDependencies ?? {} })) {
    for (const [name, version] of Object.entries(dependencies)) {
      if (typeof version !== 'string' || !isExactVersion(version)) {
        fail('exact-dependencies', `package.json:${group}.${name}`, `Expected exact semver, found ${String(version)}.`);
      }
    }
  }
}

const sourceFiles = ['src', 'tests', 'scripts']
  .flatMap(directory => walk(join(root, directory)))
  .filter(path => ['.ts', '.tsx', '.mjs'].includes(extname(path)));

for (const absolute of sourceFiles) {
  const path = projectPath(absolute);
  const content = readFileSync(absolute, 'utf8');
  checked.push(path);

  if (/[ \t]+$/m.test(content)) fail('trailing-whitespace', path, 'Trailing whitespace is not allowed.');
  if (/\beval\s*\(/.test(content) || /\bnew\s+Function\s*\(/.test(content)) {
    fail('dynamic-code-execution', path, 'eval/new Function is prohibited.');
  }

  const deterministicLayer = /^(src\/(core|data|edge)\/)/.test(path);
  if (deterministicLayer) {
    if (/from\s+['"]react['"]|require\(['"]react['"]\)/.test(content)) {
      fail('layer-boundary', path, 'Deterministic domain layers must not depend on React.');
    }
    if (/\b(window|document|navigator|localStorage|sessionStorage)\b/.test(content)) {
      fail('browser-boundary', path, 'Deterministic domain layers must not access browser globals.');
    }
    if (/\b(fetch|WebSocket|EventSource)\s*\(/.test(content)) {
      fail('network-boundary', path, 'Deterministic domain layers must not perform network I/O.');
    }
  }

  if (path.startsWith('src/core/') && /from\s+['"]\.\.\/(app|features|ui|edge)\//.test(content)) {
    fail('core-dependency-direction', path, 'Core may not import application, feature, UI, or hardware-boundary modules.');
  }
}

const mainPath = join(root, 'src', 'main.tsx');
if (existsSync(mainPath)) {
  const lines = readFileSync(mainPath, 'utf8').split(/\r?\n/).length;
  if (lines > 30) fail('thin-bootstrap', 'src/main.tsx', `Expected <=30 lines, found ${lines}.`);
}

const viteConfigPath = join(root, 'vite.config.ts');
if (existsSync(viteConfigPath) && !/sourcemap:\s*false/.test(readFileSync(viteConfigPath, 'utf8'))) {
  fail('production-sourcemaps', 'vite.config.ts', 'Production source maps must be disabled for the release build.');
}

const indexPath = join(root, 'index.html');
if (existsSync(indexPath)) {
  const html = readFileSync(indexPath, 'utf8');
  if (!html.includes('Content-Security-Policy')) fail('html-security', 'index.html', 'Content Security Policy metadata is required.');
  if (!html.includes('name="referrer"')) fail('html-security', 'index.html', 'Referrer policy metadata is required.');
}

const workflowRoot = join(root, '.github', 'workflows');
if (existsSync(workflowRoot)) {
  for (const workflow of walk(workflowRoot).filter(path => /\.ya?ml$/.test(path))) {
    const path = projectPath(workflow);
    const content = readFileSync(workflow, 'utf8');
    for (const match of content.matchAll(/uses:\s*([^\s]+)@([^\s#]+)/g)) {
      const reference = match[2];
      if (!/^[0-9a-f]{40}$/i.test(reference)) {
        fail('action-pin', path, `External GitHub Action must be pinned to a 40-character commit SHA: ${match[0]}`);
      }
    }
  }
}

if (existsSync(join(root, 'demo.html'))) fail('single-entrypoint', 'demo.html', 'Legacy duplicate application entry point must stay removed.');

if (failures.length) {
  console.error(`[CHAIN//REACTION] Quality gate failed with ${failures.length} issue(s):`);
  for (const item of failures) console.error(`- ${item.rule}: ${item.target} — ${item.detail}`);
  process.exit(1);
}

console.log(`[CHAIN//REACTION] Quality gate passed: ${checked.length} source/test/script files checked.`);
