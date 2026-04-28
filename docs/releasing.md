# Releasing

Releases are automated via `scripts/release.mjs`. Must be run from the `dev` branch with a clean working tree.

## Usage

```bash
npm run release           # bump patch (0.1.0 → 0.1.1)
npm run release:minor     # bump minor (0.1.0 → 0.2.0)
npm run release:major     # bump major (0.1.0 → 1.0.0)
```

## What the script does

1. **Pre-flight** — verifies you're on `dev` with no uncommitted changes
2. **Tests** — runs `npm test`; aborts immediately on failure, nothing is changed
3. **Version bump** — increments the chosen segment in `package.json`, commits `chore: release vX.Y.Z` on `dev`
4. **Merge** — `git checkout main && git merge dev --no-edit`; on conflict: aborts merge, returns to `dev`, exits
5. **Push main** — `git push origin main`; CI picks it up, runs tests, then publishes to npm automatically
6. **Return to dev** — switches back to `dev`

## Flags

| Flag | Effect |
|---|---|
| `--skip-bump` | Skip the version bump + commit (use when you've already bumped manually) |
| `--push-dev` | Also push `dev` to origin after pushing `main` |

## CI publish

Pushing to `main` triggers the GitHub Actions `publish` job (only on `push` events, only after the test matrix passes). It builds the package and runs `npm publish --access public` using the `NPM_TOKEN` repository secret.

To set up or rotate the token: npm account → Access Tokens → generate a new **Granular** or **Classic Automation** token → add it as `NPM_TOKEN` in the repo's Settings → Secrets and variables → Actions.
