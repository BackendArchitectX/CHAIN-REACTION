import { readFileSync } from 'node:fs';
import { extname } from 'node:path';
import { spawnSync } from 'node:child_process';

const failures = [];
const markerWords = ['TO' + 'DO', 'FIX' + 'ME', 'HA' + 'CK', 'X' + 'XX'];
const conflictMarkers = ['<'.repeat(7), '='.repeat(7), '>'.repeat(7)];
const forbiddenExtensions = new Set(['.log', '.zip', '.tar', '.gz', '.7z', '.pem', '.p12', '.pfx', '.key']);
const textExtensions = new Set([
  '', '.md', '.txt', '.json', '.yml', '.yaml', '.ts', '.tsx', '.js', '.mjs', '.cjs',
  '.html', '.css', '.scss', '.ps1', '.cmd', '.sh', '.gitignore', '.gitattributes',
  '.editorconfig', '.npmrc',
]);

function fail(rule, path, detail) {
  failures.push({ rule, path, detail });
}

function git(args) {
  const result = spawnSync('git', args, { encoding: 'utf8', shell: false });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim() || `git ${args.join(' ')} failed`;
    console.error(`[CHAIN//REACTION] Repository audit could not inspect tracked files: ${detail}`);
    process.exit(1);
  }
  return result.stdout;
}

const tracked = git(['ls-files', '-z']).split('\0').filter(Boolean);

for (const path of tracked) {
  const normalized = path.replaceAll('\\', '/');
  const lower = normalized.toLowerCase();
  const extension = extname(lower);

  if (
    lower.startsWith('node_modules/')
    || lower.startsWith('dist/')
    || lower.startsWith('coverage/')
    || lower.startsWith('.cache/')
    || lower.includes('/.cache/')
    || lower.endsWith('.tsbuildinfo')
    || forbiddenExtensions.has(extension)
  ) {
    fail('generated-or-sensitive-artifact', normalized, 'This file type/path must not be tracked.');
  }

  if ((lower === '.env' || lower.startsWith('.env.')) && lower !== '.env.example') {
    fail('environment-secret-file', normalized, 'Real environment files must not be tracked.');
  }

  const shouldRead = textExtensions.has(extension)
    || ['.gitignore', '.gitattributes', '.editorconfig', '.npmrc'].includes(lower);

  if (!shouldRead) continue;

  let content;
  try {
    content = readFileSync(normalized, 'utf8');
  } catch {
    fail('readability', normalized, 'Tracked text file could not be read as UTF-8.');
    continue;
  }

  if (conflictMarkers.some(marker => content.includes(marker))) {
    fail('merge-conflict-marker', normalized, 'Unresolved merge-conflict marker detected.');
  }

  if (/^(?:src|tests|scripts)\//.test(normalized)) {
    for (const marker of markerWords) {
      const pattern = new RegExp(`\\b${marker}\\b`, 'i');
      if (pattern.test(content)) {
        fail('technical-debt-marker', normalized, `${marker} marker must be resolved or documented outside runtime/test code.`);
      }
    }
  }

  const privateKeyMarker = ['-----BEGIN', 'PRIVATE', 'KEY-----'].join(' ');
  if (content.includes(privateKeyMarker)) {
    fail('private-key-material', normalized, 'Private key material must never be committed.');
  }
  if (/AKIA[0-9A-Z]{16}/.test(content)) {
    fail('aws-access-key', normalized, 'Possible AWS access key detected.');
  }
  if (/gh[pousr]_[A-Za-z0-9]{30,}/.test(content)) {
    fail('github-token', normalized, 'Possible GitHub token detected.');
  }
  if (/sk-[A-Za-z0-9_-]{24,}/.test(content)) {
    fail('api-secret', normalized, 'Possible API secret detected.');
  }
}

if (failures.length) {
  console.error(`[CHAIN//REACTION] Repository audit failed with ${failures.length} issue(s):`);
  for (const item of failures) {
    console.error(`- ${item.rule}: ${item.path} — ${item.detail}`);
  }
  process.exit(1);
}

console.log(`[CHAIN//REACTION] Repository audit passed: ${tracked.length} tracked files checked for junk, conflict markers, unresolved debt markers, and common secret material.`);
