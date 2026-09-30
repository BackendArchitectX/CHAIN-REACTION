# CHAIN//REACTION

**Edge Causal Resilience Intelligence for Snapdragon-powered PCs**

> **Observe uncertainty. Fork the future. Preserve the critical.**

CHAIN//REACTION is a competition-grade resilience decision-support prototype for the Snapdragon AI Lab Build & Present Challenge. It combines a deterministic synthetic infrastructure world model, evidence-aware incident reasoning, robust paired counterfactual planning, an independent Safety Kernel, and a strict exact-device hardware-proof boundary for future Snapdragon NPU perception.

The current environment is **CITY//01**, a synthetic infrastructure network. It validates the software architecture, algorithms, safety behavior, reproducibility, assurance workflow, and user experience. It does **not** claim real municipal operational effectiveness.

## One-step start

### Windows — simplest

Double-click:

```text
start.cmd
```

Or run:

```powershell
.\run.ps1
```

### Any supported terminal

```bash
npm start
```

That is the complete startup flow. The bootstrap verifies the supported runtime, restores dependencies from the committed lockfile only when necessary, starts the local application, and opens it in the browser.

**Prerequisites:** Node.js >=22.12 <23 and npm 10.x.

No backend terminal, second process, Docker container, database, API key, or cloud service is required for the CITY//01 build. The default development server binds to `127.0.0.1`; LAN exposure is opt-in with `npm run dev:lan`.

## Engineering commands

```bash
npm start          # one-step bootstrap + browser launch
npm run doctor     # environment/repository contract check
npm run dev        # local-only development server
npm run dev:lan    # explicitly expose development server to LAN
npm run typecheck  # strict TypeScript validation
npm test           # deterministic assurance suite
npm run build      # typecheck + production build + SHA-256 build manifest
npm run lint       # repository/layer quality gate
npm run reproducibility # build twice and require identical artifact manifests
npm run smoke      # production asset/hash/budget smoke gate
npm run sbom       # CycloneDX software bill of materials
npm run verify     # complete local release-quality gate
npm run clean      # remove generated output/cache
npm run preview    # preview production output locally
```

Before treating a change as complete:

```bash
npm run verify
```

GitHub Actions restores the committed lockfile with npm ci, runs the same verification path, enforces the high/critical dependency-security gate, requires reproducible consecutive builds, and publishes the build manifest plus CycloneDX SBOM as short-lived assurance evidence. External Actions are pinned to immutable commit SHAs, and CodeQL performs JavaScript/TypeScript static security analysis on main.

## Production assurance

Every successful verification produces:

- `dist/build-manifest.json` with SHA-256 and byte size for every production artifact.
- `dist/sbom.cdx.json` with a CycloneDX software bill of materials.
- A production smoke check that verifies artifact hashes, local asset references, absence of source maps, and static bundle-size budgets.

See `docs/SUPPLY_CHAIN.md` for the supply-chain contract and `docs/adr/` for architectural decisions.

## Product capabilities

- **Living Causal Twin** — explicit power, telecom, healthcare, water, transport, and emergency dependencies.
- **Evidence Fabric** — confidence, freshness, trust, event time, provenance, deduplication, contradiction and lateness diagnostics.
- **Reality Forks** — synchronized intervention branches created from equivalent world state.
- **Common-randomness evaluation** — each plan is stress-tested against the same sampled uncertainties.
- **Resilience Envelope** — robustness across hundreds of plausible futures rather than one scripted future.
- **Decision Horizon** — remaining time in which an intervention can still become effective.
- **Decision Stability** — makes fragile intervention choices visible.
- **Next Best Observation** — identifies which missing measurement has the greatest information value.
- **Independent Safety Kernel** — deterministic hard constraints reject unsafe or infeasible simulated plans.
- **Forecast Lease** — stale forecasts expire after world changes or TTL expiration.
- **Proof of Prevention** — paired counterfactuals quantify how the selected intervention changes outcomes.
- **Edge Lab** — NPU status remains unverified until exact-device QNN evidence passes the hardware gate.
- **Audit & Replay** — deterministic trace fingerprints and reproducibility-capsule export.

## Architecture

```text
Camera / Sensor / Replay / Operator
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

The simulator and Safety Kernel run as deterministic CPU logic. The UI uses the browser compositor/GPU. Snapdragon NPU usage is reserved for validated on-device perception workloads and is never inferred from configuration alone.

## Repository structure

```text
CHAIN-REACTION/
├── .github/
│   ├── CODEOWNERS
│   └── workflows/
│       ├── ci.yml                 # verification + security gate
│       ├── pages.yml              # gated static deployment
│       └── single-branch.yml      # main-only repository enforcement
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DEVELOPMENT.md
│   ├── REPOSITORY_STANDARD.md
│   ├── HARDWARE_PROOF.md
│   └── ...                        # assurance, safety, threat model, accessibility
├── public/
│   ├── scenarios/                 # versioned synthetic scenario manifests
│   └── *.json                     # hardware/model proof templates
├── scripts/
│   ├── bootstrap.mjs              # one-step dependency bootstrap + startup
│   ├── doctor.mjs                 # environment/repository preflight
│   ├── quality.mjs                # repository/layer quality gate
│   └── clean.mjs                  # generated-output cleanup
├── src/
│   ├── app/
│   │   ├── App.tsx                # application composition root
│   │   ├── ErrorBoundary.tsx      # fail-safe presentation boundary
│   │   ├── types.ts               # application contracts
│   │   └── useMission.ts          # mission orchestration state
│   ├── core/                      # deterministic domain/simulation layer
│   ├── data/                      # CITY//01 domain configuration
│   ├── edge/                      # exact-device QNN proof boundary
│   ├── features/
│   │   ├── audit/
│   │   ├── chaos/
│   │   ├── command/
│   │   ├── edge/
│   │   └── futures/               # feature-isolated screens
│   ├── shared/                    # pure formatting/status helpers
│   ├── ui/                        # reusable presentation components
│   ├── main.tsx                   # minimal React bootstrap only
│   └── styles.css                 # application design system
├── tests/                         # behavior, invariants, metamorphic, hardware-proof tests
├── start.cmd                      # Windows one-click entry point
├── start.sh                       # Unix one-step entry point
├── run.ps1                        # PowerShell one-step entry point
├── package.json                   # lifecycle/toolchain contract
├── tsconfig.json                  # strict TypeScript configuration
└── vite.config.ts                 # build/development configuration
```

The dependency direction is intentional: presentation features depend on application/core contracts; deterministic core logic does not depend on React or browser UI code.

## Branch model

This competition repository maintains **one branch only: `main`**.

- no `develop` branch;
- no release branches;
- no long-lived feature branches;
- repository automation actively removes non-`main` branches;
- all maintained CI and deployment automation targets `main`.

## Flagship scenario — MONSOON ZERO

MONSOON ZERO is a deterministic 420-second CITY//01 incident using seed **271828**. Flood-like evidence near `SUBSTATION_03` propagates through dependent systems while Reality Forks compare interventions across paired futures. Chaos Lab can inject conflicting evidence, stale perception, route loss, NPU unavailability, and a second shock to test fail-safe behavior and replanning.

Scenario manifest: [`public/scenarios/monsoon-zero.json`](public/scenarios/monsoon-zero.json)

## Snapdragon hardware proof gate

The repository deliberately does not fabricate accelerator metrics. EDGE LAB only accepts `chainreaction.qnn-proof.v1` evidence after real profiling on the exact Snapdragon-powered HP target.

The proof gate requires device identity, QNN execution, model SHA-256, at least 90% measured NPU layer coverage for the competition gate, valid warm P50/P95 latency, cold-load time, memory footprint, and a verification timestamp.

The included example profile intentionally fails until replaced by measured evidence. See [`docs/HARDWARE_PROOF.md`](docs/HARDWARE_PROOF.md).

## Quality and security standard

- Node.js 22 LTS runtime contract.
- Exact top-level dependency versions.
- Strict TypeScript.
- Environment/repository doctor.
- Deterministic and metamorphic tests.
- Production build in CI.
- High/critical npm vulnerability gate.
- Localhost-only development by default.
- CODEOWNERS and security policy.
- Fail-safe UI Error Boundary.
- Explicit Observed / Assumed / Predicted truth boundary.
- No cloud AI dependency in the critical simulation path.
- No fabricated NPU or municipal-performance claims.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md), [`docs/REPOSITORY_STANDARD.md`](docs/REPOSITORY_STANDARD.md), and [`SECURITY.md`](SECURITY.md).

## Safety boundary

CHAIN//REACTION does **not** autonomously control critical infrastructure.

> **Machine perception observes. Causal simulation forecasts. The Safety Kernel verifies. Humans decide.**

## Ownership

Maintained as a single-author competition project by **BackendArchitectX**.

Current application version: **0.5.0**.
