# Operations Runbook

This runbook covers the local CITY//01 competition build. It is not an operational municipal deployment guide.

## Supported startup path

Use exactly one of the following entry points:

- Windows double-click: `start.cmd`
- PowerShell: `.\run.ps1`
- Cross-platform terminal: `npm start`

All three converge on `scripts/bootstrap.mjs`. There is no second service to start.

## Startup contract

The bootstrap performs these steps in order:

1. Validate Node.js `>=22.12 <23` and npm `10.x`.
2. Require the committed `package-lock.json`.
3. Compare the manifest/lockfile fingerprint with the last successful local dependency restore.
4. Validate the existing top-level npm dependency tree before reuse.
5. Run `npm ci` only when dependencies are missing, stale, or invalid.
6. Run `npm run doctor`.
7. Start Vite on `127.0.0.1:5173` with a strict port and open the browser.

When `CHAIN_REACTION_PREFLIGHT_ONLY=1`, the same launcher contract exits successfully after the doctor step. CI uses this to test `start.cmd`, `run.ps1`, and `start.sh`.

## Failure handling

| Failure | Expected behavior | Recovery |
| --- | --- | --- |
| Node/npm missing or unsupported | Startup exits before dependency work | Install Node.js 22 LTS with npm 10.x |
| Lockfile missing | Startup fails closed | Restore `package-lock.json` from `main` |
| Dependencies stale/corrupt | Bootstrap performs a clean locked restore | Re-run `npm start`; use `npm run clean` if needed |
| Port 5173 occupied | Vite exits instead of silently choosing another port | Stop the conflicting process, then re-run |
| Doctor/quality/typecheck/test failure | Verification exits non-zero | Fix the reported contract violation before continuing |
| UI render failure | Error boundary enters safe recovery mode | Reload after correcting the underlying issue |
| NPU proof absent/invalid | NPU remains unverified | Supply exact-device QNN proof; never substitute synthetic metrics |

## Runtime production smoke

`npm run runtime:smoke` starts the built application on loopback port 4173, requests the application shell and build manifest, requests every artifact declared in that manifest, and terminates the preview process.

## Verification

Before presenting or deploying a build:

```bash
npm run verify
```

For dependency security parity with CI:

```bash
npm audit --audit-level=high
```

## Network posture

The standard local server is loopback-only. `npm run dev:lan` is intentionally separate and should be used only when LAN access is required for a controlled demo.

## Recovery and cleanup

```bash
npm run clean
npm start
```

`clean` removes generated build/cache output, not source files or committed proof/scenario artifacts.
