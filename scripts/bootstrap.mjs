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

function fail(message, correctiveAction) {
  console.error(`\n[CHAIN//REACTION] STARTUP FAILED: ${message}`);
  if (correctiveAction) console.error(`[CHAIN//REACTION] NEXT STEP: ${correctiveAction}`);
  console.error('');
  process.exit(1);
}

function runNpm(args, { phase, correctiveAction, ...options } = {}) {
  const result = spawnNpm(args, {
    cwd: projectRoot,
    stdio: 'inherit',
    ...options,
  });

  if (result.error) {
    fail(
      `${phase ?? `npm ${args.join(' ')}`} could not start: ${result.error.message}`,
      correctiveAction,
    );
  }

  if (result.status !== 0) {
    fail(
      `${phase ?? `npm ${args.join(' ')}`} exited with code ${result.status ?? 1}.`,
      correctiveAction,
    );
  }
}

function assertRuntime() {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major !== 22 || minor < 12) {
    fail(
      `Node.js >=22.12 <23 is required. Detected ${process.version}.`,
      'Install Node.js 22 LTS, reopen the terminal, then run the same one-step launcher again.',
    );
  }

  const npmVersion = spawnNpm(['--version'], { cwd: projectRoot, encoding: 'utf8' });
  if (npmVersion.status !== 0) {
    fail(
      'npm was not found.',
      'Install Node.js 22 LTS with npm 10.x, reopen the terminal, then retry.',
    );
  }

  const npmMajor = Number(npmVersion.stdout.trim().split('.')[0]);
  if (npmMajor !== 10) {
    fail(
      `npm 10.x is required. Detected ${npmVersion.stdout.trim()}.`,
      'Use the npm version bundled with the supported Node.js 22 LTS environment, then retry.',
    );
  }

  if (!existsSync(packageLock)) {
    fail(
      'package-lock.json is required for deterministic one-step startup.',
      'Restore package-lock.json from main before starting the application.',
    );
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
    if (!treeReady) {
      fail(
        'Pre-installed dependencies are unavailable or invalid while CHAIN_REACTION_SKIP_INSTALL=1 is set.',
        'Unset CHAIN_REACTION_SKIP_INSTALL or run npm ci before retrying the preflight.',
      );
    }
    console.log('[CHAIN//REACTION] Pre-installed dependency tree verified without mutation.');
    return;
  }

  if (dependenciesReady) {
    console.log('[CHAIN//REACTION] Dependencies are current.');
    return;
  }

  console.log('[CHAIN//REACTION] Restoring locked project dependencies...');
  runNpm(['ci', '--no-fund', '--no-audit'], {
    phase: 'Locked dependency restore',
    correctiveAction: 'Check package-registry/network access, then retry. If local dependencies are corrupt, run npm run clean and start again.',
  });

  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(stampFile, dependencyFingerprint(), 'utf8');
}

assertRuntime();
ensureDependencies();

console.log('[CHAIN//REACTION] Running startup preflight...');
runNpm(['run', 'doctor'], {
  phase: 'Repository startup preflight',
  correctiveAction: 'Run npm run doctor directly for the detailed failing contract, fix it, then retry startup.',
});

if (process.env.CHAIN_REACTION_PREFLIGHT_ONLY === '1') {
  console.log('[CHAIN//REACTION] Preflight-only startup contract completed successfully.');
  process.exit(0);
}

console.log('[CHAIN//REACTION] Starting CITY//01 at http://127.0.0.1:5173 ...');
runNpm(['run', 'dev', '--', '--open'], {
  phase: 'Development server',
  correctiveAction: 'Check whether port 5173 is already in use. Stop the conflicting process and run the launcher again.',
});
