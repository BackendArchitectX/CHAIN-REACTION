# Contributing

This repository is maintained as a single-author competition project by **BackendArchitectX**.

## Branch model

`main` is the only maintained branch. Long-lived `develop`, `release`, and feature branches are intentionally not used for this challenge repository.

## Quality gate

Before any mainline change is treated as complete:

```bash
npm run verify
```

The verification pipeline checks the project contract, strict TypeScript, deterministic tests, and the production build. GitHub Actions additionally enforces the dependency security severity gate.

## Scope

External pull requests are not being accepted during the Snapdragon AI Lab challenge build window. Do not add co-author trailers or automated contributor identities.
