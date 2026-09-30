# Testing and Verification Strategy

Testing is organized around confidence in the actual architecture rather than vanity coverage.

## Deterministic domain tests

The Vitest suite verifies simulation behavior, Safety Kernel decisions, intervention commit eligibility, evidence normalization, Forecast Lease boundaries, exact-device hardware-proof rules, trace integrity, and metamorphic planning invariants.

Fixtures are deterministic and do not require a developer-specific database, machine state, cloud service, or external API.

### Decision-policy regression

`tests/decision.test.ts` verifies the single deterministic commit policy used by both application orchestration and the Futures UI. It covers a valid commit, expired forecast lease, Safety Kernel rejection, and a missed decision horizon so UI/application behavior cannot drift independently.

## Repository and architecture gates

`npm run doctor` validates the runtime, required repository structure, one-step startup contract, lockfile parity, core/UI separation, and production build settings.

`npm run lint` is a zero-dependency repository-quality gate. It validates architectural boundaries, exact dependency policy, immutable workflow action pins, unsafe dynamic-code restrictions, and release-script contracts.

`npm run a11y` is an automated accessibility contract gate. It prevents regression of keyboard skip navigation, tab semantics, pressed-state semantics, live status, topology text equivalents, visible focus, and reduced-motion support. It is not a substitute for human assistive-technology testing.

## Production verification

`npm run verify` performs the complete local release-quality sequence:

1. repository/environment doctor;
2. repository/layer quality gate;
3. tracked-repository hygiene and common-secret audit;
4. project rights/dependency license metadata audit;
5. accessibility contract gate;
6. deterministic automated tests, including React server-render and workspace-navigation contracts;
7. strict TypeScript production build;
8. runtime third-party license notice generation;
9. SHA-256 build manifest;
10. consecutive-build reproducibility check;
11. static production smoke, CSP, notice, and size-budget checks;
12. served-production HTTP smoke;
13. CycloneDX SBOM generation.

## Cross-platform startup verification

CI validates the repository on Linux and Windows and exercises the actual user-facing launchers.

A dedicated fresh-clone matrix starts from a checkout with no `node_modules` and invokes one launcher only:

- Linux: `./start.sh`
- Windows: `start.cmd`

The bootstrap itself must restore locked dependencies and complete the preflight. This is the automated equivalent of:

```text
git clone
→ one startup command
→ locked dependencies restored
→ preflight succeeds
```

## Manual finalist checks

Before a competition presentation, perform and record:

- keyboard-only navigation through every workspace and actionable control;
- one assistive-technology pass of navigation, system state, and the network text equivalent;
- fresh clone on the actual presentation Windows laptop;
- narrow-width/mobile viewport review;
- real Snapdragon exact-device QNN profiling if hardware is available.

Manual checks are evidence. They must not be converted into unmeasured claims.

## Frontend render contract

`tests/ui-render.test.tsx` renders the application shell through React's server renderer without a browser DOM. This catches broken imports, browser-global leakage during render, and loss of the primary mission-control structure without adding a heavyweight browser-test dependency.

Interactive accessibility behavior remains protected by the structural accessibility gate and is complemented by the documented manual finalist walkthrough.


## Workspace navigation

`tests/navigation.test.ts` protects the stable hash contract for mission workspaces. Direct hashes resolve deterministically, unrelated anchors are ignored, and the empty location resolves to the COMMAND workspace. Browser history synchronization is implemented with native History API events rather than a routing dependency.

The HTTP smoke gate confirms that all hash deep links share the same production shell because fragments are client-side only. Full interactive Back/Forward behavior remains part of the manual browser walkthrough because the repository intentionally does not add a heavyweight browser-test stack solely for this small navigation surface.


## Production security metadata

The source HTML keeps the inline-script allowance needed by Vite's development React-refresh preamble. The production build removes that allowance from `script-src`, and `npm run smoke` rejects a built `index.html` that still permits inline scripts. This validates the emitted artifact rather than weakening local developer behavior for appearance.
