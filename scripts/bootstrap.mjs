import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const cacheDir = join(projectRoot, '.cache');
const stampFile = join(cacheDir, 'dependencies.sha256');
const packageJson = join(projectRoot, 'package.json');
const packageLock = join(projectRoot, 'package-lock.json');
const viteBinary = join(projectRoot, 'node_modules', '.bin', process.platform === 'win32' ? 'vite.cmd' : 'vite');

function fail(message) {
  console.error(`\n[CHAIN//REACTION] ${message}\n`);
  process.exit(1);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: false,
    ...options,
  });
  if (result.error) fail(result.error.message);
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function assertRuntime() {
  const major = Number(process.versions.node.split('.')[0]);
  if (major !== 22) fail(`Node.js 22 LTS is required. Detected ${process.version}.`);

  const npmVersion = spawnSync(npmCommand, ['--version'], { encoding: 'utf8', shell: false });
  if (npmVersion.status !== 0) fail('npm was not found. Install Node.js 22 LTS with npm.');
}

function dependencyFingerprint() {
  const hash = createHash('sha256');
  hash.update(readFileSync(packageJson));
  if (existsSync(packageLock)) hash.update(readFileSync(packageLock));
  return hash.digest('hex');
}

function ensureDependencies() {
  const fingerprint = dependencyFingerprint();
  const previous = existsSync(stampFile) ? readFileSync(stampFile, 'utf8').trim() : '';
  const dependenciesReady = existsSync(viteBinary) && previous === fingerprint;

  if (process.env.CHAIN_REACTION_SKIP_INSTALL === '1') {
    if (!existsSync(viteBinary)) fail('Dependencies are missing and CHAIN_REACTION_SKIP_INSTALL=1 is set.');
    return;
  }

  if (dependenciesReady) {
    console.log('[CHAIN//REACTION] Dependencies are current.');
    return;
  }

  console.log('[CHAIN//REACTION] Preparing deterministic development dependencies...');
  if (existsSync(packageLock)) {
    run(npmCommand, ['ci', '--no-fund']);
  } else {
    console.warn('[CHAIN//REACTION] package-lock.json is not present yet; using npm install.');
    run(npmCommand, ['install', '--no-fund']);
  }

  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(stampFile, dependencyFingerprint(), 'utf8');
}

assertRuntime();
ensureDependencies();
console.log('[CHAIN//REACTION] Starting CITY//01 at http://127.0.0.1:5173 ...');
run(npmCommand, ['run', 'dev', '--', '--open']);
