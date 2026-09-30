import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const checks = [];

function record(name, pass, detail) {
  checks.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name.padEnd(32)} ${detail}`);
}

function exists(relativePath) {
  return existsSync(join(root, relativePath));
}

const [nodeMajor, nodeMinor] = process.versions.node.split('.').map(Number);
record('Node.js runtime', nodeMajor === 22 && nodeMinor >= 12, process.version);

const npm = spawnSync(npmCommand, ['--version'], { encoding: 'utf8', shell: false });
const npmVersion = npm.status === 0 ? npm.stdout.trim() : 'not available';
const npmMajor = npm.status === 0 ? Number(npmVersion.split('.')[0]) : 0;
record('npm runtime', npm.status === 0 && npmMajor === 10, npmVersion);

const requiredPaths = [
  ['package.json', 'project manifest'],
  ['package-lock.json', 'committed deterministic lockfile'],
  ['tsconfig.json', 'strict TypeScript configuration'],
  ['vite.config.ts', 'Vite configuration'],
  ['src/main.tsx', 'thin browser bootstrap'],
  ['src/app/App.tsx', 'application composition'],
  ['src/app/useMission.ts', 'mission orchestration'],
  ['src/app/ErrorBoundary.tsx', 'fail-safe UI boundary'],
  ['src/core/safety.ts', 'independent Safety Kernel'],
  ['src/edge/capabilities.ts', 'edge proof boundary'],
  ['tests', 'assurance test suite'],
  ['start.cmd', 'one-click Windows launcher'],
  ['run.ps1', 'PowerShell launcher'],
  ['start.sh', 'Unix launcher'],
  ['scripts/bootstrap.mjs', 'one-step bootstrap automation'],
  ['scripts/quality.mjs', 'repository quality gate'],
  ['scripts/build-manifest.mjs', 'production artifact manifest'],
  ['scripts/smoke.mjs', 'production smoke gate'],
  ['scripts/sbom.mjs', 'CycloneDX SBOM generator'],
  ['scripts/reproducibility.mjs', 'reproducible-build gate'],
  ['docs/SUPPLY_CHAIN.md', 'software supply-chain contract'],
  ['docs/adr/0001-main-only-trunk.md', 'main-only trunk ADR'],
  ['docs/adr/0002-deterministic-core.md', 'deterministic core ADR'],
];

for (const [path, detail] of requiredPaths) record(path, exists(path), detail);
for (const feature of ['command', 'futures', 'chaos', 'edge', 'audit']) {
  record(`Feature: ${feature}`, exists(`src/features/${feature}`), `src/features/${feature}/`);
}

const packagePath = join(root, 'package.json');
const lockPath = join(root, 'package-lock.json');
if (existsSync(packagePath)) {
  const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
  record('Project version', pkg.version === '0.5.0', pkg.version ?? 'missing');
  record('Single-step start script', pkg.scripts?.start === 'node ./scripts/bootstrap.mjs', pkg.scripts?.start ?? 'missing');
  record('Local-only dev binding', pkg.scripts?.dev === 'vite --host 127.0.0.1 --port 5173 --strictPort', pkg.scripts?.dev ?? 'missing');
  record('Explicit LAN opt-in', pkg.scripts?.['dev:lan'] === 'vite --host 0.0.0.0 --port 5173 --strictPort', pkg.scripts?.['dev:lan'] ?? 'missing');
  record('Node engine contract', pkg.engines?.node === '>=22.12 <23', pkg.engines?.node ?? 'missing');
  record('npm engine contract', pkg.engines?.npm === '>=10 <11', pkg.engines?.npm ?? 'missing');
  record('Quality gate wired', pkg.scripts?.lint === 'node ./scripts/quality.mjs', pkg.scripts?.lint ?? 'missing');
  record('Smoke gate wired', pkg.scripts?.smoke === 'node ./scripts/smoke.mjs', pkg.scripts?.smoke ?? 'missing');
  record('SBOM gate wired', pkg.scripts?.sbom === 'node ./scripts/sbom.mjs', pkg.scripts?.sbom ?? 'missing');
  record('Reproducibility gate wired', pkg.scripts?.reproducibility === 'node ./scripts/reproducibility.mjs', pkg.scripts?.reproducibility ?? 'missing');
  record('Artifact manifest wired', pkg.scripts?.build?.includes('build-manifest.mjs') === true, pkg.scripts?.build ?? 'missing');

  if (existsSync(lockPath)) {
    const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
    record('Lockfile schema', lock.lockfileVersion === 3, `v${lock.lockfileVersion ?? 'missing'}`);
    record('Manifest/lock parity', lock.version === pkg.version && lock.packages?.['']?.version === pkg.version, `${pkg.version} / ${lock.version ?? 'missing'}`);
  }
}

const mainPath = join(root, 'src', 'main.tsx');
if (existsSync(mainPath)) {
  const lineCount = readFileSync(mainPath, 'utf8').split(/\r?\n/).length;
  record('Thin browser bootstrap', lineCount <= 30, `${lineCount} lines`);
}

const corePath = join(root, 'src', 'core');
if (existsSync(corePath)) {
  const reactImports = readdirSync(corePath)
    .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'))
    .filter(file => /from\s+['"]react['"]|require\(['"]react['"]\)/.test(readFileSync(join(corePath, file), 'utf8')));
  record('Core/UI dependency boundary', reactImports.length === 0, reactImports.length ? reactImports.join(', ') : 'core has no React imports');
}

const vitePath = join(root, 'vite.config.ts');
if (existsSync(vitePath)) {
  const viteConfig = readFileSync(vitePath, 'utf8');
  record('Production source maps disabled', /sourcemap:\s*false/.test(viteConfig), 'vite.config.ts');
}

record('Legacy root demo removed', !exists('demo.html'), 'single application entry path');

const failures = checks.filter(check => !check.pass);
if (failures.length) {
  console.error(`\n[CHAIN//REACTION] Environment check failed: ${failures.length} issue(s).`);
  process.exit(1);
}

console.log('\n[CHAIN//REACTION] Environment, architecture, reproducibility, and startup contract verified.');
