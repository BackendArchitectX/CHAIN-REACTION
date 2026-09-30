# CHAIN//REACTION

**Edge Causal Resilience Intelligence for Snapdragon-powered PCs**

> **Observe uncertainty. Fork the future. Preserve the critical.**

CHAIN//REACTION is a local-first resilience decision-support system built for the Snapdragon AI Lab Build & Present Challenge. It combines a deterministic synthetic infrastructure world model, evidence-aware incident reasoning, paired counterfactual planning, an independent Safety Kernel, and an exact-device hardware-proof boundary for future Snapdragon NPU perception.

The current environment is **CITY//01**, a synthetic infrastructure network. It validates software architecture, deterministic behavior, safety logic, reproducibility, assurance workflows, and user experience. It does **not** claim operational municipal validation.

## Problem statement

Infrastructure failures can cascade across power, telecom, transport, water, healthcare, and emergency-response systems. CHAIN//REACTION models those dependencies so a human operator can compare interventions, inspect uncertainty, and understand simulated downstream consequences before acting.

The current product is decision-support software for a synthetic environment. It is designed for challenge reviewers, resilience analysts, and engineers evaluating deterministic causal simulation and edge-AI proof boundaries.

## One-step start

### Windows

Double-click:

```text
start.cmd
```

or:

```powershell
.\run.ps1
```

### Any supported terminal

```bash
npm start
```

That is the entire startup flow. The bootstrap:

1. validates Node.js and npm;
2. validates the committed lockfile;
3. validates any existing dependency tree;
4. restores locked dependencies with `npm ci` only when required;
5. runs the repository/environment preflight;
6. starts the application on `127.0.0.1:5173`;
7. opens the browser.

A fresh clone requires package-registry access for the initial dependency restore. Once dependencies are present, CITY//01 itself has no cloud runtime dependency.

**Required runtime:** Node.js `>=22.12 <23`, npm `10.x`.

No separate backend terminal, Docker container, database, Redis, Kafka, API key, or cloud AI service is required for the current build.

## Technology stack

- React 19
- TypeScript 5
- Vite 7
- Vitest 5
- deterministic TypeScript simulation core
- GitHub Actions
- CodeQL
- CycloneDX SBOM generation

## Engineering commands

```bash
npm start               # one-step bootstrap + browser launch
npm run doctor          # environment/repository contract
npm run lint            # repository/layer quality gate
npm run repo:audit      # tracked junk/secrets/conflict/debt audit
npm run license:audit   # dependency license metadata review
npm run a11y            # accessibility contract gate
npm run git:identity     # verify local backendarchitectx Git identity
npm run typecheck       # strict TypeScript validation
npm test                # deterministic assurance tests
npm run build           # production build + SHA-256 manifest
npm run reproducibility # build twice and compare manifests
npm run smoke           # static production artifact/budget smoke
npm run runtime:smoke   # serve dist and request built artifacts
npm run sbom            # CycloneDX SBOM
npm run verify          # complete local release-quality gate
npm run clean           # remove generated output/cache
npm run dev             # localhost development server
npm run dev:lan         # explicit LAN development mode
npm run preview         # localhost production preview
```

Before treating a change as complete:

```bash
npm run verify
```

## Product capabilities

- **Living Causal Twin** — explicit dependencies across power, telecom, healthcare, water, transport, and response systems.
- **Evidence Fabric** — confidence, freshness, provenance, deduplication, contradictions, lateness, and clock-skew diagnostics.
- **Reality Forks** — synchronized intervention branches from equivalent world state.
- **Common-randomness evaluation** — candidate plans face the same sampled uncertainties.
- **Resilience Envelope** — robustness across hundreds of plausible futures.
- **Decision Horizon** — remaining time in which intervention can still become effective.
- **Decision Stability** — exposes fragile plan choices.
- **Next Best Observation** — shows the most valuable missing measurement.
- **Independent Safety Kernel** — hard constraints reject unsafe or infeasible simulated plans.
- **Forecast Lease** — stale forecasts expire after world changes or TTL expiration.
- **Proof of Prevention** — paired counterfactuals quantify intervention impact.
- **Edge Lab** — NPU status remains unverified until exact-device QNN evidence passes the proof gate.
- **Audit & Reproducibility** — deterministic trace fingerprints and reproducibility-capsule export.

## Architecture

```text
Camera / Sensor / Scenario / Operator
                │
                ▼
         Evidence Fabric
                │
                ▼
       Living Causal Twin
                │
       ┌────────┴────────┐
       ▼                 ▼
Twin Consistency   Assumption Model
       └────────┬────────┘
                ▼
          Future Compiler
                │
                ▼
        Resilience Envelope
                │
       ┌────────┴────────┐
       ▼                 ▼
 Reality Forks     Decision Horizon
       └────────┬────────┘
                ▼
             Planner
                │
                ▼
         Safety Kernel
                │
                ▼
              Human
```

The simulator and Safety Kernel are deterministic CPU logic. The browser UI is presentation only. Snapdragon NPU execution is never inferred from configuration and remains unverified until exact-device evidence passes the hardware-proof contract.

## Repository structure

```text
CHAIN-REACTION/
├── .github/
│   ├── CODEOWNERS
│   └── workflows/
│       ├── ci.yml
│       ├── codeql.yml
│       ├── pages.yml
│       ├── security-audit.yml
│       ├── identity.yml
│       └── single-branch.yml
├── docs/
│   ├── adr/
│   ├── ARCHITECTURE.md
│   ├── ACCESSIBILITY.md
│   ├── DEVELOPMENT.md
│   ├── OPERATIONS.md
│   ├── RELEASE.md
│   ├── REPOSITORY_STANDARD.md
│   ├── SYSTEM_BOUNDARIES.md
│   ├── TESTING.md
│   ├── SUPPLY_CHAIN.md
│   ├── THREAT_MODEL.md
│   └── HARDWARE_PROOF.md
├── public/
│   └── scenarios/
├── scripts/
│   ├── lib/npm.mjs
│   ├── bootstrap.mjs
│   ├── doctor.mjs
│   ├── quality.mjs
│   ├── repository-audit.mjs
│   ├── license-audit.mjs
│   ├── accessibility.mjs
│   ├── git-identity.mjs
│   ├── build-manifest.mjs
│   ├── reproducibility.mjs
│   ├── smoke.mjs
│   ├── runtime-smoke.mjs
│   ├── sbom.mjs
│   └── clean.mjs
├── src/
│   ├── app/
│   ├── core/
│   ├── data/
│   ├── edge/
│   ├── features/
│   │   ├── audit/
│   │   ├── chaos/
│   │   ├── command/
│   │   ├── edge/
│   │   └── futures/
│   ├── shared/
│   ├── ui/
│   └── main.tsx
├── tests/
├── .env.example
├── start.cmd
├── start.sh
├── run.ps1
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

The dependency direction is intentional: presentation features depend on application/domain contracts; deterministic domain logic does not depend on React or browser APIs.

## Startup assurance

CI tests the one-step contract on both Linux and Windows.

A dedicated fresh-clone matrix starts with no `node_modules` and invokes only the root launcher:

- Linux: `./start.sh`
- Windows: `start.cmd`

The bootstrap itself must restore locked dependencies and complete preflight. Separate Windows verification also executes both `run.ps1` and `start.cmd`.

## Quality and security gates

A release-quality verification includes:

- repository/environment doctor;
- architectural dependency checks;
- tracked-repository hygiene, unresolved conflict/debt marker, and common secret-material checks;
- dependency license metadata review;
- accessibility contract checks;
- strict TypeScript;
- deterministic and metamorphic tests;
- production build;
- SHA-256 artifact manifest;
- consecutive-build reproducibility;
- static bundle budgets;
- served-production HTTP smoke;
- CycloneDX SBOM;
- high/critical npm vulnerability blocking;
- CodeQL JavaScript/TypeScript analysis;
- immutable commit-SHA pinning for external GitHub Actions;
- scheduled dependency-security re-audit.

## Security notes

Security controls are deliberately matched to the current local-browser architecture:

- development and preview bind to loopback by default;
- LAN exposure is an explicit opt-in command;
- hardware-proof files are treated as untrusted input and are size/schema/range validated before use;
- raw UI exceptions are not rendered to end users;
- the repository audit rejects real environment files, common credential signatures, conflict markers, and tracked generated junk;
- direct dependency versions are exact and the lockfile is required;
- CI runs npm vulnerability auditing and CodeQL;
- external GitHub Actions are pinned to immutable commit SHAs;
- production source maps are disabled;
- CSP and no-referrer metadata are present in the application shell.

There is no authentication or authorization layer because there is no multi-user backend/API boundary in the current system. If that architecture changes, server-side enforcement becomes mandatory.

See `SECURITY.md` and `docs/THREAT_MODEL.md`.

## Accessibility

Keyboard navigation includes a skip link and ARIA tab behavior with Arrow, Home, and End navigation. Toggle state is exposed semantically, the mission status bar is a live region, the causal network has a text equivalent, visible focus is enforced, and reduced-motion preferences are respected.

`npm run a11y` protects those structural guarantees. It is a regression gate, not a claim of full accessibility certification.

## System boundaries

The current build deliberately has no backend API, database, authentication service, message broker, or cloud inference dependency. Those controls are therefore not faked.

See:

- `docs/SYSTEM_BOUNDARIES.md`
- `docs/TESTING.md`
- `docs/ARCHITECTURE.md`
- `docs/OPERATIONS.md`
- `docs/REPOSITORY_STANDARD.md`
- `docs/SUPPLY_CHAIN.md`

## Flagship scenario — MONSOON ZERO

MONSOON ZERO is a deterministic 420-second CITY//01 incident using seed **271828**. Flood-like evidence near `SUBSTATION_03` propagates through dependent systems while Reality Forks compare interventions across paired futures.

Scenario manifest: `public/scenarios/monsoon-zero.json`.

## Snapdragon hardware proof gate

The repository does not fabricate accelerator metrics.

EDGE LAB requires an exact-device `chainreaction.qnn-proof.v1` profile with:

- Snapdragon device identity;
- QNN execution provider;
- 64-character model SHA-256;
- 90–100% numeric measured NPU layer coverage for the competition gate;
- finite, internally consistent P50/P95 latency;
- finite cold-load time and memory values;
- valid verification timestamp.

Untrusted proof input is schema-checked and bounded before metrics are accepted. Invalid proof data never surfaces as verified accelerator metrics.

## Configuration

No user-provided environment variables are required for normal startup. The committed `.env.example` documents that fact and shows the two CI/internal launcher flags without requiring developers to copy or edit it.

CI may use `CHAIN_REACTION_PREFLIGHT_ONLY=1` and `CHAIN_REACTION_SKIP_INSTALL=1` to verify launchers without starting a persistent dev server. Normal users do not need either variable.

## Running and shutdown

Development URL:

```text
http://127.0.0.1:5173
```

Production preview:

```bash
npm run build
npm run preview
```

Preview URL:

```text
http://127.0.0.1:4173
```

For terminal-started processes, press `Ctrl+C` to stop the foreground server. The current architecture starts no separate database, cache, broker, or backend service.

## API, database, and realtime boundaries

The current product has no backend HTTP API and no production database. Mission state is browser-process state, while scenarios and hardware-proof templates are version-controlled assets.

The mission clock and topology propagation are deterministic in-process simulation behavior. They are not remote realtime telemetry and are not presented as WebSocket/SSE data. The dependency network reflects the actual current simulation state.

## Observability

Observability is proportional to the local architecture:

- startup and verification diagnostics in the terminal;
- mission status information in the UI;
- deterministic audit entries for observed/system events;
- build-manifest and SBOM evidence;
- CI job history and CodeQL results.

There are no server liveness/readiness endpoints, request metrics, distributed traces, or correlation IDs because there is no backend service.

## Troubleshooting

| Symptom | Likely cause | Action |
| --- | --- | --- |
| Runtime validation fails | Node.js/npm is missing or unsupported | Install Node.js 22 LTS with npm 10.x |
| Lockfile error | `package-lock.json` is missing or inconsistent | Restore it from `main` |
| Dependency restore fails | Registry/network/package issue | Restore network access and rerun the same launcher |
| Port 5173 is occupied | Another process owns the strict dev port | Stop the conflicting process and retry |
| Repository audit fails | Tracked junk, conflict/debt marker, or credential-like content | Resolve the exact reported finding |
| Hardware proof is rejected | Exact-device QNN evidence is invalid/incomplete | Correct the proof; do not substitute synthetic metrics |
| Production smoke fails | Artifact is missing, mutated, or over budget | Rebuild and inspect the reported artifact |

See `docs/OPERATIONS.md` for the runbook and `docs/RELEASE.md` for rollback guidance.

## Known limitations

- CITY//01 is synthetic and is not operational municipal telemetry.
- There is no production backend, database, authentication service, broker, or persistent server state.
- The mission clock is simulated rather than remote realtime telemetry.
- Snapdragon/QNN acceleration remains unverified until exact-device proof passes the hardware gate.
- Persistent restart recovery is not implemented; browser refresh/application restart resets mission state.
- No production SLO, uptime, throughput, or user-capacity claims are made.
- Automated accessibility checks do not replace a manual assistive-technology review.
- CHAIN//REACTION is decision-support software and must not autonomously control critical infrastructure.

## Architecture decisions

The repository records non-trivial architectural choices in lightweight ADRs:

- `docs/adr/0001-main-only-trunk.md` — why the repository uses one maintained `main` branch;
- `docs/adr/0002-deterministic-core.md` — why simulation/domain logic remains deterministic and independent from React/browser APIs.

## License

**No project license has been selected yet.** The repository currently contains no `LICENSE` file, so no open-source reuse grant should be assumed.

Selecting a project license is intentionally left as an explicit repository-owner decision. Third-party dependencies remain subject to their own license terms.

## Contributor identity

The intended human contributor is **BackendArchitectX** only. Local commits should use repository-local Git identity `backendarchitectx` with the verified GitHub noreply address already associated with this repository. Run `npm run git:identity` before manual commits.

CI audits full reachable commit history for the repository-verified BackendArchitectX noreply identity, rejects `Co-authored-by` trailers, and checks the GitHub workflow actor on pushes to `main`. Existing legitimate history is not rewritten merely to manipulate contributor statistics.

## Branch model

This repository intentionally maintains **one branch only: `main`**.

- no `develop`;
- no release branches;
- no persistent feature branches;
- product features are modules under `src/features/*`;
- completed work is integrated into `main`;
- automation removes non-`main` branches.

## Safety boundary

CHAIN//REACTION does **not** autonomously control critical infrastructure.

> **Machine perception observes. Causal simulation forecasts. The Safety Kernel verifies. Humans decide.**

## Ownership

Maintained as a single-author competition project by **BackendArchitectX**.

Current application version: **0.5.0**.
