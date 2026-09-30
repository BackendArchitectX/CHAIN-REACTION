# Development

## One-step start

The supported development flow is intentionally one step after cloning.

### Windows

Double-click `start.cmd`, or run:

```powershell
.\run.ps1
```

### Any supported shell

```bash
npm start
```

The bootstrap validates the runtime, restores dependencies from the committed lockfile only when required, runs the repository preflight, starts Vite on `127.0.0.1:5173`, and opens the browser.

## Prerequisites

- Node.js `>=22.12 <23`
- npm `10.x`
- Git when working from a clone

No backend process, Docker container, API key, database, or cloud service is required for the current CITY//01 simulation build.

## Standard commands

```bash
npm start          # one-step deterministic bootstrap and launch
npm run doctor     # environment, architecture, lockfile, and startup contract
npm run lint       # zero-dependency repository and layer quality gate
npm run typecheck  # strict TypeScript validation for src + tests
npm test           # deterministic assurance suite
npm run build      # typecheck + production build + SHA-256 manifest
npm run reproducibility # require identical manifests from consecutive builds
npm run smoke      # validate production references, hashes, and bundle budgets
npm run sbom       # generate CycloneDX SBOM
npm run verify     # complete local release-quality gate
npm run clean      # remove generated output/cache
npm run dev        # localhost-only development server on :5173
npm run dev:lan    # explicit LAN exposure on :5173
npm run preview    # localhost-only production preview on :4173
```

## Dependency policy

`package-lock.json` is committed and is part of the build contract. Local bootstrap and CI use `npm ci`; do not delete the lockfile or replace locked installs with floating dependency resolution.

Top-level dependency versions in `package.json` are exact. The repository quality gate verifies manifest/lockfile version and engine parity.

## Runtime safety

Development binds to `127.0.0.1` by default. LAN exposure requires `npm run dev:lan`. Port `5173` is strict so an occupied port fails clearly instead of silently starting on a different address. Production preview uses strict port `4173`.

## Generated files

Never commit:

- `node_modules/`
- `dist/`
- `.vite/`
- `.cache/`
- coverage output
- local `.env*` files except `.env.example`

## Before a mainline change

Run:

```bash
npm run verify
```

The same gate is executed in GitHub Actions together with the high/critical dependency audit.

## Main-only workflow

This repository intentionally has one maintained branch: `main`. Product features live under `src/features/*`; they are feature modules, not long-lived Git branches. All completed work is integrated directly into `main` and non-`main` repository branches are automatically removed.
