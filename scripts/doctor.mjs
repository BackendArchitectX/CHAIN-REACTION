import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const checks = [];

function record(name, pass, detail) {
  checks.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name.padEnd(28)} ${detail}`);
}

const nodeMajor = Number(process.versions.node.split('.')[0]);
record('Node.js runtime', nodeMajor === 22, process.version);

const npm = spawnSync(npmCommand, ['--version'], { encoding: 'utf8', shell: false });
record('npm', npm.status === 0, npm.status === 0 ? npm.stdout.trim() : 'not available');

record('package.json', existsSync(join(root, 'package.json')), 'project manifest');
record('TypeScript config', existsSync(join(root, 'tsconfig.json')), 'tsconfig.json');
record('Vite config', existsSync(join(root, 'vite.config.ts')), 'vite.config.ts');
record('Application entry point', existsSync(join(root, 'src', 'main.tsx')), 'src/main.tsx');
record('Safety Kernel', existsSync(join(root, 'src', 'core', 'safety.ts')), 'src/core/safety.ts');
record('Tests', existsSync(join(root, 'tests')), 'tests/');

const packagePath = join(root, 'package.json');
if (existsSync(packagePath)) {
  const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
  record('Project version', typeof pkg.version === 'string', pkg.version ?? 'missing');
  record('Single-step start script', pkg.scripts?.start === 'node ./scripts/bootstrap.mjs', pkg.scripts?.start ?? 'missing');
}

const failures = checks.filter(check => !check.pass);
if (failures.length) {
  console.error(`\n[CHAIN//REACTION] Environment check failed: ${failures.length} issue(s).`);
  process.exit(1);
}

console.log('\n[CHAIN//REACTION] Environment and repository contract verified.');
