# Threat Model

CHAIN//REACTION is a decision-support prototype, so integrity and failure transparency matter more than pretending every input is trustworthy.

| Threat / failure | Expected behavior |
| --- | --- |
| Stale camera feed | Freshness degrades trust; forecast is visibly degraded |
| Contradictory sensor | Evidence conflict is surfaced; confidence is not silently averaged away |
| Duplicate/out-of-order event | Event schema supports identity/event-time handling; production adapter must deduplicate/order safely |
| Tampered model artifact | Production model manifest requires SHA-256 verification before load |
| Unsupported NPU operator | EDGE LAB must show actual placement/fallback; no fake NPU claim |
| NPU unavailable | Explicit CPU/degraded state; causal simulation remains operational |
| Network unavailable | Core CITY//01 simulation remains functional; cloud inference is zero |
| Insufficient resources | Safety Kernel rejects the plan and emits an infeasibility reason |
| Blocked access route | Mobile-unit intervention becomes infeasible before activation |
| No feasible intervention | Correct output is `NO SAFE PLAN FOUND`, not a fabricated recommendation |
| Application restart | Production roadmap uses snapshots + append-only event journal for recovery |

## Trust boundary

The perception layer may be probabilistic. The planner may explore alternatives. The **Safety Kernel is deterministic** and has no authority to invent an intervention; it only accepts or rejects a candidate against hard constraints.
