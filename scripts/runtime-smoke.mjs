import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const viteCli = join(root, 'node_modules', 'vite', 'bin', 'vite.js');
const origin = 'http://127.0.0.1:4173';
const deadline = Date.now() + 15_000;

const child = spawn(process.execPath, [
  viteCli,
  'preview',
  '--host', '127.0.0.1',
  '--port', '4173',
  '--strictPort',
], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'pipe'],
  windowsHide: true,
});

let stderr = '';
child.stderr.on('data', chunk => {
  stderr += chunk.toString();
});

async function waitForServer() {
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Preview server exited early with code ${child.exitCode}: ${stderr.trim()}`);
    }
    try {
      const response = await fetch(origin, { redirect: 'error' });
      if (response.ok) return response;
    } catch {
      // Preview server is still starting.
    }
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  throw new Error('Preview server did not become ready within 15 seconds.');
}

async function run() {
  try {
    const response = await waitForServer();
    const html = await response.text();

    if (!html.includes('id="root"')) {
      throw new Error('Served application HTML does not contain the React root.');
    }

    const manifestResponse = await fetch(`${origin}/build-manifest.json`, { redirect: 'error' });
    if (!manifestResponse.ok) {
      throw new Error(`Build manifest endpoint returned HTTP ${manifestResponse.status}.`);
    }

    const manifest = await manifestResponse.json();
    if (manifest.schema !== 'chainreaction.build-manifest.v1' || !Array.isArray(manifest.files) || manifest.files.length === 0) {
      throw new Error('Served build manifest does not satisfy the production contract.');
    }

    for (const entry of manifest.files) {
      const assetResponse = await fetch(`${origin}/${entry.path}`, { redirect: 'error' });
      if (!assetResponse.ok) {
        throw new Error(`Served production asset is unavailable: ${entry.path} (HTTP ${assetResponse.status}).`);
      }
    }

    console.log(`[CHAIN//REACTION] Runtime smoke passed at ${origin}; verified ${manifest.files.length} served production artifact(s).`);
  } finally {
    child.kill('SIGTERM');
  }
}

run().catch(error => {
  console.error(`[CHAIN//REACTION] Runtime smoke failed: ${error instanceof Error ? error.message : String(error)}`);
  child.kill('SIGTERM');
  process.exit(1);
});
