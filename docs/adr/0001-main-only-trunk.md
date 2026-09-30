# ADR 0001 — Main-only trunk development

**Status:** Accepted

## Context

The competition repository is maintained by one owner and the user requires exactly one repository branch.

Long-lived feature, develop, and release branches would add synchronization overhead and conflict with the explicit repository policy.

## Decision

- `main` is the only repository branch.
- Product features are isolated structurally under `src/features/*`.
- Completed changes are integrated directly into `main`.
- CI validates every mainline push.
- Repository automation removes non-`main` branches.

## Consequences

This keeps history and contributor attribution simple while preserving modular feature boundaries in the codebase. The model is intentionally scoped to the single-maintainer competition build and is not presented as a universal branching recommendation.
