# Security Policy

CHAIN//REACTION is a competition-focused decision-support build and must not be treated as certified operational critical-infrastructure software.

## Reporting

Please report security findings privately to the repository owner rather than publishing exploit details in a public issue while the challenge build is active.

## Current security boundaries

- The application has no backend API, authentication service, production database, broker, or cloud inference dependency.
- Development and production preview bind to `127.0.0.1` by default.
- LAN exposure requires the explicit `npm run dev:lan` command.
- Hardware/NPU claims fail closed until exact-device evidence passes validation.
- Hardware-proof JSON is treated as untrusted input and is size, schema, digest, timestamp, and numeric-bound validated before metrics are surfaced.
- Hard safety constraints are evaluated by the independent deterministic Safety Kernel.
- Intervention commitment also requires a current forecast lease and a non-missed decision horizon.
- Unexpected UI errors enter a safe recovery screen instead of presenting stale simulation output as current.
- Production source maps are disabled.
- The HTML shell applies CSP and a no-referrer policy.
- Secrets, credentials, production telemetry, and employer-confidential data must not be committed.

## Repository and dependency controls

CI and repository tooling provide:

- exact direct dependency versions and a committed npm lockfile;
- `npm ci` for deterministic dependency restoration;
- high/critical npm vulnerability blocking;
- CodeQL JavaScript/TypeScript scanning;
- CycloneDX SBOM generation;
- immutable commit-SHA pinning for external GitHub Actions;
- repository scanning for real environment files, common credential signatures, merge-conflict markers, and generated junk;
- a scheduled dependency-security audit.

## Threat-model scope

Threats that depend on an absent server boundary—such as SQL injection, IDOR, authenticated CSRF, server-side request forgery, database privilege escalation, or message-broker poisoning—are not represented as implemented defenses. They become mandatory if a backend, persistence layer, identity boundary, or external integration is introduced.

See `docs/THREAT_MODEL.md` for the architecture-specific threat model.
