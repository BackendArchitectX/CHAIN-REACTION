import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnNpm } from './lib/npm.mjs';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const cacheDir = join(projectRoot, '.cache');
const stampFile = join(cacheDir, 'dependencies.sha256');
const packageJson = join(projectRoot, 'package.json');
const packageLock = join(projectRoot, 'package-lock.json');
const viteBinary = join(projectRoot, 'node_modules', '.bin', process.platform === 'win32' ? 'vite.cmd' : 'vite');
const reactPackage = join(projectRoot, 'node_modules', 'react', 'package.json');
const reactDomPackage = join(projectRoot, 'node_modules', 'react-dom', 'package.json');

function fail(message) {
  console.error(`\n[CHAIN//REACTION] ${message}\n`);
  process.exit(1);
}

function runNpm(args, options = {}) {
  const result = spawnNpm(args, {
    cwd: projectRoot,
    stdio: 'inherit',
    ...options,
  });
  if (result.error) fail(result.error.message);
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function assertRuntime() {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major !== 22 || minor < 12) {
    fail(`Node.js >=22.12 <23 is required. Detected ${process.version}.`);
  }

  const npmVersion = spawnNpm(['--version'], { cwd: projectRoot, encoding: 'utf8' });
  if (npmVersion.status !== 0) fail('npm was not found. Install Node.js 22 LTS with npm 10.');
  const npmMajor = Number(npmVersion.stdout.trim().split('.')[0]);
  if (npmMajor !== 10) fail(`npm 10.x is required. Detected ${npmVersion.stdout.trim()}.`);

  if (!existsSync(packageLock)) {
    fail('package-lock.json is required for deterministic one-step startup. Restore it from main before starting.');
  }
}

function dependencyFingerprint() {
  const hash = createHash('sha256');
  hash.update(readFileSync(packageJson));
  hash.update(readFileSync(packageLock));
  return hash.digest('hex');
}

function ensureDependencies() {
  const fingerprint = dependencyFingerprint();
  const previous = existsSync(stampFile) ? readFileSync(stampFile, 'utf8').trim() : '';
  const filesReady = [viteBinary, reactPackage, reactDomPackage].every(existsSync);
  const dependencyTree = filesReady
    ? spawnNpm(['ls', '--depth=0', '--silent'], {
        cwd: projectRoot,
        stdio: 'ignore',
      })
    : null;
  const treeReady = filesReady && dependencyTree?.status === 0;
  const dependenciesReady = treeReady && previous === fingerprint;

  if (process.env.CHAIN_REACTION_SKIP_INSTALL === '1') {
    if (!treeReady) fail('Pre-installed dependencies are unavailable or invalid and CHAIN_REACTION_SKIP_INSTALL=1 is set.');
    console.log('[CHAIN//REACTION] Pre-installed dependency tree verified without mutation.');
    return;
  }

  if (dependenciesReady) {
    console.log('[CHAIN//REACTION] Dependencies are current.');
    return;
  }

  console.log('[CHAIN//REACTION] Restoring locked project dependencies...');
  runNpm(['ci', '--no-fund', '--no-audit']);

  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(stampFile, dependencyFingerprint(), 'utf8');
}

assertRuntime();
ensureDependencies();
console.log('[CHAIN//REACTION] Running startup preflight...');
runNpm(['run', 'doctor']);

if (process.env.CHAIN_REACTION_PREFLIGHT_ONLY === '1') {
  console.log('[CHAIN//REACTION] Preflight-only startup contract completed successfully.');
  process.exit(0);
}

console.log('[CHAIN//REACTION] Starting CITY//01 at http://127.0.0.1:5173 ...');
runNpm(['run', 'dev', '--', '--open']);
