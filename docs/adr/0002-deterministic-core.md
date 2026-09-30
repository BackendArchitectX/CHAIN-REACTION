# ADR 0002 — Deterministic core with explicit edge boundaries

**Status:** Accepted

## Context

CHAIN//REACTION combines simulation, counterfactual planning, UI state, and a future Snapdragon inference boundary. Mixing browser or hardware concerns into domain logic would reduce reproducibility and testability.

## Decision

- `src/core` owns deterministic simulation, safety, evidence, planning, leases, integrity, and decision logic.
- `src/data` owns versioned synthetic-world inputs.
- `src/edge` owns hardware-proof and accelerator capability boundaries.
- `src/app` orchestrates product state.
- `src/features` and `src/ui` render the product.
- Deterministic layers may not import React, browser globals, or network APIs.

## Consequences

The simulation can be verified independently from the presentation layer. Hardware proof fails closed until exact-device evidence exists, while UI changes cannot silently redefine simulation semantics.
