import { spawnSync } from 'node:child_process';

export function spawnNpm(args, options = {}) {
  const npmExecPath = process.env.npm_execpath;

  if (npmExecPath) {
    return spawnSync(process.execPath, [npmExecPath, ...args], {
      shell: false,
      ...options,
    });
  }

  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  return spawnSync(command, args, {
    shell: process.platform === 'win32',
    ...options,
  });
}
