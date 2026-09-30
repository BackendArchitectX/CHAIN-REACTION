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

The bootstrap validates the runtime, validates the installed npm dependency tree, restores dependencies from the committed lockfile only when required, runs repository preflight, starts Vite on `127.0.0.1:5173`, and opens the browser.

## Prerequisites

- Node.js `>=22.12 <23`
- npm `10.x`
- Git when working from a clone

A fresh clone requires package-registry access for the first `npm ci`. After dependencies are restored, CITY//01 does not require a backend, database, cloud inference service, or continuous internet connection.

## Standard commands

```bash
npm start               # one-step deterministic bootstrap and launch
npm run doctor          # environment, architecture, lockfile, startup contract
npm run lint            # repository and layer quality gate
npm run repo:audit      # tracked junk/secrets/conflict/debt audit
npm run license:audit   # dependency license metadata review
npm run a11y            # accessibility contract gate
npm run git:identity    # verify repository-local contributor identity
npm run typecheck       # strict TypeScript validation
npm test                # deterministic assurance suite
npm run build           # production build + SHA-256 manifest
npm run reproducibility # require identical consecutive build manifests
npm run smoke           # static production reference/hash/budget checks
npm run runtime:smoke   # serve dist and verify built assets over HTTP
npm run sbom            # CycloneDX SBOM
npm run verify          # complete local release-quality gate
npm run clean           # remove generated output/cache
npm run dev             # localhost-only dev server
npm run dev:lan         # explicit LAN exposure
npm run preview         # localhost production preview
```

## Environment configuration

The application currently requires no user-provided runtime environment variables. `.env.example` documents that intentionally empty public configuration surface plus the CI-only launcher flags.

Do not create a real `.env` unless the architecture later gains environment-specific runtime configuration. Real environment files remain ignored by Git.

## Dependency policy

`package-lock.json` is committed and is part of the build contract.

- local bootstrap and CI use `npm ci`;
- top-level dependency versions are exact;
- installed dependencies are health-checked before reuse;
- the manifest/lockfile engine contract must remain aligned.

Do not delete the lockfile or replace locked installs with floating dependency resolution.

## Runtime safety

Development binds to `127.0.0.1` by default. LAN exposure requires `npm run dev:lan`.

Port `5173` is strict, so a conflict fails explicitly instead of silently moving the application. Production preview uses strict port `4173`.

## Fresh-clone assurance

CI has a dedicated Linux/Windows fresh-clone matrix. It checks out the repository with no project dependencies installed and runs only the root launcher.

The launcher itself must:

1. validate the runtime;
2. restore locked dependencies;
3. validate repository startup contracts;
4. exit successfully in CI preflight mode.

This protects the promised developer experience from depending on a previously prepared machine.

## Generated files

Never commit:

- `node_modules/`
- `dist/`
- `.vite/`
- `.cache/`
- coverage output
- local `.env*` files except a safe example if one is introduced

## Main-only workflow

This repository intentionally has one maintained branch: `main`.

Product features live under `src/features/*`; they are feature modules, not Git feature branches. Completed work is integrated into `main`, and repository automation removes non-`main` branches.

## Before considering work complete

Run:

```bash
npm run verify
```

Then ensure CI is green on Linux and Windows.
