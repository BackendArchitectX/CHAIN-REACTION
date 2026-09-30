import { spawnSync } from 'node:child_process';

const EXPECTED_NAME = 'backendarchitectx';
const EXPECTED_EMAIL = '96111851+BackendArchitectX@users.noreply.github.com';
const EXPECTED_ACTOR = 'backendarchitectx';
const ciMode = process.argv.includes('--ci');

function runGit(args) {
  return spawnSync('git', args, { encoding: 'utf8', shell: false });
}

function gitRequired(args) {
  const result = runGit(args);
  if (result.status !== 0) {
    const message = (result.stderr || result.stdout || '').trim();
    fail(message || `git ${args.join(' ')} failed`);
  }
  return result.stdout.trim();
}

function gitOptional(args) {
  const result = runGit(args);
  return result.status === 0 ? result.stdout.trim() : '';
}

function fail(message) {
  console.error(`[CHAIN//REACTION] Git identity check failed: ${message}`);
  process.exit(1);
}

function assertNoCoAuthors() {
  const messages = gitRequired(['log', '--format=%B']);
  if (/^Co-authored-by:/im.test(messages)) {
    fail('Co-authored-by metadata is present in repository history.');
  }
}

function assertHistoryEmail() {
  const emails = gitRequired(['log', '--format=%ae'])
    .split(/\r?\n/)
    .map(value => value.trim())
    .filter(Boolean);
  const unexpected = [...new Set(emails.filter(email => email.toLowerCase() !== EXPECTED_EMAIL.toLowerCase()))];
  if (unexpected.length) {
    fail(`unexpected commit author email(s): ${unexpected.join(', ')}`);
  }

  const committerEmails = gitRequired(['log', '--format=%ce'])
    .split(/\r?\n/)
    .map(value => value.trim())
    .filter(Boolean);
  const unexpectedCommitters = [...new Set(committerEmails.filter(email => email.toLowerCase() !== EXPECTED_EMAIL.toLowerCase()))];
  if (unexpectedCommitters.length) {
    fail(`unexpected commit committer email(s): ${unexpectedCommitters.join(', ')}`);
  }
}

assertNoCoAuthors();

if (ciMode) {
  const actor = (process.env.GITHUB_ACTOR || '').trim().toLowerCase();
  if (actor && actor !== EXPECTED_ACTOR) {
    fail(`workflow actor "${process.env.GITHUB_ACTOR}" is not BackendArchitectX.`);
  }

  assertHistoryEmail();

  const headAuthorEmail = gitRequired(['log', '-1', '--format=%ae']);
  const headCommitterEmail = gitRequired(['log', '-1', '--format=%ce']);
  if (headAuthorEmail.toLowerCase() !== EXPECTED_EMAIL.toLowerCase()) {
    fail(`HEAD author email "${headAuthorEmail}" is not the verified BackendArchitectX noreply identity.`);
  }
  if (headCommitterEmail.toLowerCase() !== EXPECTED_EMAIL.toLowerCase()) {
    fail(`HEAD committer email "${headCommitterEmail}" is not the verified BackendArchitectX noreply identity.`);
  }

  console.log('[CHAIN//REACTION] Git identity audit passed: history uses the verified BackendArchitectX noreply identity, no co-author trailers are present, and the workflow actor is BackendArchitectX when available.');
  process.exit(0);
}

const localName = gitOptional(['config', '--local', '--get', 'user.name']);
const localEmail = gitOptional(['config', '--local', '--get', 'user.email']);

if (localName.toLowerCase() !== EXPECTED_NAME) {
  fail(`local user.name must be "backendarchitectx"; found "${localName || 'unset'}". Configure it with: git config --local user.name "backendarchitectx"`);
}

if (localEmail.toLowerCase() !== EXPECTED_EMAIL.toLowerCase()) {
  fail(`local user.email must be the repository-verified BackendArchitectX GitHub noreply address; found "${localEmail || 'unset'}". See CONTRIBUTING.md for the exact repository-local command.`);
}

console.log('[CHAIN//REACTION] Local Git identity is configured for backendarchitectx with the repository-verified GitHub noreply address.');
