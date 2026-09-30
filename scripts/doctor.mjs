import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const checks = [];

function record(name, pass, detail) {
  checks.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name.padEnd(30)} ${detail}`);
}

function exists(relativePath) {
  return existsSync(join(root, relativePath));
}

const nodeMajor = Number(process.versions.node.split('.')[0]);
record('Node.js runtime', nodeMajor === 22, process.version);

const npm = spawnSync(npmCommand, ['--version'], { encoding: 'utf8', shell: false });
record('npm', npm.status === 0, npm.status === 0 ? npm.stdout.trim() : 'not available');

record('package.json', exists('package.json'), 'project manifest');
record('TypeScript config', exists('tsconfig.json'), 'tsconfig.json');
record('Vite config', exists('vite.config.ts'), 'vite.config.ts');
record('Application entry point', exists('src/main.tsx'), 'src/main.tsx');
record('Application composition', exists('src/app/App.tsx'), 'src/app/App.tsx');
record('Mission orchestration', exists('src/app/useMission.ts'), 'src/app/useMission.ts');
record('Fail-safe UI boundary', exists('src/app/ErrorBoundary.tsx'), 'src/app/ErrorBoundary.tsx');
record('Safety Kernel', exists('src/core/safety.ts'), 'src/core/safety.ts');
record('Edge proof boundary', exists('src/edge/capabilities.ts'), 'src/edge/capabilities.ts');
record('Tests', exists('tests'), 'tests/');
record('One-click Windows start', exists('start.cmd'), 'start.cmd');
record('PowerShell start', exists('run.ps1'), 'run.ps1');
record('Bootstrap automation', exists('scripts/bootstrap.mjs'), 'scripts/bootstrap.mjs');

for (const feature of ['command', 'futures', 'chaos', 'edge', 'audit']) {
  record(`Feature: ${feature}`, exists(`src/features/${feature}`), `src/features/${feature}/`);
}

const packagePath = join(root, 'package.json');
if (existsSync(packagePath)) {
  const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
  record('Project version', pkg.version === '0.4.0', pkg.version ?? 'missing');
  record('Single-step start script', pkg.scripts?.start === 'node ./scripts/bootstrap.mjs', pkg.scripts?.start ?? 'missing');
  record('Local-only dev binding', pkg.scripts?.dev === 'vite --host 127.0.0.1', pkg.scripts?.dev ?? 'missing');
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

record('Legacy root demo removed', !exists('demo.html'), 'single application entry path');

const failures = checks.filter(check => !check.pass);
if (failures.length) {
  console.error(`\n[CHAIN//REACTION] Environment check failed: ${failures.length} issue(s).`);
  process.exit(1);
}

console.log('\n[CHAIN//REACTION] Environment, architecture, and repository contract verified.');
