# CHAIN//REACTION

**Edge Causal Resilience Intelligence for Snapdragon-powered PCs.**

> **Observe uncertainty. Fork the future. Preserve the critical.**

CHAIN//REACTION is a competition-grade resilience decision-support prototype for the Snapdragon AI Lab Build & Present Challenge. It combines an explicit synthetic infrastructure world model with deterministic simulation, robust counterfactual planning, evidence provenance, decision-time analysis, and a strict hardware-assurance boundary for future Snapdragon NPU perception.

The current environment is **CITY//01**, a synthetic infrastructure network. It is intentionally labelled as simulation: the repository validates architecture, algorithms, reproducibility, safety behavior, and user experience; it does **not** claim municipal operational effectiveness.

## What makes it different

- **Living Causal Twin** — explicit power, telecom, healthcare, water, transport, and emergency dependencies.
- **Evidence Fabric** — observations have confidence, freshness, trust, event time, and provenance.
- **Future Shadow / Reality Forks** — synchronized counterfactual worlds from the same snapshot.
- **Common-randomness evaluation** — every intervention is tested against the same sampled future uncertainty.
- **Resilience Envelope** — robustness is measured across hundreds of plausible futures, not one scripted path.
- **Decision Horizon** — shows how long an intervention can still become effective after lead time and safety margin.
- **Next Best Observation** — sensitivity analysis identifies which missing measurement most affects the decision.
- **Safety Kernel** — deterministic hard constraints can reject infeasible or unsafe simulated plans.
- **Forecast Lease** — stale branch results expire when materially new evidence changes the world model.
- **Recovery Debt** — short-term success does not hide a fragile post-incident state.
- **Audit & Replay** — the run exports a reproducibility capsule containing seed, evidence, plans, revisions, and traces.
- **Edge Lab** — Snapdragon claims remain `PENDING HARDWARE` until exact-device compile, execution, and layer-placement evidence exists.

## Flagship scenario — MONSOON ZERO

A 420-second deterministic CITY//01 incident:

1. flood-like evidence appears near `SUBSTATION_03`;
2. sensor and grid evidence corroborate the incident;
3. degradation propagates into telecom, water, emergency response, and hospital dependencies;
4. Reality Forks compare four intervention strategies;
5. 256 paired futures stress each strategy under shared uncertainty;
6. `ROAD_12` can block before a mobile telecom unit arrives, invalidating the prior plan;
7. the Forecast Lease expires and Live Replanning is required;
8. a second telecom-load shock can test recovery debt.

Fixed scenario seed: **271828**.

## Run

### Windows one-command

```powershell
.\run.ps1
```

### Standard

```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal.

### Verify

```bash
npm run verify
```

This performs strict TypeScript checking, deterministic/metamorphic tests, and a production build.

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

The simulation is **not** presented as an NPU workload.

## Snapdragon integration gate

The repository deliberately does not fake Snapdragon metrics. Before publishing NPU claims, the final hardware build must:

1. detect the exact Snapdragon-powered HP target;
2. export/fine-tune the chosen perception model;
3. compile and profile it for that exact target;
4. execute through a supported ONNX Runtime/QNN path;
5. verify actual per-layer accelerator placement;
6. record cold load, first inference, warm P50/P95, memory, and NPU layer coverage;
7. bind those numbers to a versioned model manifest.

See [`docs/SNAPDRAGON_INTEGRATION.md`](docs/SNAPDRAGON_INTEGRATION.md).

## Assurance

The repository treats claims as things that require evidence.

- deterministic replay → repository tests;
- common-randomness forks → shared future samples;
- unsafe/infeasible plans → deterministic constraints and tests;
- offline simulation core → no cloud AI dependency;
- NPU execution → **pending exact-device hardware proof**;
- real municipal effectiveness → **not claimed**.

See [`docs/ASSURANCE_CASE.md`](docs/ASSURANCE_CASE.md) and [`docs/SAFETY_AND_LIMITATIONS.md`](docs/SAFETY_AND_LIMITATIONS.md).

## Commands

```bash
npm run dev
npm run typecheck
npm run test
npm run verify
npm run build
npm run preview
```

## Repository structure

```text
src/
  core/         simulation, planning, assurance, deterministic RNG
  data/         CITY//01 world and intervention definitions
  edge/         hardware capability boundary
  main.tsx      premium mission-control experience
  styles.css

tests/          deterministic + metamorphic assurance tests
docs/           assurance, safety, Snapdragon integration, scenario spec
public/         hardware/model manifest template
.github/        CI + Pages workflows
```

## Safety boundary

CHAIN//REACTION does **not** autonomously control critical infrastructure. In the competition build:

> **Machine perception observes. Causal simulation forecasts. The Safety Kernel verifies. Humans decide.**

## Ownership

Maintained as a single-author competition project by **BackendArchitectX**.
