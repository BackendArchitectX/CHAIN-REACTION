# Testing and Verification Strategy

Testing is organized around confidence in the actual architecture rather than vanity coverage.

## Deterministic domain tests

The Vitest suite verifies simulation behavior, Safety Kernel decisions, evidence normalization, Forecast Lease boundaries, exact-device hardware-proof rules, trace integrity, and metamorphic planning invariants.

Fixtures are deterministic and do not require a developer-specific database, machine state, cloud service, or external API.

## Repository and architecture gates

`npm run doctor` validates the runtime, required repository structure, one-step startup contract, lockfile parity, core/UI separation, and production build settings.

`npm run lint` is a zero-dependency repository-quality gate. It validates architectural boundaries, exact dependency policy, immutable workflow action pins, unsafe dynamic-code restrictions, and release-script contracts.

`npm run a11y` is an automated accessibility contract gate. It prevents regression of keyboard skip navigation, tab semantics, pressed-state semantics, live status, topology text equivalents, visible focus, and reduced-motion support. It is not a substitute for human assistive-technology testing.

## Production verification

`npm run verify` performs the complete local release-quality sequence:

1. repository/environment doctor;
2. repository/layer quality gate;
3. accessibility contract gate;
4. deterministic automated tests;
5. strict TypeScript production build;
6. SHA-256 build manifest;
7. consecutive-build reproducibility check;
8. static production smoke and size budgets;
9. served-production HTTP smoke;
10. CycloneDX SBOM generation.

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
