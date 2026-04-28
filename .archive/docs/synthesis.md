# diagnostics-alchemy — Architecture & Decisions

**Package:** `@ocubist/diagnostics-alchemy` v0.1.0
**Date:** 2026-04-27
**Status:** Implemented, 191 tests passing, build clean

---

## What Was Built

One package that does two things:

```
@ocubist/diagnostics-alchemy
    ├── src/errors/      ← typed error framework (ported + modernized from error-alchemy archive)
    └── src/logger/      ← hierarchical structured logger (new)
```

### Why One Package, Not Two

The original planning doc recommended two packages (`error-alchemy` + `alchemy-logger`). That decision was revisited and reversed for good reason:

- The error framework is useless without logging, and the logger is useless without typed errors. They're not independent utilities — they're two halves of one system.
- One install. No internal version management. No compatibility drift.
- The "tree-shaking" argument doesn't hold here: even if you only use the error framework, you're not loading SonicBoom or chalk at runtime (they're only instantiated when you call `useLogger`).

The docs and archive still reference the two-package plan. The archive is kept for reference only. The new package supersedes both `error-alchemy` and all the logger work.

---

## Decision Log

### Error framework

| Decision | Choice | Reason |
|---|---|---|
| `cause` vs `reason` | `reason` | `Error.cause` is native ES2022 — collision avoided |
| UUID generation | `crypto.randomUUID()` | No external `uuid` package needed |
| `instanceof` across module boundaries | `dynamicClassUuid` + `compare()` | ESM module instances can differ; UUID survives |
| Build tool | tsup | Handles ESM + dts cleanly, zero config |
| Test tool | vitest | ESM-native, no jest CJS hacks needed |
| `Object.hasOwnProperty.call` | `Object.hasOwn()` | ES2022, available at target |

All bugs found in the archive were fixed:
- `escapeIdentifierPart` — was `replace("///g", ...)` (string, not regex) → fixed to `/\//g`
- `popTranceStack` typo → `popTraceStack`
- `cause` field collision with native `Error.cause` → renamed to `reason`
- `simpleGetter` test artifact removed from `TransmutedError`
- Origin inheritance logic fixed: `if (props.origin instanceof TransmutedError)` instead of the original broken `hasOwnProperty` check

### Logger

| Decision | Choice | Reason |
|---|---|---|
| Transport architecture | Custom transport, not Pino's API | Pino as a driver requires piping JSON through a transform stream to reformat it for stdout — wasteful. Direct chalk + SonicBoom is simpler and sufficient. |
| Pino dependency | Removed (was listed, never used) | We don't use pino's API at all. SonicBoom + chalk + our own formatting achieves the same result for typical usage. |
| File writing | SonicBoom directly | Proper async buffer with `flushSync()` for exit safety. Naive `fs.writeFile` callbacks drop logs on process exit. |
| HTTP transport | Not implemented | Callbacks cover it — pass a `callbackFunctions` entry that does a `fetch`. See "Future work" below. |
| Browser support | Yes, via BrowserTransport | `%c` CSS directives give DevTools color-coding. Same `LogEntry` type, same API. |
| Context stacking | Dot-path (`app.auth.login`) | One string, human-readable, easily filterable in log aggregators |
| Context at three levels | Logger creation, `specialize()`, per-call | Maximum flexibility without boilerplate |

---

## Package Structure

```
src/
  errors/
    error-code/          ← 79 error codes as const + Zod enum
    severity/            ← 6 severity levels + descriptions
    config/              ← default values (module, context, errorCode, severity)
    utility/             ← escapeIdentifierPart, createIdentifier, popTraceStack, PropsValidationError
    transmuted-errors/   ← TransmutedError, MysticError, SynthesizedError + types
    crafting/
      craft-errors/      ← craftMysticError, craftSynthesizedError
      Transmuter/        ← craftErrorTransmuter
      Synthesizer/       ← craftErrorSynthesizer
      Resolver/          ← craftErrorLogger, craftErrorResolverMap, craftErrorResolver
      useErrorAlchemy/   ← primary entry point (pre-binds module/context)
    validation/
      asserters/         ← assert, assertDefined, assertTruthy, assertFalsy, assertEmpty, assertNotEmpty
      parsers/           ← parse, asyncParse
      validators/        ← validate, asyncValidate
    index.ts             ← barrel

  logger/
    types.ts             ← LogLevel, LogEntry, LogCallContext, LoggerOptions, restrictions enums
    restrictions.ts      ← isServerEnvironment, checkEnvironmentRestriction, checkRuntimeRestriction, isLevelEnabled
    context.ts           ← buildContextPath (dot-path stacking)
    formatters/
      objectifyError.ts  ← deep serialization of TransmutedError chains
      formatNodeEntry.ts ← chalk-formatted single-line output for stdout
      levelColors.ts     ← chalk styles + CSS strings per log level
    transports/
      types.ts           ← Transport interface
      NodeTransport.ts   ← chalk stdout + SonicBoom file (with exit flush hooks)
      BrowserTransport.ts← console.* with %c CSS
    Logger.ts            ← Logger class
    useLogger.ts         ← factory (creates transport, returns Logger)
    index.ts             ← barrel

  index.ts               ← root barrel (re-exports errors/* and logger/*)
```

---

## Dependencies

| Package | Why |
|---|---|
| `chalk ^5.3` | ANSI color formatting for Node stdout (ESM-native, no CJS hacks) |
| `sonic-boom ^4` | Buffered async file writes with safe `flushSync()` on process exit |
| `zod ^3.23.8` | Runtime validation of error props; Zod enum for ErrorCode/Severity types |

No Pino. No uuid. No http-request-handler. No singleton-manager. No event-handler.

---

## Future Work

### HTTP Transport (suspended indefinitely)

Not built. Not planned for v0.1 or v0.2.

**Why not:** The callback system already handles it cleanly:

```typescript
const log = useLogger({
  callbackFunctions: [
    (entry) => fetch("https://my-log-sink.example.com/ingest", {
      method: "POST",
      body: JSON.stringify(entry),
      headers: { "Content-Type": "application/json" },
    }).catch(() => {}), // fire-and-forget
  ],
});
```

If fire-and-forget is insufficient (e.g., you need guaranteed delivery, batching, retry, backpressure), that's a full-blown transport system — a separate package or a purpose-built integration. Building a naive HTTP transport into the logger core would give false confidence without delivering those guarantees.

When this becomes a real need: implement it as a separate `callbackFunctions` provider that handles batching + retry internally, and pass it in at `useLogger` time. The logger interface doesn't need to change.

### Log Rotation

SonicBoom exposes a `rotate()` method — it atomically closes and reopens the log file. The trigger (when to rotate) is what's missing.

**What needs to be decided before implementing:**

1. **Trigger type:** Size-based ("rotate when file exceeds 50MB"), time-based ("rotate at midnight"), or both?
2. **File naming:** Numbered suffixes (`app.log.1`, `app.log.2`, ...) or timestamps (`app-2024-06-01.log`)?
3. **Retention policy:** Keep the last N files? Keep files younger than N days?
4. **Compression:** gzip old files to save space?
5. **Who triggers it:** The logger internally (polling file size) or the OS externally?

The simplest production approach on Linux: use the system's `logrotate` daemon + handle `SIGUSR2` by calling `boom.rotate()`. No code needed in the logger beyond a signal handler. This is how most production Node.js apps do log rotation.

For a pure-Node approach (Windows, Docker, no logrotate): ~50 lines of code — track bytes written, call `boom.rotate()` at threshold, rename the old file, optionally delete beyond the retention limit. No new dependencies needed. Blocked only on the decisions above.

### Pino (what it is, why it's not used)

Pino is a third-party JSON logger known for being very fast. The original plan was to use Pino as the underlying serialization engine and write custom transports around it.

After implementing, that turned out to be backwards: Pino serializes to JSON and writes to a stream, so to get human-readable stdout output you'd have to parse that JSON back and reformat it — an unnecessary round-trip. Our implementation writes formatted output directly to stdout via chalk and structured JSON directly to files via SonicBoom, which is both simpler and at least as fast for typical usage.

Where Pino's extra performance would actually matter: services logging 100k+ entries per minute, where the logger itself becomes a CPU bottleneck. At that scale, Pino uses a worker thread for serialization so the main thread never blocks. For everything short of that, our implementation is fine.

Pino was removed from `package.json` in v0.1.0. It can be reconsidered as an optional/internal implementation detail in a future version if throughput becomes a concern.
