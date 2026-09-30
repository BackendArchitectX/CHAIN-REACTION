# System Boundaries and Applicability

CHAIN//REACTION is intentionally a local-first browser application with a deterministic in-process simulation core. Production-conscious engineering here means hardening the architecture that exists, not inventing backend infrastructure merely to make the repository look larger.

## Current runtime boundary

| Area | Current status | Engineering consequence |
| --- | --- | --- |
| Browser UI | In scope | React feature views, accessibility, responsive behavior, failure containment |
| Deterministic simulation | In scope | Pure TypeScript core with repeatability and metamorphic tests |
| Safety Kernel | In scope | Independent deterministic hard-constraint evaluation |
| Scenario data | In scope | Versioned repository data under `src/data` and `public/scenarios` |
| Hardware proof | In scope as a boundary | QNN/NPU status fails closed until exact-device evidence exists |
| Local exports | In scope | Reproducibility capsule is downloaded by the user's browser |
| Backend/API server | Not present | No fake controllers, REST layer, auth middleware, or network service is introduced |
| Database/migrations | Not present | No persistence schema, migrations, backup, locking, or transaction claims |
| Redis/Kafka/broker | Not present | No unnecessary infrastructure or operational dependencies |
| Authentication/authorization | Not present | The local competition build has no identity or multi-user security boundary |
| Cloud inference | Not required | Critical simulation path remains local |
| Operational city integration | Not validated | CITY//01 remains a synthetic environment |

## Data ownership

The application does not maintain a server-side source of truth. Mission state is process-local browser state and resets with the application. Scenario definitions and proof templates are version-controlled repository assets. Exported capsules are explicit user-initiated files.

Database migrations, server-side idempotency, backup/restore, database disaster recovery, and API rate limiting are not applicable to the current architecture. If persistence or a backend is introduced later, those controls become mandatory design work rather than assumed capabilities.

## Network and realtime boundary

The default development and preview servers bind to loopback only. A fresh clone needs package-registry access for dependency installation. After dependencies are restored, CITY//01 does not require a remote API or cloud inference service to run its core scenario.

The animated mission clock is an in-process deterministic simulation clock. It is not represented as a WebSocket or SSE feed and must not be described as remote realtime telemetry. Future live-sensor integration would require an explicit transport contract for ordering, reconnect, deduplication, freshness, backpressure, and failure recovery.

## Production claim boundary

The repository demonstrates production-conscious engineering practices for the software artifact. It does not claim operational certification, measured city effectiveness, measured Snapdragon acceleration before hardware proof, or production service SLOs without deployment measurements.
