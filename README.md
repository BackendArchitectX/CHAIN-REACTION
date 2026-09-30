# CHAIN//REACTION

**Edge Causal Resilience Intelligence for Snapdragon-powered PCs.**

CHAIN//REACTION is a premium competition MVP for the Snapdragon AI Lab Build & Present Challenge. It models a synthetic critical-infrastructure environment (CITY//01), visualizes cascading failure risk, compares counterfactual intervention branches, and keeps an explicit boundary between observed evidence, assumptions, and predictions.

> **What may fail next? How long is intervention still possible? Which plan remains viable when assumptions change?**

## Experience

The current MVP includes:

- **Living Causal Twin** — power, telecom, healthcare, water, transport, and emergency-service topology
- **Evidence Fabric** — structured evidence with confidence, freshness, and trust
- **Cascade Window** — estimated interval in which downstream service risk emerges
- **Decision Horizon** — remaining time for a simulated intervention to become effective
- **Forecast Lease** — makes stale predictions visibly expire
- **Reality Forks** — synchronized intervention alternatives with robustness and recovery debt
- **Safety Kernel surface** — deterministic pass/reject boundary for simulated plans
- **Plan invalidation** — new road-block evidence invalidates prior assumptions
- **Chaos Lab** — failure-injection and robustness coverage
- **Edge Lab** — Snapdragon deployment contract without pretending NPU execution is already proven
- **Audit** — Observed / Assumed / Predicted trace vocabulary

## Run immediately

Open `demo.html` directly in a modern browser. It is a standalone zero-install build intended for judging and fallback demos.

## Run the React/TypeScript project

```powershell
npm install
npm run dev
```

Or on Windows:

```powershell
.\run.ps1
```

Production build:

```powershell
npm run build
```

## MONSOON ZERO

The flagship scenario begins with a nominal CITY//01 world, confirms flood evidence near `SUBSTATION_03`, propagates downstream telecom and hospital risk, compares intervention branches, and then injects a `ROAD_12` blockage that invalidates a previously viable plan.

The scenario is deliberately synthetic. It validates the product architecture, simulation interaction, audit vocabulary, and decision-support UX; it does **not** claim operational validation on real municipal infrastructure.

## Snapdragon integration boundary

The MVP intentionally does **not** display fake Snapdragon NPU metrics. The production challenge build should:

1. Export the selected perception model to ONNX.
2. Compile/profile the model for the exact Snapdragon-powered HP target using Qualcomm tooling.
3. Execute through ONNX Runtime + QNN where supported.
4. Verify actual per-layer accelerator placement rather than assuming QNN implies NPU execution.
5. Replace Edge Lab placeholders only with measured results from the target device.

## Architecture direction

```text
Input / Evidence
      |
      v
Evidence Fabric
      |
      v
Living Causal Twin
      |
      v
Future / Counterfactual Simulation
      |
      v
Safety Kernel
      |
      v
Human Decision
```

Edge inference is intended for the Snapdragon NPU; causal simulation and safety logic remain deterministic CPU workloads, while the GPU renders the interactive topology.

## Repository principles

- no paid cloud AI API dependency
- no autonomous real-world infrastructure actuation
- no fabricated benchmark numbers
- no hidden co-author attribution
- deterministic/synthetic demonstration boundary is explicit

## Project ownership

Maintained as a single-author competition project by **BackendArchitectX**.
