import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
for (const target of ['dist', '.vite', '.cache']) {
  const path = join(root, target);
  if (existsSync(path)) {
    rmSync(path, { recursive: true, force: true });
    console.log(`[CHAIN//REACTION] Removed ${target}/`);
  }
}
