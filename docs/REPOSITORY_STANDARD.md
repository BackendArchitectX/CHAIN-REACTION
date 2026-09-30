# Repository Standard

This repository follows a single-maintainer trunk model for the competition build.

## Branch policy

- `main` is the only maintained branch.
- No long-lived `develop`, `release`, or feature branches.
- All repository automation targets `main`.
- CI must be green before a commit is treated as release-ready.

## Source organization

- `src/core` contains deterministic domain logic and must remain UI-independent.
- `src/data` contains versioned synthetic-world configuration.
- `src/edge` contains accelerator/runtime proof logic and must fail closed when proof is incomplete.
- `scripts` contains development lifecycle automation only.
- `tests` mirrors critical behavior rather than visual implementation details.
- `docs` contains architecture, assurance, security, accessibility, operations, and demo evidence.
- `public` contains static runtime assets and example proof manifests.

## Code standards

- Strict TypeScript.
- Explicit domain types for simulation and planning contracts.
- No fabricated hardware metrics.
- No cloud AI dependency in the critical path.
- Deterministic tests for safety and counterfactual behavior.
- Every hard constraint belongs to the independent Safety Kernel.
- Browser/runtime integration must not leak into core simulation modules.

## Change quality gate

Every mainline change must pass:

1. Environment/repository doctor.
2. TypeScript compile validation.
3. Automated test suite.
4. Production build.
5. High/critical dependency audit gate.

## Commit identity

The competition repository is maintained by `BackendArchitectX`. Do not add co-author trailers or automated contributor identities.
