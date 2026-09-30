# Security Policy

CHAIN//REACTION is a competition prototype and must not be treated as certified operational critical-infrastructure software.

## Reporting

Please report security findings privately to the repository owner rather than publishing exploit details in a public issue while the challenge build is active.

## Security boundaries

- No cloud AI dependency is required for the CITY//01 simulation core.
- Hardware/NPU claims fail closed until exact-device evidence is supplied.
- Hard safety constraints are evaluated by the independent Safety Kernel.
- Model proof artifacts require a SHA-256 identity and explicit QNN runtime evidence.
- Local development binds to `127.0.0.1` by default.
- Secrets, credentials, production telemetry, and employer-confidential data must not be committed.

## Dependency policy

CI fails on high/critical npm audit findings. Moderate findings are surfaced and reviewed explicitly rather than hidden.
