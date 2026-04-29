# AGENTS.md — @ocubist/diagnostics-alchemy

Developer and AI-agent guide for this package.

---

## What this package is

A unified TypeScript diagnostics library: typed error framework + structured hierarchical logger.
Full ESM, Node 20+, also browser-safe (no Node built-ins in the main bundle).

---

## Repo layout

```
src/
  index.ts                  — public surface (re-exports everything)
  errors/                   — error framework (craftMysticError, transmuters, resolvers, …)
  logger/
    Logger.ts               — core Logger class
    useLogger.ts            — factory + built-in console transport
    types.ts                — LogLevel, LogEntry, LogCallContext, LoggerOptions, Transport
    context.ts              — buildContextPath() helper
    formatters/
      formatEntry.ts        — chalk-based entry formatter (Node + browser)
      levelColors.ts        — chalk styles per level
      objectifyError.ts     — serialize any error to a plain object
    index.ts                — logger sub-exports

tests/                      — vitest test suite (mirrors src/)
scripts/
  release.mjs               — release script (bump → merge → push)
.github/workflows/ci.yml    — CI: test on Node 20+22, publish on main push
```

---

## Key design decisions

### Transport API
A `Transport` is `(entry: LogEntry) => void` — a plain function, no class.

- `Logger` takes `transports: Transport[]` in its constructor.
- `useLogger()` builds the list: console transport (on by default, opt-out via `console: false`) + `options.transports`.
- `specialize()` stacks parent transports + any new ones from options — all fire on every entry.
- File output lives in the separate `@ocubist/da-file-transport` package so sonic-boom never enters browser bundles.

### No environment detection
The main package is fully environment-agnostic. There is no `environment`, `runtimeEnvironment`, `logOutput`, or `filePath` option. Those were removed. All environment-specific behaviour belongs in transport plugins.

### Single build
`tsup` produces one ESM build (`dist/index.js`). No conditional exports, no browser/server split.

### Chalk for formatting
`chalk` v5 (pure ESM) is used for console output. It degrades gracefully to plain text in environments without ANSI support (browsers, CI without color).

---

## Commands

```bash
npm test          # vitest run
npm run typecheck # tsc --noEmit
npm run build     # tsup
```

---

## Release workflow

```bash
node scripts/release.mjs [major|minor|patch] [--push-dev]
```

Must be run from `dev` with a clean working tree. The script:
1. Runs tests
2. Bumps version in `package.json`, commits `chore: release vX.Y.Z` on `dev`
3. Merges `dev` → `main` with `--no-ff`
4. Pushes `main` (CI then publishes to npm)
5. Optionally pushes `dev` (`--push-dev`)

CI publishes via `npm publish --access public` using the `NPM_TOKEN` secret (must be set in GitHub repo settings → Secrets → Actions).

---

## Adding a new transport option

Transports are plain functions — consumers just pass them in `useLogger({ transports: [...] })`. No changes to this package are needed. If you need a new first-class option in `LoggerOptions`, add it to `src/logger/types.ts` and wire it up in `src/logger/useLogger.ts`.

---

## Things to never do

- **Don't import Node built-ins** (`fs`, `path`, `process`, `stream`, …) directly in `src/`. They're fine in `scripts/` and `@ocubist/da-file-transport`, but not here.
- **Don't add `callbackFunctions`** — it was removed; use `transports` instead.
- **Don't amend release commits** — always create a new commit.
- **Don't push `--force` to `main`**.
