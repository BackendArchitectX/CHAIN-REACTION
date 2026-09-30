# Changelog

All notable repository-level changes are documented here.

## 0.5.0 — Reproducible mainline and premium repository hardening

- Tightened the hardware evidence claim boundary: imported QNN profiles can be accepted for structural review and can expose reported metrics, but the browser no longer labels self-supplied evidence as independently verified hardware execution.
- Replaced unsupported assurance statuses with explicit NOT IMPLEMENTED / NOT CLAIMED states for native packaging and municipal effectiveness.
- Hardened light-theme small-text contrast and added executable 4.5:1 palette contrast checks to the accessibility gate.
- Replaced ambiguous "live run" and synthetic "edge pulse" wording with explicit simulation-state labels so the UI does not imply remote realtime telemetry or unmeasured health.
- Preserved staged composite-plan activation: grid rerouting can take effect before a later mobile deployment, while resource accounting records only the components that actually activate.
- Plan resource requirements are now enforced generically, resource costs are applied only when an intervention actually activates, and checkpoint/final resource state stays consistent.
- Added regression coverage for resource shortfalls, blocked pre-activation mobile deployment, and activation-time resource accounting.
- Hardened the browser-global architecture gate so it detects executable global references without falsely rejecting ordinary domain text that happens to contain words such as "window".
- Centralized intervention commit eligibility in the deterministic decision domain so stale forecasts, Safety Kernel rejections, and missed intervention windows cannot drift between UI and application logic.
- Added deterministic tests for commit eligibility and exposed blocked-action reasons through an accessible status message.
- Switched the application to a premium light mission-control theme with high-contrast surfaces, state-aware accents, and matching browser theme metadata.
- Replaced raw UI error-message rendering with generic safe recovery copy while retaining developer diagnostics in the console.
- Prevented intervention commits after a missed decision horizon and exposed an explicit disabled-state reason.
- Removed the unsupported replay claim from the UI and docs; the implemented capability is audit trace inspection plus reproducibility-capsule export.
- Added actionable startup failure diagnostics with explicit corrective actions and Windows error visibility.
- Added a safe `.env.example` that documents the intentionally empty runtime configuration surface.
- Corrected restart/recovery documentation to state that persistent mission recovery is not implemented.
- Added proportional static-release and rollback guidance without introducing release branches or unnecessary deployment machinery.
- Added a tracked-repository audit for generated junk, real environment files, conflict markers, unresolved source debt markers, private-key material, and common credential/token signatures.
- Added a React server-render smoke test to catch broken imports and render-time browser-global leakage without adding a heavyweight UI-test dependency.
- Added a contributor-identity audit that verifies the repository's BackendArchitectX GitHub noreply identity, rejects co-author trailers, and checks the push actor on main.
- Added a local `npm run git:identity` pre-commit identity check for `backendarchitectx`.
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
- Added Windows CI contract verification for the complete repository plus `start.cmd` and `run.ps1`.
- Added CI verification of the executable Unix `start.sh` one-step launcher.
- Added HTTP runtime smoke testing that boots the production preview and requests every declared build artifact.
- Added a scheduled dependency-security audit so newly disclosed high/critical vulnerabilities are detected without requiring a new commit.

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
