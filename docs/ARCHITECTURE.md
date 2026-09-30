# Architecture

CHAIN//REACTION is organized as a layered, deterministic decision-support application rather than a collection of UI demos.

## Source structure

```text
src/
├── app/
│   ├── App.tsx             # composition root and shell
│   ├── ErrorBoundary.tsx   # presentation failure containment
│   ├── types.ts            # application-only contracts
│   └── useMission.ts       # mission state/orchestration
├── core/                   # deterministic domain logic
├── data/                   # CITY//01 world configuration
├── edge/                   # exact-device accelerator proof boundary
├── features/
│   ├── audit/
│   ├── chaos/
│   ├── command/
│   ├── edge/
│   └── futures/            # vertical feature views
├── shared/                 # pure helpers without React state
├── ui/                     # reusable presentation components
├── main.tsx                # minimal browser bootstrap
└── styles.css              # application design system

public/
├── scenarios/              # versioned scenario manifests
└── *.json                  # model/hardware proof examples

scripts/
├── bootstrap.mjs           # one-step dependency bootstrap + startup
├── doctor.mjs              # runtime/repository preflight
└── clean.mjs               # generated-output cleanup

tests/
├── engine.test.ts
├── evidence.test.ts
├── edge-proof.test.ts
├── integrity.test.ts
├── lease.test.ts
├── metamorphic.test.ts
└── safety.test.ts
```

## Layer responsibilities

### `core`

Owns simulation semantics, robust planning, safety evaluation, Evidence Fabric normalization, Forecast Lease behavior, decision stability, runtime trust, and deterministic integrity functions. It must remain independent from React and browser presentation code.

### `data`

Owns the synthetic CITY//01 domain model, scenario constants, dependency graph, and intervention metadata. Data definitions are not UI components.

### `edge`

Owns runtime/accelerator evidence and the exact-device QNN proof contract. Hardware assurance cannot influence simulation truth and fails closed when evidence is incomplete.

### `app`

Composes application behavior and owns mission orchestration. It can depend on `core`, `data`, and `edge`; those layers do not depend back on `app`.

### `features`

Owns vertical user-facing workflows: Command, Futures, Chaos Lab, Edge Lab, and Audit. Feature views consume application contracts and reusable UI primitives rather than embedding domain algorithms.

### `ui` / `shared`

`ui` contains reusable visual components. `shared` contains pure display helpers. Neither owns infrastructure-simulation rules.

## Dependency direction

```text
main
  ↓
app
  ↓
features ─────→ ui / shared
  ↓
core ─────────→ data
  │
  └───────────→ edge (only through app/presentation integration; simulation truth remains separate)
```

The critical invariant is simpler than the diagram: **domain logic must not import React or presentation features.**

## Runtime truth boundaries

The UI and exported reproducibility capsules distinguish:

- **Observed** — actual or injected evidence.
- **Assumed** — CITY//01 world-model parameters.
- **Predicted** — simulation output.

CITY//01 validates software behavior in a synthetic environment. It does not claim real municipal operational validation.

## Failure boundaries

- The Safety Kernel is independent from intervention ranking.
- Forecasts expire when their world revision changes or TTL elapses.
- Hardware/NPU status is unverified until exact-device proof passes.
- The React Error Boundary contains unexpected presentation failures and does not silently present stale state as current.
- Cloud inference is not required by the simulation core.

## Engineering principles

1. Deterministic same-seed simulation.
2. Common-randomness paired counterfactuals.
3. Explicit, independently evaluated safety invariants.
4. Expiring forecasts and plan validity.
5. Fail-closed hardware proof.
6. Local-first operation and no cloud inference dependency.
7. One-step development startup.
8. Strict TypeScript plus deterministic/metamorphic tests.
9. Security and production build gates in CI.
10. One maintained branch: `main`.
