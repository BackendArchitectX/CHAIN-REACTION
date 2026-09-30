# Safety and Limitations

CHAIN//REACTION is a decision-support and resilience-simulation prototype.

## Safety boundaries

- It does not autonomously actuate critical infrastructure.
- The competition build uses CITY//01, a synthetic infrastructure model.
- The deterministic Safety Kernel can reject candidate plans but does not constitute regulatory or safety certification.
- If evidence is contradictory or stale, the system degrades trust rather than manufacturing certainty.
- If no candidate satisfies the safety envelope, the correct output is `NO SAFE PLAN FOUND`.

## Validation boundary

CITY//01 can validate simulation semantics, reproducibility, counterfactual methodology, edge inference plumbing, auditability, and human-factors design. It does **not** establish operational effectiveness on real municipal infrastructure.

## Model boundary

A perception model must support an `UNKNOWN`/abstention path or an equivalent confidence/OOD gate before use in high-impact scenarios.
