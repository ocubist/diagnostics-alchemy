# Logger Framework — Reference

**Module:** `src/logger/` in `@ocubist/diagnostics-alchemy`
**Status:** Implemented, 57 tests passing

---

## Core Concept: Hierarchical Context

Every log entry can carry two context paths — `where` (location) and `why` (intent). Both are built up incrementally across three levels:

1. **Logger creation** (`useLogger`) — the root segment
2. **`specialize()`** — adds another segment per child logger
3. **Per-call** (`log.info("msg", { where, why })`) — adds a final segment at the call site

Each segment gets dot-appended:

```typescript
const log = useLogger({ where: "app" });
const authLog = log.specialize({ where: "auth" });
authLog.warn("Token expired", { where: "tokenValidator" });
// → where: "app.auth.tokenValidator"
```

You don't have to use both. `where` and `why` are both optional at every level.

---

## API

### `useLogger(options?)` → `Logger`

Creates the root logger. Also creates the transport (stdout formatter + optional file stream). All loggers derived from `specialize()` share this transport.

```typescript
import { useLogger } from "@ocubist/diagnostics-alchemy";

const log = useLogger({
  where: "api-server",
  minLevel: "info",
  environment: "server",
  runtimeEnvironment: "all",
  logOutput: "stdOut",
});
```

### `Logger` methods

```typescript
log.debug(message, context?)
log.info(message, context?)
log.warn(message, context?)
log.error(message, context?)
log.fatal(message, context?)

log.specialize(options)   // → new Logger with extended context
log.flushSync()           // flush pending file writes (for tests, shutdown hooks)
```

`context` is `{ where?, why?, payload? }` — all optional.

### `Logger.specialize(options)` → `Logger`

Returns a new Logger that inherits all of the parent's settings but appends to `where` / `why`. The underlying transport is shared — same file stream, same stdout.

Child loggers also **inherit and accumulate** parent callbacks. Callbacks added to the child are called on top of the parent's.

```typescript
const db = log.specialize({ where: "db", why: "query-engine" });
const userDb = db.specialize({ where: "users" });
userDb.error("Row not found", { payload: { id: 42 } });
// where: "api-server.db.users"
// why:   "query-engine"
```

---

## `LoggerOptions`

| Option | Type | Default | Description |
|---|---|---|---|
| `where` | `string` | — | Location context segment |
| `why` | `string` | — | Intent context segment |
| `minLevel` | `LogLevel` | `"debug"` | Filter out levels below this |
| `environment` | `"server" \| "device" \| "all"` | `"all"` | Only log in this runtime environment |
| `runtimeEnvironment` | `"development" \| "production" \| "all"` | `"all"` | Only log when NODE_ENV matches |
| `logOutput` | `"stdOut" \| "file" \| "all"` | `"stdOut"` | Where to write output |
| `filePath` | `string` | — | Required when `logOutput` is `"file"` or `"all"` |
| `callbackFunctions` | `((entry: LogEntry) => void)[]` | `[]` | Custom sinks (remote, metrics, etc.) |

---

## Log Levels

In ascending severity: `debug` → `info` → `warn` → `error` → `fatal`

`minLevel` filters out anything below the threshold. Setting `minLevel: "warn"` means `debug` and `info` are silently dropped.

---

## Restriction System

### `environment`

Controls which runtime environment is active:

- `"server"` — only logs when `globalThis.window` is undefined (Node.js / server-side)
- `"device"` — only logs when `globalThis.window` is defined (browser)
- `"all"` — always logs (default)

### `runtimeEnvironment`

Controls which NODE_ENV is active:

- `"development"` — only logs when `NODE_ENV === "development"` (or when NODE_ENV is unset)
- `"production"` — only logs when `NODE_ENV === "production"`
- `"all"` — always logs (default)

### Restriction evaluation

All restrictions are checked before each log call. If any restriction fails, the entry is dropped silently — transport is not called, callbacks are not called.

---

## Transports

### NodeTransport (auto-selected on Node.js)

- **stdout:** chalk-formatted single-line output with ANSI colors per log level
- **file:** newline-delimited JSON written asynchronously via SonicBoom

File output format example:
```json
{"level":"warn","time":1717243200000,"message":"Token expired","where":"app.auth.tokenValidator","why":"session","payload":{"userId":"u123"}}
```

Stdout format example:
```
2024-06-01T12:00:00.000Z WARN  [app.auth.tokenValidator] (session) Token expired
  {"userId":"u123"}
```

**Exit safety:** SonicBoom's buffer is flushed synchronously on `process.exit`, `SIGINT`, and `SIGTERM`. No log entries are silently lost on shutdown.

### BrowserTransport (auto-selected in browser environments)

Uses `console.debug/info/warn/error` with `%c` CSS directives for color-coded output in DevTools. `filePath` and `logOutput` are ignored in the browser.

---

## Callbacks — Custom Sinks

The `callbackFunctions` array is called with every emitted `LogEntry` after the transport writes. This is the escape hatch for anything the built-in transports don't cover.

```typescript
// Remote HTTP sink (fire-and-forget)
const log = useLogger({
  callbackFunctions: [
    (entry) => {
      fetch("https://logs.example.com/ingest", {
        method: "POST",
        body: JSON.stringify(entry),
        headers: { "Content-Type": "application/json" },
      }).catch(() => {}); // don't crash the app on log failure
    },
  ],
});
```

```typescript
// Metrics counter
const log = useLogger({
  callbackFunctions: [
    (entry) => {
      if (entry.level === "error" || entry.level === "fatal") {
        metrics.increment("error_count", { level: entry.level });
      }
    },
  ],
});
```

Callbacks added via `specialize()` accumulate on top of the parent's callbacks — both fire for every log call on the child.

---

## `objectifyError(err)` — Serializing Errors for Payloads

`objectifyError` converts any value into a plain JSON-serializable object. It's `TransmutedError`-aware.

```typescript
import { objectifyError } from "@ocubist/diagnostics-alchemy";

log.error("Request failed", {
  payload: { err: objectifyError(caughtError) },
});
```

| Input | Output |
|---|---|
| `TransmutedError` (or subclass) | All typed fields: `type`, `message`, `severity`, `errorCode`, `reason`, `module`, `context`, `identifier`, `payload`, `instanceUuid`, `origin` (recursive) |
| `Error` (plain) | `{ type, message, stack }` |
| Anything else | `{ value: <the thing> }` |

`origin` chains are followed recursively — a wrapped `TransmutedError` wrapping another `TransmutedError` wrapping a plain `Error` gives you the full chain.

---

## Integration with the Error Framework

```typescript
import { useLogger, useErrorAlchemy, objectifyError } from "@ocubist/diagnostics-alchemy";

const log = useLogger({ where: "api", minLevel: "info" });

const { craftMysticError, craftErrorLogger, craftErrorResolver, craftErrorSynthesizer, craftErrorTransmuter } =
  useErrorAlchemy("api", "requestHandler");

const DbError = craftMysticError({ name: "DbError", errorCode: "DB_CONNECTION_FAILED", severity: "fatal" });

// Wire logger into the error resolver
const logError = craftErrorLogger({
  default:      (err) => log.error("Error", { payload: { err: objectifyError(err) } }),
  fatal:        (err) => log.fatal("FATAL", { payload: { err: objectifyError(err) } }),
  unimportant:  (err) => log.debug("Minor", { payload: { err: objectifyError(err) } }),
});

const resolver = craftErrorResolver({
  synthesizer: craftErrorSynthesizer([
    craftErrorTransmuter((e) => e instanceof TypeError, (e: TypeError) => new DbError({ message: e.message, origin: e })),
  ]),
  logger: logError,
  defaultResolver: (err) => res.status(500).json({ error: "Internal error" }),
});

router.use((err, req, res, next) => resolver(err));
```

---

## LogEntry shape

The raw object passed to transports and callbacks:

```typescript
interface LogEntry {
  level: "debug" | "info" | "warn" | "error" | "fatal";
  time: number;          // Date.now()
  message: string;
  where?: string;        // dot-path e.g. "app.auth.login"
  why?: string;          // dot-path e.g. "session.tokenRefresh"
  payload?: Record<string, unknown>;
}
```
