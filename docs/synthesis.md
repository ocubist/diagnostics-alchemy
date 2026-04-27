# alchemy-diagnostics — Synthesis & Recommendations

**Date:** 2026-04-27  
**Purpose:** Strategic assessment of the existing monorepo and recommendations for the new `alchemy-diagnostics` package.

---

## The Big Picture

The 7 packages in this monorepo were always scaffolding for one goal: **a structured logger that is deeply integrated with a typed error system.** The logger package was the destination; everything else was built to support it.

- `error-alchemy` → the error model (types, taxonomy, crafting)
- `utils` → serialization (`objectify`, `objectifyError`), ANSI colors
- `file-stream-manager` → high-performance file writing with SonicBoom
- `singleton-manager` → runtime instance registry (shared state between modules)
- `event-handler` → write event notifications
- `http-request-handler` → (optional) remote log shipping
- `logger` → the actual logger — never implemented

The concept is solid. The execution got stuck on infrastructure. Now is the time to consolidate.

---

## What to Keep, Drop, or Replace

| Package                    | Decision             | Reason                                                                                    |
| -------------------------- | -------------------- | ----------------------------------------------------------------------------------------- |
| **error-alchemy**          | **Keep & modernize** | Core value. Unique API. Solid architecture. Minor bugs to fix.                            |
| **utils / objectify**      | **Keep & clean up**  | `objectify` and `objectifyError` are unique and valuable. Remove debug logs. Fix exports. |
| **utils / objectifyError** | **Keep & unify**     | Merge the two implementations. The advanced one wins.                                     |
| **file-stream-manager**    | **Internalize**      | Good concept, but only useful inside the logger. Not a public API.                        |
| **singleton-manager**      | **Drop**             | ESM modules are singletons. Replace with `Map` where dynamic registry is needed.          |
| **event-handler**          | **Drop**             | Redundant wrapper. Use Node's EventEmitter or callbacks directly.                         |
| **http-request-handler**   | **Drop**             | Peripheral. Use `ky` or `fetch` if remote logging is ever needed.                         |
| **logger**                 | **Build**            | The whole point. Build it now.                                                            |

---

## The "Alchemy" Theme — One Package or Two?

You asked: _"Why not pack everything into one 'alchemy' theme? Maybe `alchemy-diagnostics`?"_

**Recommendation: Two packages.**

### Option A: One Package — `alchemy-diagnostics`

**Pros:**

- Single install: `npm install alchemy-diagnostics`
- One coherent API surface
- No internal version management

**Cons:**

- Forces error-alchemy consumers (who only want typed errors, no logging) to take Pino as a dependency
- Harder to tree-shake
- A pure error library (`error-alchemy`) has broad utility; a logger is more specialized

### Option B: Two Packages — `error-alchemy` + `alchemy-logger` (Recommended)

```
error-alchemy       → typed errors, Zod validation, transmuters, resolvers
alchemy-logger      → Pino logger + error integration + file output + objectify
```

**Pros:**

- `error-alchemy` stays lean (no Pino, no fs, no SonicBoom)
- `alchemy-logger` depends on `error-alchemy` — clear direction
- Users who just want typed errors don't carry a logger
- Both packages stay focused on one responsibility

**Cons:**

- Two packages to publish/version
- Need to keep their versions compatible

**Conclusion:** Two packages. `error-alchemy` is the foundation; `alchemy-logger` (or `alchemy-diagnostics`) is built on top of it.

---

## Recommended Architecture for `alchemy-diagnostics` / `alchemy-logger`

### API Design

```typescript
import { useLogger } from "alchemy-diagnostics";

const log = useLogger("my-module", "DatabaseService");

log.info("Connected to database", { host: "localhost", port: 5432 });
log.warn("Slow query detected", { duration: 1230, query: "SELECT ..." });
log.error("Query failed", err, { table: "users", operation: "INSERT" });
log.fatal("Database connection lost", err);
```

### Under the Hood

```
useLogger(module, context)
    ↓
pino.child({ module, context })     ← pre-bound Pino logger
    ↓
pino destinations:
    ├── stdout (via pino-pretty in dev, raw JSON in prod)
    └── file (via pino.multistream + SonicBoom)
```

### Error Integration

```typescript
// Errors are automatically serialized via objectifyError
log.error("Request failed", transmutedError);
// → Pino entry includes:
//   err.name, err.message, err.stack (cleaned)
//   err.severity, err.errorCode, err.module, err.context
//   err.payload (arbitrary debug data)
//   err.origin (the original error that was wrapped)
```

### `craftErrorLogger` Integration

```typescript
const logError = craftErrorLogger({
  default: (err) => log.error("Error", err),
  critical: (err) => log.error("Critical", err),
  fatal: (err) => log.fatal("Fatal", err),
  unimportant: (err) => log.debug("Minor issue", err),
});

// At API boundaries:
router.use((err, req, res, next) => {
  logError(err);
  res.status(500).json({ error: "Internal error" });
});
```

### Specializations (the planned feature)

```typescript
log
  .withSpecialization("HTTP", { method: "GET", path: "/users" })
  .withSpecialization("User", { userId: "123" })
  .info("Request completed", { duration: 45 });
// → Pino entry with specializations: [{ name: "HTTP", ... }, { name: "User", ... }]
```

This is the feature that makes this logger unique vs. raw Pino. Multiple named context groups on one entry, without key collisions.

---

## Dependency Stack for alchemy-diagnostics

```
alchemy-diagnostics
    ├── pino                 (the logger)
    ├── pino-pretty          (dev-mode pretty printing, optional/peerDep)
    ├── sonic-boom           (Pino already includes it, but explicit dep for file streams)
    ├── error-alchemy        (our typed errors, transmuters, resolvers)
    └── zod                  (for config validation)

Internal utilities (not separate packages):
    ├── objectify            (from utils — remove debug logs, fix exports)
    ├── objectifyError       (from utils — the advanced version)
    └── chalk or ansi-colors (for dev pretty output, if not using pino-pretty)
```

Total external deps: ~4-5 packages. Lean.

---

## Modernization Checklist for error-alchemy

Before publishing the updated `error-alchemy`:

- [ ] Convert to full ESM (`"type": "module"`, `"exports"` field)
- [ ] Switch build from `tsc` to `tsup`
- [ ] Switch tests from `jest`/`ts-jest` to `vitest`
- [ ] Replace `uuid` dependency with `crypto.randomUUID()`
- [ ] Remove `simpleGetter` test artifact from `TransmutedError`
- [ ] Rename `cause` → `causeDescription` (avoid collision with `Error.cause`)
- [ ] Fix origin constructor logic (the `hasOwnProperty("origin") && err.cause` bug)
- [ ] Fix `popTranceStack` typo → `popTraceStack`
- [ ] Replace `Object.hasOwnProperty.call` → `Object.hasOwn()`
- [ ] Add `"exports"` to package.json with types, import conditions
- [ ] Add minimum Node.js version to `engines` field (recommend Node 18+)

---

## Build Plan for alchemy-diagnostics

### Phase 1 — Foundation (error-alchemy modernized)

1. Modernize `error-alchemy` to ESM with all fixes above
2. Write vitest tests for all existing functionality
3. Publish as `@ocubist/error-alchemy` v1.0.0

### Phase 2 — New Package Scaffold

1. Create `alchemy-diagnostics` package (or `@ocubist/alchemy-logger`)
2. Set up `tsup` build, `vitest` tests, full ESM
3. Copy and clean up `objectify` and `objectifyError` from utils
4. Add as internal utilities (not re-exported)

### Phase 3 — Core Logger

1. Implement `useLogger(module, context, options?)` built on `pino.child()`
2. Implement file destination using SonicBoom with reference counting (internalized from file-stream-manager)
3. Implement error serialization via `objectifyError`
4. Wire up `craftErrorLogger` compatibility

### Phase 4 — DX Features

1. Add `pino-pretty` integration for development mode
2. Add `withSpecialization()` API
3. Add optional remote destination (using `fetch` not Axios)
4. Add `redactPaths` support (pass-through to Pino)

---

## What Not to Build

- **`singleton-manager` as a package** — replace with `Map` internally
- **`event-handler` as a package** — use callbacks or EventEmitter directly
- **`http-request-handler`** — use `ky` if needed
- **Complex plugin systems** — keep it focused
- **Browser support** — this is a Node.js logger (file streams, process signals)

---

## A Note on the "Alchemy" Theme

The theme is good. "Alchemy" as a metaphor for transforming raw errors into refined, structured knowledge fits both packages. The naming conventions (`craftMysticError`, `craftSynthesizedError`, `transmuter`, `synthesizer`) are distinctive and memorable.

For the logger, staying in the same metaphor makes sense:

- `useLogger` → simple, descriptive
- Log entries as "distillations" of runtime state
- `Specialization` as a named context "vessel"

Keep the theme. It gives the packages a coherent identity.
