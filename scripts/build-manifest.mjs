import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

if (!existsSync(dist)) {
  console.error('[CHAIN//REACTION] dist/ does not exist. Run the production build first.');
  process.exit(1);
}

function walk(directory) {
  return readdirSync(directory)
    .flatMap(name => {
      const absolute = join(directory, name);
      return statSync(absolute).isDirectory() ? walk(absolute) : [absolute];
    })
    .sort();
}

const files = walk(dist)
  .filter(path => !['build-manifest.json', 'sbom.cdx.json'].includes(relative(dist, path).replaceAll('\\', '/')))
  .map(path => {
    const content = readFileSync(path);
    return {
      path: relative(dist, path).replaceAll('\\', '/'),
      bytes: content.byteLength,
      sha256: createHash('sha256').update(content).digest('hex'),
    };
  });

const manifest = {
  schema: 'chainreaction.build-manifest.v1',
  product: 'CHAIN//REACTION',
  version: packageJson.version,
  target: 'web-es2022',
  files,
};

writeFileSync(join(dist, 'build-manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`[CHAIN//REACTION] Build manifest written for ${files.length} production file(s).`);
