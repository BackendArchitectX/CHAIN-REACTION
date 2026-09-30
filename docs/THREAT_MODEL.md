# Threat Model

CHAIN//REACTION is a local-first decision-support application. Integrity, input validation, failure transparency, and truthful hardware claims matter more than pretending every system boundary exists.

| Threat / failure | Current expected behavior |
| --- | --- |
| Stale camera feed | Freshness degrades trust; forecast state is visibly degraded |
| Contradictory sensor | Evidence conflict is surfaced; confidence is not silently averaged away |
| Duplicate/out-of-order event | Synthetic event/evidence handling preserves identity/event-time semantics; no remote ingestion adapter is currently shipped |
| Tampered model artifact | Hardware proof requires a model SHA-256 and fails closed when proof data is invalid |
| Unsupported/unverified NPU execution | EDGE LAB remains unverified; no accelerator metric is surfaced as verified |
| NPU unavailable | Explicit CPU/degraded state; deterministic causal simulation remains operational |
| Network unavailable | Core CITY//01 simulation remains functional after local dependencies are installed; cloud inference is zero |
| Oversized hardware-proof upload | File is rejected before JSON parsing once it exceeds the configured 1 MB boundary |
| Malformed hardware-proof JSON | Input is rejected and NPU verification remains false |
| Insufficient resources | Safety Kernel rejects the simulated plan and emits an infeasibility reason |
| Blocked access route | Mobile-unit intervention becomes infeasible before activation |
| No feasible intervention | Correct output is `NO SAFE PLAN FOUND`, not a fabricated recommendation |
| Browser refresh / application restart | Current in-process mission state resets to the deterministic initial state; persistent recovery journal is **not implemented** |
| Dependency compromise | Exact versions, lockfile installs, dependency audit, CodeQL, SBOM generation, and immutable Action pins reduce supply-chain risk |
| Secret accidentally tracked | Repository audit checks common credential/key signatures and real environment files before release verification passes |
| LAN exposure | Default binding is loopback-only; LAN exposure requires the explicit `npm run dev:lan` command |

## Trust boundaries

The perception/evidence layer may be incomplete or contradictory. The planner may explore alternatives. The **Safety Kernel is deterministic** and has no authority to invent an intervention; it only accepts or rejects a candidate against hard constraints.

The browser file boundary is untrusted. Hardware-proof JSON remains `unknown` until schema, size, digest, timestamp, and numeric-bound validation succeeds.

The repository/CI boundary is also treated as untrusted: dependencies are lockfile-driven, external Actions are commit-SHA pinned, and release verification checks repository hygiene before a build is treated as acceptable.

## Out of scope in the current architecture

The application has no backend API, production database, authentication system, message broker, or remote realtime transport. Threats that depend on those absent components (for example SQL injection, IDOR, CSRF against authenticated mutations, broker poison messages, or server-side request forgery) become applicable only if those boundaries are introduced later.

This document must evolve if the runtime architecture changes.
