# CHAIN//REACTION

**Edge Causal Resilience Intelligence for Snapdragon-powered PCs.**

> **Observe uncertainty. Fork the future. Preserve the critical.**

CHAIN//REACTION is a competition-grade resilience decision-support prototype for the Snapdragon AI Lab Build & Present Challenge. It combines an explicit synthetic infrastructure world model with deterministic simulation, robust counterfactual planning, evidence provenance, decision-time analysis, an independent Safety Kernel, and a strict hardware-assurance boundary for Snapdragon NPU perception.

The current environment is **CITY//01**, a synthetic infrastructure network. The repository validates software architecture, algorithms, reproducibility, safety behavior, and user experience. It does **not** claim municipal operational effectiveness.

## One-step start

### Windows — easiest

Double-click:

```text
start.cmd
```

or run:

```powershell
.\run.ps1
```

### Any supported terminal

```bash
npm start
```

That is the complete startup flow. The bootstrap:

1. verifies Node.js 22 LTS and npm;
2. checks whether project dependencies are already current;
3. installs them only when required;
4. starts the local-only Vite server;
5. opens CHAIN//REACTION automatically in the browser.

No backend terminal, second process, Docker container, database, API key, or cloud service is required for the current CITY//01 build.

> Default development binding is `127.0.0.1`. LAN exposure is opt-in via `npm run dev:lan`.

## Prerequisites

- Node.js **22 LTS**
- npm **10+**

Run the environment check independently with:

```bash
npm run doctor
```

## What makes it different

- **Living Causal Twin** — explicit power, telecom, healthcare, water, transport, and emergency dependencies.
- **Evidence Fabric** — observations have confidence, freshness, trust, event time, and provenance.
- **Evidence normalization** — equivalent observations are deduplicated so duplicate delivery cannot amplify confidence.
- **Future Shadow / Reality Forks** — synchronized counterfactual worlds from the same snapshot.
- **Common-randomness evaluation** — every intervention is tested against the same sampled future uncertainty.
- **Resilience Envelope** — robustness is measured across hundreds of plausible futures rather than one scripted path.
- **Decision Horizon** — shows how long an intervention can still become effective after lead time and safety margin.
- **Decision Stability** — surfaces fragile choices whose feasibility changes under small parameter shifts.
- **Next Best Observation + Information Value** — identifies which missing measurement is most likely to improve the decision.
- **Independent Safety Kernel** — deterministic hard constraints reject infeasible or unsafe simulated plans.
- **Forecast Lease** — stale branch results expire after world revision changes or a time-to-live window.
- **Recovery Debt** — short-term success does not hide a fragile post-incident state.
- **Audit & Replay** — exports a reproducibility capsule containing seed, evidence, plans, revisions, traces, and a stable trace fingerprint.
- **Edge Lab** — Snapdragon claims remain `PENDING HARDWARE` until an exact-device QNN proof profile passes the capability gate.

## Flagship scenario — MONSOON ZERO

A 420-second deterministic CITY//01 incident:

1. flood-like evidence appears near `SUBSTATION_03`;
2. sensor and grid evidence corroborate the incident;
3. degradation propagates into telecom, water, emergency response, and hospital dependencies;
4. Reality Forks compare four intervention strategies;
5. 256 paired futures stress each strategy under shared uncertainty;
6. Decision Stability quantifies how fragile the selected plan is;
7. `ROAD_12` can become blocked before a mobile telecom unit arrives;
8. the Forecast Lease expires and Live Replanning is required;
9. a second telecom-load shock tests recovery debt;
10. contradictory, duplicate, late, stale, and skewed evidence is covered by assurance logic/tests.

Fixed scenario seed: **271828**.

Scenario manifest: [`public/scenarios/monsoon-zero.json`](public/scenarios/monsoon-zero.json)

## Standard engineering commands

```bash
npm start          # one-step bootstrap + browser launch
npm run doctor     # environment/repository contract check
npm run dev        # local-only development server
npm run dev:lan    # explicitly expose dev server to LAN
npm run typecheck  # strict TypeScript validation
npm test           # deterministic assurance suite
npm run build      # production build
npm run verify     # doctor + typecheck + tests + build
npm run clean      # generated output/cache cleanup
npm run preview    # preview production output
```

Before treating a change as complete:

```bash
npm run verify
```

GitHub Actions runs the same verification path plus a high/critical dependency-security gate.

## Architecture

```text
Camera / Sensor / Replay / Operator
                |
                v
         Evidence Fabric
                |
                v
       Living Causal Twin
                |
      +---------+----------+
      |                    |
      v                    v
 Twin Consistency     Assumption Model
      |                    |
      +---------+----------+
                v
          Future Compiler
                |
                v
        Resilience Envelope
                |
      +---------+----------+
      |                    |
      v                    v
 Reality Forks       Decision Horizon
      |                    |
      +---------+----------+
                v
             Planner
                |
                v
         Safety Kernel
                |
                v
              Human
```

### Heterogeneous compute intent

- **Snapdragon NPU:** perception/classification/detection after exact-device validation.
- **CPU:** Evidence Fabric, world model, uncertainty sampling, counterfactual simulation, Safety Kernel, audit.
- **GPU/compositor:** topology and future visualization.

The causal simulator is intentionally **not** presented as an NPU workload.

## Repository structure

```text
CHAIN-REACTION/
├── .github/
│   └── workflows/       CI and gated deployment automation
├── docs/                architecture, assurance, security, accessibility, runbooks
├── public/
│   ├── scenarios/       versioned synthetic scenario manifests
│   └── *.json           model/QNN proof templates
├── scripts/
│   ├── bootstrap.mjs    one-step dependency bootstrap and startup
│   ├── doctor.mjs       environment/repository diagnostics
│   └── clean.mjs        generated-output cleanup
├── src/
│   ├── core/            deterministic simulation, planning, safety, leases, integrity
│   ├── data/            CITY//01 domain configuration
│   ├── edge/            exact-device QNN capability/proof boundary
│   ├── main.tsx         application composition and mission-control UI
│   └── styles.css       application design system
├── tests/               behavior, invariants, metamorphic and hardware-proof tests
├── index.html           Vite application shell
├── start.cmd            Windows one-click entry point
├── start.sh             Unix one-step entry point
├── run.ps1              PowerShell one-step entry point
├── package.json         project lifecycle contract
├── tsconfig.json        strict TypeScript configuration
└── vite.config.ts       build/dev configuration
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md), and [`docs/REPOSITORY_STANDARD.md`](docs/REPOSITORY_STANDARD.md).

## Branch model

This competition repository intentionally maintains **one branch only: `main`**. No `develop`, `release`, or long-lived feature branches are part of the repository standard.

## Snapdragon hardware proof gate

The repository deliberately does not fabricate Snapdragon metrics. EDGE LAB can load a `chainreaction.qnn-proof.v1` profile only after real exact-device work has been completed.

The gate requires:

1. exact Snapdragon-powered HP device identity;
2. QNN execution provider;
3. model artifact plus a real 64-character SHA-256 digest;
4. at least 90% measured NPU layer coverage for the competition gate;
5. valid warm P50/P95 latency;
6. cold-load time and memory footprint;
7. verification timestamp.

The included [`public/qnn-profile.example.json`](public/qnn-profile.example.json) intentionally fails this gate until replaced by measured exact-device evidence.

See [`docs/HARDWARE_PROOF.md`](docs/HARDWARE_PROOF.md).

## Assurance

- deterministic replay → automated tests;
- common-randomness forks → shared future samples;
- unsafe/infeasible plans → independent deterministic Safety Kernel;
- duplicate evidence handling → Evidence Fabric normalization tests;
- forecast freshness → revision + TTL Forecast Lease tests;
- reproducibility → stable trace fingerprint tests;
- offline simulation core → no cloud AI dependency;
- NPU execution → **pending exact-device hardware proof**;
- real municipal effectiveness → **not claimed**.

See [`docs/ASSURANCE_CASE.md`](docs/ASSURANCE_CASE.md), [`docs/SAFETY_AND_LIMITATIONS.md`](docs/SAFETY_AND_LIMITATIONS.md), and [`docs/V03_ASSURANCE_UPGRADE.md`](docs/V03_ASSURANCE_UPGRADE.md).

## Safety boundary

CHAIN//REACTION does **not** autonomously control critical infrastructure.

> **Machine perception observes. Causal simulation forecasts. The Safety Kernel verifies. Humans decide.**

## Truth boundary

The interface distinguishes:

- **Observed** — measured or injected evidence;
- **Assumed** — parameters defined by CITY//01;
- **Predicted** — simulation output.

Live perception must never be presented as proof that simulated municipal consequences are real-world validated.

## Ownership

Maintained as a single-author competition project by **BackendArchitectX**.

Version: **0.4.0**.
