# logger — Deep Analysis

**Package:** `@ocubist/logger` v0.1.0  
**Status:** EMPTY — never implemented  
**Verdict:** The intention is clear from the type files. This is the package to build. Everything else in the monorepo was scaffolding for it.

---

## Current State

The `logger` package contains only:

```typescript
// LoggerClass.ts
export class LoggerClass {}

// index.ts — empty, no exports
```

However, the type files reveal a clear design intent.

---

## The Design Intent (from type files)

### `PinoLogObject` Zod Schema

```typescript
export const PinoLogObject = z.object({
  level: z.number(), // Pino's numeric level (10=trace, 20=debug, 30=info, ...)
  time: z.number(), // Unix timestamp in ms
  msg: z.string().optional(), // The log message
  pid: z.number(), // Process ID
  hostname: z.string(), // Machine hostname
  payload: Payload.optional(), // Arbitrary key-value debug data
  specializations: z.array(Specialization).optional(), // Named context groups
  err: ObjectifiedError.optional(), // Serialized error
  trace: z.array(z.string()).optional(), // Stack trace lines
});
```

This is a Pino log entry structure, extended with custom fields.

### `Payload`

```typescript
const Payload = z.object({}).catchall(z.unknown());
// → Record<string, unknown>
```

Arbitrary structured data attached to a log entry (e.g., `{ userId: "123", endpoint: "/api/users" }`).

### `Specialization`

```typescript
const Specialization = z.object({
  name: z.string(),
  payload: z.object({}).catchall(z.any()).optional(),
});
```

A named context group. E.g., a "DatabaseSpecialization" with `{ queryTime: 45, table: "users" }`. The intent is to allow multiple named data groups on a single log entry without key collisions.

### `Pino` type alias

```typescript
import { Logger } from "pino";
export type Pino = Logger;
```

Confirms the logger is built on Pino.

---

## What Was Planned

Based on the type files, the `logger` package's dependencies, and the design of all supporting packages, the intended architecture is:

### Logger Instance Creation

Similar to `useErrorAlchemy(module, context)`:

```typescript
const logger = useLogger("my-module", "my-context");
// → pre-tagged logger that automatically stamps module/context on every entry
```

### Log Methods

Mapping to Pino levels:

```typescript
logger.trace(message, payload?)
logger.debug(message, payload?)
logger.info(message, payload?)
logger.warn(message, payload?)
logger.error(message, error?, payload?)
logger.fatal(message, error?, payload?)
```

### Error Logging

The `err` field in `PinoLogObject` would be populated using `objectifyError` from utils, transforming a `TransmutedError` into a structured serializable object. Since `TransmutedError` has `severity`, `errorCode`, `module`, `context`, `payload`, `origin` — all of this would be captured.

### File Output

The `file-stream-manager` was designed specifically for this: the logger subscribes to a file stream, writes JSON lines to it via SonicBoom, and unsubscribes on shutdown.

### ANSI/Pretty Output (Development)

The `ansify`/`ansi-colors` system from utils was intended for a pretty-printed development mode output — colorized log levels, formatted messages.

### Write Event Subscription

The `event-handler`'s `writeEventName` event was designed so that the logger could react to writes (e.g., for metrics: "how many log entries per second?").

### Dependencies in package.json

```json
{
  "pino": "^9.3.2",
  "@ocubist/error-alchemy": "^0.9.3",
  "@ocubist/event-handler": "^0.2.3",
  "@ocubist/http-request-handler": "^0.2.2", // for remote log shipping?
  "@ocubist/singleton-manager": "^0.6.1",
  "@ocubist/utils": "^0.6.2"
}
```

---

## What Needs to Be Built

The `LoggerClass` body needs to implement:

### 1. Configuration

```typescript
interface LoggerConfig {
  module: string;
  context: string;
  level?: "trace" | "debug" | "info" | "warn" | "error" | "fatal";
  destinations?: {
    file?: string; // path to log file
    stdout?: boolean; // log to stdout (default: true in dev)
    remote?: string; // HTTP endpoint for log shipping
  };
  pretty?: boolean; // colorized output (default: true in dev, false in prod)
  redactPaths?: string[]; // pino redact paths (e.g., "req.headers.authorization")
}
```

### 2. Core Logging Methods

Each method should:

1. Build a structured log entry with `module`, `context`, `payload`, `specializations`
2. Serialize any `Error` via `objectifyError` into the `err` field
3. Call Pino's appropriate level method
4. Pino handles file writing, stdout, JSON formatting

### 3. Severity → Pino Level Mapping

error-alchemy's `Severity` maps to Pino's numeric levels:
| Severity | Pino Level |
|----------|-----------|
| `unimportant` | `trace` (10) |
| `minor` | `debug` (20) |
| `unexpected` | `warn` (40) |
| `critical` | `error` (50) |
| `fatal` | `fatal` (60) |
| `catastrophic` | `fatal` (60) |

### 4. Error-Aware Logging

```typescript
logger.error("Failed to connect to database", err, { retries: 3 });
// → pino entry with err field populated by objectifyError(err)
```

For `TransmutedError` instances, automatically extract `severity`, `errorCode`, `module`, `context` into the log entry so logs are filterable.

### 5. `craftErrorLogger` Integration

The `craftErrorLogger` from error-alchemy returns `(err: unknown) => void`. The logger should be passable directly as a severity-dispatching logger:

```typescript
const logError = craftErrorLogger({
  default: (err) => logger.error("Unhandled error", err),
  critical: (err) => logger.error("Critical error", err),
  fatal: (err) => logger.fatal("Fatal error", err),
});
```

---

## Pino Overview (for reference)

Pino is the fastest Node.js logger. Key features relevant here:

- JSON output by default (structured, machine-readable)
- `pino-pretty` for human-readable dev output
- Multiple destinations via `pino.multistream()`
- Redaction of sensitive fields
- Child loggers with pre-bound context (`pino.child({ module: "auth" })`)
- SonicBoom is Pino's own file transport — they're designed to work together

The `pino.child()` API is exactly what `useLogger(module, context)` should use under the hood.

---

## Verdict for alchemy-diagnostics

**This is the heart of the new package.** Build it properly.

The logger is the reason error-alchemy, utils (objectifyError), and file-stream-manager exist. They are its supporting cast.

Key decisions for the new implementation:

1. Use Pino as the underlying logger (it's the right choice — fast, structured, ESM-compatible)
2. Use `pino.child()` for module/context binding
3. Use `pino.multistream()` for multiple destinations (stdout + file)
4. Use SonicBoom directly (Pino already uses it internally) for file output
5. Integrate `objectifyError` for rich error serialization in log entries
6. Integrate error-alchemy's severity for error log routing
7. Pretty-print in development using `pino-pretty` (or `@hapi/hoek` color support)
8. Drop the event-handler dependency — not needed
9. Drop the http-request-handler dependency — add remote shipping later if needed as an optional transport
10. Drop singleton-manager — use module-level Map for logger instance registry if needed
