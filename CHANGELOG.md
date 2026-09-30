# Changelog

All notable repository-level changes are documented here.

## 0.5.0 — Reproducible mainline and premium repository hardening

- Committed deterministic npm lockfile and standardized locked installs with `npm ci`.
- Added a zero-dependency repository quality gate for layer boundaries, exact dependency policy, unsafe dynamic execution, and manifest/lock parity.
- Extended strict TypeScript validation to test sources and added switch fallthrough protection.
- Made development and preview ports explicit and strict to avoid silent port drift.
- Added `.gitattributes` and hardened npm repository policy.
- Hardened CI with lockfile caching, explicit Ubuntu runner, timeouts, concurrency, and the complete verification pipeline.
- Hardened main-only branch pruning with robust branch-name URL encoding.
- Added an operations runbook covering startup, failure modes, recovery, verification, and network posture.
- Clarified that feature isolation lives under `src/features/*` while Git remains single-branch on `main`.
- Added production artifact integrity with SHA-256 build manifests and a hash-verifying smoke gate.
- Added CycloneDX SBOM generation and CI assurance-artifact publication.
- Added static bundle budgets and disabled production source maps.
- Added hardened HTML metadata including CSP and no-referrer policy.
- Added Architecture Decision Records for main-only trunk development and deterministic core boundaries.
- Pinned every external GitHub Action to an immutable commit SHA.
- Added CodeQL JavaScript/TypeScript static analysis on main plus weekly scheduled scanning.
- Added a consecutive-build reproducibility gate for production artifact manifests.
- Hardened one-step bootstrap with a top-level npm dependency-tree health check before reusing node_modules.

## 0.4.0 — Industry lifecycle and architecture hardening

- Added one-step cross-platform bootstrap with automatic browser launch.
- Added Windows `start.cmd`, PowerShell `run.ps1`, and Unix `start.sh` entry points.
- Added runtime/repository doctor and deterministic clean commands.
- Tightened the supported runtime to Node.js `>=22.12 <23` and npm 10+ to match the actual Vite/Vitest toolchain.
- Pinned direct dependency versions and upgraded the test runner to a zero-known-vulnerability set in the validated CI install.
- Refactored the monolithic application entry into `app`, `features`, `shared`, and reusable `ui` layers while preserving a UI-independent deterministic `core`.
- Added a React fail-safe Error Boundary so unexpected presentation failure does not silently render stale state as current.
- Extended the project doctor to enforce architecture boundaries, required feature folders, thin bootstrap, local-only development binding, and absence of React imports from `src/core`.
- Added EditorConfig, npm policy, expanded ignore policy, CODEOWNERS, security policy, architecture/development/repository standards documentation.
- Made local-only binding the default; LAN exposure is explicit.
- Removed the legacy root standalone demo to reduce repository duplication.
- Standardized and automatically enforces `main` as the only maintained repository branch, including branch-creation cleanup.

## 0.3.0 — Assurance architecture

- Added Forecast Lease TTL semantics.
- Added Decision Stability, Information Value, Evidence normalization and trust decomposition.
- Hardened exact-device QNN proof validation.
- Added deterministic Safety Kernel and expanded assurance test coverage.

## 0.2.0 — Competition-grade simulation

- Added deterministic CITY//01 simulation, Reality Forks, Resilience Envelope, Evidence Fabric and MONSOON ZERO.

## 0.1.0 — Premium MVP

- Initial React/TypeScript mission-control experience.
