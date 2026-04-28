# @ocubist/diagnostics-alchemy

A unified TypeScript diagnostics library — typed error framework + structured hierarchical logger.

```
npm install @ocubist/diagnostics-alchemy
```

Full ESM. Node 20+. Zero config.

---

## Error Framework

### Define typed errors

```typescript
import { useErrorAlchemy } from "@ocubist/diagnostics-alchemy";

const { craftMysticError, craftErrorTransmuter } = useErrorAlchemy(
  "auth-service",   // module — stamps every error produced here
  "LoginHandler"    // context
);

export const LoginFailedError = craftMysticError({
  name: "LoginFailedError",
  errorCode: "AUTH_INVALID_CREDENTIALS",
  severity: "critical",
  reason: "Credentials did not match any known account",
});

// At runtime
throw new LoginFailedError({
  message: `Login failed for ${email}`,
  payload: { email },
});
```

### Check error types

```typescript
// Safe instanceof — survives ESM module boundary differences
if (LoginFailedError.compare(err)) {
  // err is narrowed to LoginFailedError
}
```

### Convert foreign errors into typed ones

```typescript
import { ZodError } from "zod";

const zodTransmuter = craftErrorTransmuter(
  (err) => err instanceof ZodError,
  (err: ZodError) => new ValidationError({
    message: err.errors.map(e => e.message).join(" | "),
    origin: err,
  })
);

const typed = zodTransmuter.execute(unknownError);
// → typed ValidationError if ZodError, otherwise passes through unchanged
```

### Chain transmuters into a pipeline

```typescript
const { craftErrorSynthesizer } = useErrorAlchemy("api", "requestHandler");

const synthesizer = craftErrorSynthesizer([zodTransmuter, dbTransmuter, networkTransmuter]);
const typedError = synthesizer.synthesize(caughtError); // first match wins
```

### Route errors to handlers

```typescript
const { craftErrorResolver, craftErrorResolverMap } = useErrorAlchemy("api", "requestHandler");

const resolver = craftErrorResolver({
  synthesizer,
  logger: (err) => log.error("Error", { payload: { err: objectifyError(err) } }),
  errorResolverMap: craftErrorResolverMap(
    [NotFoundError,   (err) => res.status(404).json({ error: err.message })],
    [AuthError,       (err) => res.status(401).json({ error: err.message })],
  ),
  defaultResolver: (err) => res.status(500).json({ error: "Internal error" }),
});

router.use((err, req, res, next) => resolver(err));
```

### Validation helpers

```typescript
import {
  parse, asyncParse,
  validate, asyncValidate,
  assert, assertDefined, assertNotEmpty, assertTruthy,
} from "@ocubist/diagnostics-alchemy";
import { z } from "zod";

const schema = z.object({ id: z.string().uuid(), age: z.number().int().min(0) });

const user = parse(rawInput, schema);           // throws ParseFailedError on failure
const user = await asyncParse(rawInput, schema); // async version

validate(rawInput, schema);   // returns boolean, never throws
asyncValidate(rawInput, schema); // async boolean

assertDefined(value);          // throws if null | undefined
assertNotEmpty(arr, 1, 100);   // throws if empty or out of [min, max]
assert(value, schema);         // Zod schema assertion
```

---

## Logger

### Create a logger

```typescript
import { useLogger } from "@ocubist/diagnostics-alchemy";

const log = useLogger({
  where: "api-server",     // root context segment
  minLevel: "info",        // filter out debug entries
  environment: "server",   // only log on Node.js (not in browser)
  logOutput: "all",        // stdout + file
  filePath: "logs/app.log",
});

log.info("Server started", { payload: { port: 3000 } });
log.warn("Slow query", { where: "db", payload: { ms: 1230 } });
// stdout: 2024-06-01T12:00:00.000Z WARN  [api-server.db] Slow query
//           {"ms":1230}
```

### Hierarchical context — `specialize()`

```typescript
const authLog = log.specialize({ where: "auth", why: "user-session" });
const loginLog = authLog.specialize({ where: "login" });

loginLog.warn("Token expired");
// where: "api-server.auth.login"
// why:   "user-session"

// Add context at the call site too
loginLog.error("Credentials rejected", { where: "validator", payload: { userId } });
// where: "api-server.auth.login.validator"
```

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `where` | `string` | — | Location segment |
| `why` | `string` | — | Intent segment |
| `minLevel` | `"debug"\|"info"\|"warn"\|"error"\|"fatal"` | `"debug"` | Drop entries below this level |
| `environment` | `"server"\|"device"\|"all"` | `"all"` | `"server"` = Node only, `"device"` = browser only |
| `runtimeEnvironment` | `"development"\|"production"\|"all"` | `"all"` | Filter by `NODE_ENV` |
| `logOutput` | `"stdOut"\|"file"\|"all"` | `"stdOut"` | Output destinations |
| `filePath` | `string` | — | Path for JSON file output (required if `logOutput` includes `"file"`) |
| `callbackFunctions` | `((entry: LogEntry) => void)[]` | `[]` | Custom sinks |

### Serialize errors for log payloads

```typescript
import { objectifyError } from "@ocubist/diagnostics-alchemy";

log.error("Request failed", {
  payload: { err: objectifyError(caughtError) },
});
// TransmutedError → all typed fields (severity, errorCode, reason, payload, origin chain, ...)
// plain Error    → { type, message, stack }
// anything else → { value: ... }
```

### Custom sinks via callbacks

```typescript
const log = useLogger({
  callbackFunctions: [
    // Remote HTTP sink
    (entry) => fetch("https://logs.example.com/ingest", {
      method: "POST",
      body: JSON.stringify(entry),
      headers: { "Content-Type": "application/json" },
    }).catch(() => {}),

    // Metrics
    (entry) => {
      if (entry.level === "error" || entry.level === "fatal")
        metrics.increment("errors", { level: entry.level });
    },
  ],
});
```

Callbacks added in `specialize()` stack on top of the parent's callbacks — both fire.

### Error framework integration

```typescript
import { useLogger, useErrorAlchemy, objectifyError } from "@ocubist/diagnostics-alchemy";

const log = useLogger({ where: "api" });
const { craftMysticError, craftErrorLogger } = useErrorAlchemy("api", "handler");

const DbError = craftMysticError({ name: "DbError", errorCode: "DB_CONNECTION_FAILED", severity: "fatal" });

const logError = craftErrorLogger({
  default: (err) => log.error("Error",  { payload: { err: objectifyError(err) } }),
  fatal:   (err) => log.fatal("FATAL",  { payload: { err: objectifyError(err) } }),
  unimportant: (err) => log.debug("Minor", { payload: { err: objectifyError(err) } }),
});
```

---

## Severity levels

| Level | Description |
|---|---|
| `unimportant` | Can be ignored |
| `minor` | No action needed |
| `unexpected` | Should not happen (default) |
| `critical` | Requires attention |
| `fatal` | System cannot continue normally |
| `catastrophic` | Data loss / breach possible |

---

## Error codes

79 predefined codes. Examples: `AUTH_INVALID_CREDENTIALS`, `DB_CONNECTION_FAILED`, `FILE_NOT_FOUND`, `HTTP_NOT_FOUND`, `VALIDATION_ERROR`, `NETWORK_ERROR`, `RUNTIME_ERROR`, `UNKNOWN_ERROR` …

Full list: [`src/errors/error-code/errorCodeSelector.ts`](src/errors/error-code/errorCodeSelector.ts)

---

## Docs

- [`docs/error-framework.md`](docs/error-framework.md) — full error framework reference
- [`docs/logger.md`](docs/logger.md) — full logger reference
- [`docs/releasing.md`](docs/releasing.md) — release script & CI publish workflow
- [`docs/origins.md`](docs/origins.md) — where this package came from
