# Repository Standard

CHAIN//REACTION uses a single-maintainer trunk model optimized for a competition-grade, reproducible build.

## Branch policy

- `main` is the only maintained repository branch.
- No long-lived `develop`, release, experiment, backup, or feature branches.
- Product features are isolated under `src/features/*`, not in persistent Git branches.
- Completed work is integrated into `main`.
- Repository automation removes non-`main` branches.
- CI and deployment workflows consume `main`.

## Source organization

- `src/app` — application composition and mission orchestration.
- `src/features` — user-facing vertical slices.
- `src/ui` — reusable presentation components.
- `src/shared` — pure cross-feature helpers.
- `src/core` — deterministic domain logic independent from React/browser APIs.
- `src/data` — versioned synthetic-world configuration.
- `src/edge` — pure hardware-proof validation and accelerator capability contracts.
- `scripts` — lifecycle, verification, build, and repository automation.
- `tests` — behavior, invariants, metamorphic properties, and proof-boundary tests.
- `docs` — architecture, assurance, scope, testing, security, accessibility, and operations.
- `public` — static runtime assets and scenario/proof templates.

## Reproducibility standard

- Node.js is constrained to `>=22.12 <23`.
- npm is constrained to major version `10`.
- Direct dependency versions are exact.
- `package-lock.json` is committed and required.
- Bootstrap and CI restore dependencies with `npm ci`.
- Consecutive production builds must produce identical artifact manifests.
- Dedicated fresh-clone jobs deliberately begin without project dependencies.

## Code standards

- Strict TypeScript for `src` and `tests`.
- Explicit domain types for simulation and planning contracts.
- Untrusted JSON remains `unknown` until validated.
- No dynamic code execution in runtime modules.
- No fabricated hardware metrics or operational performance claims.
- No cloud AI dependency in the critical simulation path.
- Deterministic tests for safety and counterfactual behavior.
- Browser/runtime integration must not leak into deterministic core/data/edge logic.
- `src/main.tsx` remains a thin bootstrap.
- Toggle-like UI controls expose semantic state.
- Keyboard focus remains visible.

## Contributor identity

The intended human contributor for project work is `BackendArchitectX`.

For local commits, repository-local configuration is:

```bash
git config --local user.name "backendarchitectx"
git config --local user.email "96111851+BackendArchitectX@users.noreply.github.com"
npm run git:identity
```

The email is the GitHub noreply identity already associated with BackendArchitectX commits in this repository.

The contributor-identity audit:

- verifies reachable commit author and committer email identity;
- rejects `Co-authored-by` trailers;
- checks the GitHub actor on pushes to `main`;
- does not rewrite legitimate history merely to manipulate statistics.

## Mainline quality gate

Every completed change must pass:

1. environment/runtime/folder/lockfile doctor;
2. repository/layer quality gate;
3. tracked-repository hygiene/common-secret audit;
4. dependency license metadata audit;
5. accessibility contract gate;
6. strict TypeScript validation;
7. deterministic automated tests including a React render contract;
8. production build with SHA-256 artifact manifest;
9. consecutive-build reproducibility verification;
10. static production smoke and bundle budgets;
11. served-production HTTP smoke;
12. CycloneDX SBOM generation;
13. high/critical dependency audit;
14. CodeQL JavaScript/TypeScript analysis;
15. Windows repository and launcher verification;
16. fresh-clone one-step startup on Linux and Windows;
17. contributor-identity audit.

## Workflow supply-chain standard

External GitHub Actions are pinned to immutable 40-character commit SHAs. The repository quality gate rejects floating Action tags. A separate scheduled dependency audit re-checks the locked dependency graph even when `main` has not changed. Dependency license identifiers are reviewed by `npm run license:audit`; newly introduced or missing metadata fails verification until deliberately reviewed.

## Production artifact standard

A release-quality build emits:

- `dist/build-manifest.json` with SHA-256 and byte size for production files;
- `dist/sbom.cdx.json` with a CycloneDX software bill of materials.

Verification rejects missing referenced assets, manifest hash mismatches, production source maps, and unexpected bundle-size growth.

These controls validate the software artifact only. Snapdragon NPU execution remains governed by the exact-device proof boundary.
