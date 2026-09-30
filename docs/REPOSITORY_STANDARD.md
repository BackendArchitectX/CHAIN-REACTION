# Repository Standard

CHAIN//REACTION uses a single-maintainer trunk model optimized for a competition-grade, reproducible build.

## Branch policy

- `main` is the only maintained repository branch.
- No long-lived `develop`, `release`, or feature branches.
- Product features are isolated in `src/features/*`, not in persistent Git branches.
- Repository automation removes non-`main` branches.
- All CI and deployment workflows consume `main`.
- A mainline change is release-ready only after the complete verification pipeline passes.

## Source organization

- `src/app` owns application composition and mission orchestration.
- `src/features` owns user-facing vertical slices.
- `src/ui` contains reusable presentation components.
- `src/shared` contains pure cross-feature helpers.
- `src/core` contains deterministic domain logic and must remain UI-, browser-, and network-independent.
- `src/data` contains versioned synthetic-world configuration.
- `src/edge` contains accelerator/runtime proof logic and fails closed when proof is incomplete.
- `scripts` contains lifecycle and repository automation only.
- `tests` verifies behavior, invariants, metamorphic properties, and proof boundaries.
- `docs` contains architecture, assurance, security, accessibility, operations, and demo evidence.
- `public` contains static runtime assets and example proof manifests.

## Reproducibility standard

- Node.js is constrained to `>=22.12 <23`.
- npm is constrained to major version `10`.
- Direct dependency versions are exact.
- `package-lock.json` is committed and required.
- Bootstrap and CI restore dependencies with `npm ci`.
- CI uses the lockfile as its cache key and performs a high/critical dependency audit.

## Code standards

- Strict TypeScript for both `src` and `tests`.
- Explicit domain types for simulation and planning contracts.
- No dynamic code execution in product/runtime modules.
- No fabricated hardware metrics.
- No cloud AI dependency in the critical path.
- Deterministic tests for safety and counterfactual behavior.
- Every hard constraint belongs to the independent Safety Kernel.
- Browser/runtime integration must not leak into deterministic core/data/edge modules.
- `src/main.tsx` remains a thin bootstrap rather than a feature container.

## Mainline quality gate

Every completed change must pass:

1. Environment, runtime, folder, and lockfile doctor.
2. Repository/layer quality gate.
3. TypeScript compile validation for source and tests.
4. Deterministic automated tests.
5. Production build with deterministic SHA-256 artifact manifest.
6. Consecutive-build reproducibility verification.
7. Production smoke validation and static bundle budgets.
8. CycloneDX SBOM generation.
9. High/critical dependency audit in CI.
10. CodeQL JavaScript/TypeScript static security analysis.

## Commit identity

The competition repository is maintained by `BackendArchitectX`. Do not add co-author trailers or automated contributor identities. Repository automation that writes to `main` must use the owner's GitHub noreply identity.

## Production artifact standard

A release-quality build must emit a SHA-256 build manifest and CycloneDX SBOM. Production verification rejects missing referenced assets, hash mismatches, source-map emission, and unexpected bundle-size growth. These controls validate software artifact integrity only; Snapdragon NPU execution remains governed by the independent exact-device hardware-proof boundary.

## Workflow supply-chain standard

External GitHub Actions are pinned to immutable 40-character commit SHAs. The repository quality gate rejects floating action tags. Human-readable comments retain the intended major release beside each pinned SHA.
