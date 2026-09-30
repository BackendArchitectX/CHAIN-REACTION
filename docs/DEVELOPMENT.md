# Development

## One-step start

### Windows

Double-click `start.cmd`, or run:

```powershell
.\run.ps1
```

### Any supported shell

```bash
npm start
```

The bootstrap verifies Node.js 22, installs dependencies only when required, opens the browser, and starts the local Vite application on `127.0.0.1`.

## Prerequisites

- Node.js 22 LTS
- npm 10+
- Git when working from a clone

No backend process, Docker container, API key, database, or cloud service is required for the current CITY//01 simulation build.

## Standard commands

```bash
npm start          # one-step bootstrap and launch
npm run doctor     # environment/repository contract check
npm run dev        # local-only development server
npm run dev:lan    # explicitly expose dev server to LAN
npm test           # deterministic test suite
npm run typecheck  # strict TypeScript validation
npm run build      # production build
npm run verify     # doctor + typecheck + tests + build
npm run clean      # remove generated output/cache
```

## Runtime safety

The default development server binds to `127.0.0.1`. LAN exposure requires the explicit `npm run dev:lan` command.

## Generated files

Never commit:

- `node_modules/`
- `dist/`
- `.vite/`
- `.cache/`
- coverage output
- local `.env*` files except `.env.example`

## Before a commit

Run:

```bash
npm run verify
```

The GitHub Actions `verify` workflow performs the same project verification plus the dependency security severity gate.
