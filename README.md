# CHAIN//REACTION

**Edge Causal Resilience Intelligence for Snapdragon-powered PCs.**

> **Observe uncertainty. Fork the future. Preserve the critical.**

CHAIN//REACTION is a competition-grade resilience decision-support prototype for the Snapdragon AI Lab Build & Present Challenge. It combines an explicit synthetic infrastructure world model with deterministic simulation, robust counterfactual planning, evidence provenance, decision-time analysis, and a strict hardware-assurance boundary for Snapdragon NPU perception.

The current environment is **CITY//01**, a synthetic infrastructure network. It is intentionally labelled as simulation: the repository validates architecture, algorithms, reproducibility, safety behavior, and user experience; it does **not** claim municipal operational effectiveness.

## What makes it different

- **Living Causal Twin** — explicit power, telecom, healthcare, water, transport, and emergency dependencies.
- **Evidence Fabric** — observations have confidence, freshness, trust, event time, and provenance.
- **Evidence normalization** — equivalent observations are deduplicated so duplicate delivery cannot amplify confidence.
- **Future Shadow / Reality Forks** — synchronized counterfactual worlds from the same snapshot.
- **Common-randomness evaluation** — every intervention is tested against the same sampled future uncertainty.
- **Resilience Envelope** — robustness is measured across hundreds of plausible futures, not one scripted path.
- **Decision Horizon** — shows how long an intervention can still become effective after lead time and safety margin.
- **Decision Stability** — surfaces fragile choices whose feasibility changes under small parameter shifts.
- **Next Best Observation + Information Value** — identifies which missing measurement is most likely to improve the decision.
- **Independent Safety Kernel** — deterministic hard constraints can reject infeasible or unsafe simulated plans.
- **Forecast Lease** — stale branch results expire after world revision changes or a time-to-live window.
- **Recovery Debt** — short-term success does not hide a fragile post-incident state.
- **Audit & Replay** — exports a reproducibility capsule containing seed, evidence, plans, revisions, traces, and a stable trace fingerprint.
- **Edge Lab** — Snapdragon claims remain `PENDING HARDWARE` until an exact-device QNN proof profile passes the in-app capability gate.

## Flagship scenario — MONSOON ZERO

A 420-second deterministic CITY//01 incident:

1. flood-like evidence appears near `SUBSTATION_03`;
2. sensor and grid evidence corroborate the incident;
3. degradation propagates into telecom, water, emergency response, and hospital dependencies;
4. Reality Forks compare four intervention strategies;
5. 256 paired futures stress each strategy under shared uncertainty;
6. Decision Stability quantifies how fragile the selected plan is;
7. `ROAD_12` can become blocked before a mobile telecom unit arrives, invalidating the prior world assumption;
8. the Forecast Lease expires and Live Replanning is required;
9. a second telecom-load shock can test recovery debt;
10. contradictory and stale evidence can be injected live, while duplicate, late, and skewed telemetry are exercised through assurance tests.

Fixed scenario seed: **271828**.

A versioned scenario manifest is available at [`public/scenarios/monsoon-zero.json`](public/scenarios/monsoon-zero.json).

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

### Verify

```bash
npm run verify
```

This performs strict TypeScript checking, deterministic/metamorphic assurance tests, and a production build.

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

## Snapdragon hardware proof gate

The repository deliberately does not fabricate Snapdragon metrics. EDGE LAB can load a `chainreaction.qnn-proof.v1` profile only after real exact-device work has been completed.

The gate requires:

1. exact Snapdragon-powered HP device identity;
2. QNN execution provider;
3. model artifact plus SHA-256;
4. at least 90% measured NPU layer coverage for the competition gate;
5. valid warm P50/P95 latency;
6. cold-load time and memory footprint;
7. verification timestamp.

The included [`public/qnn-profile.example.json`](public/qnn-profile.example.json) intentionally contains placeholder/zero values and therefore **fails** the proof gate.

See [`docs/HARDWARE_PROOF.md`](docs/HARDWARE_PROOF.md).

## Assurance

The repository treats claims as things that require evidence.

- deterministic replay → repository tests;
- common-randomness forks → shared future samples;
- unsafe/infeasible plans → deterministic Safety Kernel and tests;
- duplicate evidence handling → Evidence Fabric normalization tests;
- forecast freshness → revision + TTL Forecast Lease tests;
- reproducibility → stable trace fingerprint tests;
- offline simulation core → no cloud AI dependency;
- NPU execution → **pending exact-device hardware proof**;
- real municipal effectiveness → **not claimed**.

See [`docs/ASSURANCE_CASE.md`](docs/ASSURANCE_CASE.md), [`docs/SAFETY_AND_LIMITATIONS.md`](docs/SAFETY_AND_LIMITATIONS.md), and [`docs/V03_ASSURANCE_UPGRADE.md`](docs/V03_ASSURANCE_UPGRADE.md).

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
  core/         simulation, planning, evidence, leases, decision stability, assurance, integrity
  data/         CITY//01 world and intervention definitions
  edge/         exact-device QNN capability proof validator
  main.tsx      premium mission-control experience
  styles.css

tests/          deterministic, metamorphic, evidence, lease, integrity, and hardware-proof tests
docs/           assurance, safety, threat model, Snapdragon integration, judging script
public/         versioned scenario and QNN proof template
.github/        CI + gated Pages workflows
```

## Safety boundary

CHAIN//REACTION does **not** autonomously control critical infrastructure. In the competition build:

> **Machine perception observes. Causal simulation forecasts. The Safety Kernel verifies. Humans decide.**

## Truth boundary

The interface distinguishes three categories:

- **Observed** — measured or injected evidence;
- **Assumed** — parameters defined by CITY//01;
- **Predicted** — simulation output.

Live camera classification must never be presented as proof that simulated municipal consequences are real-world validated.

## Ownership

Maintained as a single-author competition project by **BackendArchitectX**.

Version: **0.3.0**.
