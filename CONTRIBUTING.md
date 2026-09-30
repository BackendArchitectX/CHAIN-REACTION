# Contributing

This repository is maintained as a single-human-contributor competition project by **BackendArchitectX**.

## Branch model

`main` is the only maintained branch. Long-lived `develop`, release, and feature branches are intentionally not used. Product feature isolation lives under `src/features/*`.

## Contributor identity

New human project work must be performed through the **BackendArchitectX** GitHub account.

Before creating a local commit, configure repository-local identity:

```bash
git config --local user.name "backendarchitectx"
git config --local user.email "96111851+BackendArchitectX@users.noreply.github.com"
npm run git:identity
```

The email above is not guessed: it is the GitHub noreply identity already associated with BackendArchitectX commits in this repository.

Do not add:

- `Co-authored-by` trailers;
- unrelated human identities;
- bot authors for implementation commits;
- fake commits or artificial commit splitting for contribution statistics.

The `verify-contributor-identity` workflow checks full reachable history for the repository-verified BackendArchitectX noreply identity and rejects co-author trailers. Pushes to `main` are also checked against the GitHub workflow actor.

## Quality gate

Before any mainline change is treated as complete:

```bash
npm run verify
```

The verification pipeline checks runtime/repository contracts, architecture rules, repository hygiene, dependency license metadata, accessibility, strict TypeScript, deterministic tests, reproducible production builds, artifact integrity, runtime smoke behavior, and SBOM generation.

## Scope

External pull requests are not accepted during the Snapdragon AI Lab challenge build window.
