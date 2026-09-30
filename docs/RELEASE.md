# Release and Rollback

CHAIN//REACTION is a small static browser application. Release engineering is intentionally proportional to that architecture.

## Versioning

The application version is stored in `package.json` and the lockfile root package metadata. Version changes must keep those values aligned.

The repository does not create release branches. `main` remains the single source of truth.

## Release candidate

Before a release-quality build is presented or deployed:

```bash
npm run verify
```

Only a green `main` revision should be treated as releasable.

The build emits:

- `dist/THIRD_PARTY_LICENSES.txt` — runtime third-party license notices;
- `dist/build-manifest.json` — SHA-256 artifact manifest;
- `dist/sbom.cdx.json` — CycloneDX SBOM.

## Deployment

GitHub Pages deployment is manually triggered. The deployment workflow rebuilds and verifies the production candidate before publishing `dist`.

Local presentation remains the primary competition path:

```bash
npm start
```

## Rollback

There are no database migrations or persistent server-side schema changes to reverse.

If a bad application revision reaches `main`:

1. identify the offending commit;
2. create a normal `git revert <commit>` on `main` rather than rewriting public history;
3. run `npm run verify`;
4. push the verified revert through BackendArchitectX;
5. redeploy GitHub Pages manually if the static deployment was affected.

This keeps the single-branch model, preserves audit history, and avoids force-push rollback.

## Artifact recovery

Generated `dist` output is not committed. A release artifact should be regenerated from the exact known-good Git revision using the pinned runtime, lockfile, and deterministic build process.

## Non-applicable rollback concerns

The current architecture has no database, cache, broker, persistent server state, or background job queue. Database rollback, schema rollback, queue draining, and state restoration procedures are therefore not applicable today.
