# Architecture

CHAIN//REACTION is organized as a layered, deterministic decision-support application rather than a collection of UI demos.

## Runtime layers

```text
src/
├── core/        # deterministic simulation, planning, safety, leases, integrity
├── data/        # CITY//01 domain configuration and scenario constants
├── edge/        # hardware/QNN capability and proof boundary
├── main.tsx     # application composition + presentation shell
└── styles.css   # application design system

public/
├── scenarios/   # versioned scenario manifests
└── *.json       # hardware/model proof examples only

scripts/
├── bootstrap.mjs # one-step dependency bootstrap + dev startup
├── doctor.mjs    # runtime/repository preflight checks
└── clean.mjs     # deterministic generated-output cleanup

tests/
├── engine.test.ts
├── evidence.test.ts
├── edge-proof.test.ts
├── integrity.test.ts
├── lease.test.ts
├── metamorphic.test.ts
└── safety.test.ts
```

## Dependency direction

`presentation -> core -> data`

`presentation -> edge`

`core` must not depend on browser UI code. The Safety Kernel is kept independent from intervention ranking logic. Hardware proof is kept independent from simulation truth.

## Truth boundaries

The UI and exported capsules distinguish:

- **Observed** — actual input evidence.
- **Assumed** — CITY//01 world-model parameters.
- **Predicted** — simulation output.

CITY//01 validates software behavior in a synthetic environment. It does not claim real municipal operational validation.

## Engineering principles

1. Deterministic same-seed simulation.
2. Common-randomness paired counterfactuals.
3. Explicit safety invariants.
4. Expiring forecasts and plan validity.
5. Fail-safe hardware proof: NPU is never inferred from configuration alone.
6. No cloud inference dependency.
7. Reproducible build and test lifecycle.
8. One maintained branch: `main`.
