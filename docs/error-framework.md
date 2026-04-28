# Error Framework — Reference

**Module:** `src/errors/` in `@ocubist/diagnostics-alchemy`
**Status:** Implemented, 134 tests passing

This is the modernized successor to the `error-alchemy` archive package. All bugs from the archive have been fixed. The API is largely the same, with a few deliberate changes.

---

## The Error Hierarchy

```
Error (native)
└── TransmutedError          ← enriched base class
    ├── MysticError           ← "unknown/unhandled" — origin unclear
    └── SynthesizedError      ← "identified/typed" — ready to catch by type
```

### TransmutedError fields

| Field | Type | Description |
|---|---|---|
| `message` | `string` | What happened (standard Error message) |
| `name` | `string` | The error class name (e.g. `"FileNotFoundError"`) |
| `severity` | `Severity` | One of 6 levels; defaults to `"unexpected"` |
| `errorCode` | `ErrorCode` | One of 79 predefined codes; defaults to `"UNKNOWN_ERROR"` |
| `reason` | `string \| undefined` | *Why* this error exists — human-readable explanation |
| `payload` | `Record<string, unknown>` | Arbitrary structured debug data; defaults to `{}` |
| `module` | `string \| undefined` | Which package/system produced this |
| `context` | `string \| undefined` | Which function/handler produced this |
| `origin` | `unknown` | The original error that was caught and wrapped |
| `instanceUuid` | `string` | Unique UUID per instance (`crypto.randomUUID()`) |
| `identifier` | `string` (getter) | `name/module/context/errorCode` — composed key |
| `severityDescription` | `string` (getter) | Human-readable severity label |

**Note on `reason`:** The archive used `cause` for this field. Renamed to `reason` to avoid collision with native `Error.cause` (ES2022). If you pass `reason: "..."` and also pass `origin` that is a `TransmutedError`, the explicit `reason` wins.

**Origin inheritance:** When `origin` is a `TransmutedError`, its `reason`, `module`, `context`, `severity`, and `errorCode` are inherited as defaults — the wrapping error doesn't have to repeat them. Explicit props always override.

---

## The Crafting System

### `craftMysticError(props)` / `craftSynthesizedError(props)`

The idiomatic way to define typed errors. You get a real class with `compare()`, strong types, and pre-filled static metadata.

```typescript
const FileNotFoundError = craftMysticError({
  name: "FileNotFoundError",
  errorCode: "FILE_NOT_FOUND",
  severity: "critical",
  reason: "The requested file does not exist",
});

// Instance props merge with (and override) static props
throw new FileNotFoundError({
  message: `File not found: ${path}`,
  payload: { path },
});

// Safe instanceof that survives ESM module boundary differences
if (FileNotFoundError.compare(err)) { ... }
```

Each crafted class gets a `dynamicClassUuid` at definition time. `compare()` checks both `instanceof` and the UUID, so it works even if the same module is loaded twice under different paths.

### `useErrorAlchemy(module, context)`

The recommended entry point per file. Pre-binds `module` and `context` so every error produced in this file is automatically tagged.

```typescript
const { craftMysticError, craftErrorTransmuter } = useErrorAlchemy(
  "auth-service",
  "LoginHandler"
);

export const LoginFailedError = craftMysticError({
  name: "LoginFailedError",
  errorCode: "AUTH_INVALID_CREDENTIALS",
  severity: "critical",
  // module: "auth-service" and context: "LoginHandler" are injected automatically
});
```

Returns: `craftMysticError`, `craftSynthesizedError`, `craftErrorTransmuter`, `craftErrorSynthesizer`, `craftErrorLogger`, `craftErrorResolverMap`, `craftErrorResolver`.

---

## The Transmuter Pipeline

### `craftErrorTransmuter(detector, transmuter)` → `Transmuter`

Converts one specific foreign error type into a typed error.

```typescript
const zodTransmuter = craftErrorTransmuter(
  (err) => err instanceof ZodError,
  (err: ZodError) => new ValidationFailedError({
    message: err.errors.map(e => e.message).join(" | "),
    origin: err,
  })
);

// Use directly
const result = zodTransmuter.execute(unknownError);
// → typed ValidationFailedError if ZodError, otherwise passes through unchanged
```

### `craftErrorSynthesizer(chain)` → `Synthesizer`

Chains multiple transmuters. First match wins. Chains can contain other synthesizers (nested pipelines).

```typescript
const synthesizer = craftErrorSynthesizer([
  zodTransmuter,
  axiosTransmuter,
  dbTransmuter,
]);

const typed = synthesizer.synthesize(unknownError);
```

---

## The Resolver System

### `craftErrorResolver(props)` → `(err) => void`

Composes the full pipeline: synthesize → log → dispatch to typed handler.

```typescript
const resolver = craftErrorResolver({
  synthesizer,
  logger: (err) => log.error("Unhandled", err),
  errorResolverMap: craftErrorResolverMap(
    [NotFoundError, (err) => res.status(404).json({ error: err.message })],
    [AuthError,     (err) => res.status(401).json({ error: err.message })],
  ),
  defaultResolver: (err) => res.status(500).json({ error: "Internal error" }),
});

router.use((err, req, res, next) => resolver(err));
```

### `craftErrorLogger(props)` → `(err) => void`

Routes errors to per-severity handlers. Useful for wiring the resolver into the logger.

```typescript
const logError = craftErrorLogger({
  default:   (err) => log.error("Error", { payload: { err: objectifyError(err) } }),
  fatal:     (err) => log.fatal("FATAL", { payload: { err: objectifyError(err) } }),
  unimportant: (err) => log.debug("Minor", { payload: { err: objectifyError(err) } }),
});
```

---

## Severity Levels

| Level | Description |
|---|---|
| `unimportant` | Can safely be ignored |
| `minor` | Does not need immediate attention (visual bugs, etc.) |
| `unexpected` | Was not expected and can potentially be harmful (default) |
| `critical` | Might break functionality but shouldn't be fatal |
| `fatal` | Will potentially cause complete system failure |
| `catastrophic` | Might cause real damage (data loss, security breach) |

---

## Error Codes

79 predefined codes in `errorCodeSelector`. Grouped by domain:

`AUTH_*`, `BUSINESS_*`, `CLIENT_*`, `CONFIG_*`, `DATA_*`, `DB_*`, `DEPLOYMENT_*`, `ENV_*`, `FILE_*`, `HTTP_*`, `MONITORING_*`, `NETWORK_*`, `NPM_*`, `OPERATION_*`, `PERFORMANCE_*`, `RESOURCE_*`, `RUNTIME_*`, `SECURITY_*`, `SERVER_*`, `TEST_*`, `UI_*`, `VALIDATION_*`, `WEBSOCKET_*`, `UNKNOWN_ERROR`

---

## Validation Helpers

All throw typed errors instead of raw Zod errors or plain `Error`.

| Function | What it does |
|---|---|
| `assert(value, schema?)` | Zod schema assertion — throws `AssertFailedError` on failure |
| `assertDefined(value)` | Throws `AssertDefinedFailedError` if null or undefined |
| `assertTruthy(value)` | Throws `AssertTruthyFailedError` if falsy |
| `assertFalsy(value)` | Throws `AssertFalsyFailedError` if truthy |
| `assertEmpty(value)` | Throws `AssertEmptyFailedError` if not empty (string/array/Set/Map/object) |
| `assertNotEmpty(value, min?, max?)` | Throws `AssertNotEmptyFailedError` or `AssertNotEmptyBoundsError` |
| `parse(value, schema)` | Zod parse — throws `ParseFailedError` (wraps ZodError) |
| `asyncParse(value, schema)` | Async version — throws `AsyncParseFailedError` |
| `validate(value, schema)` | Returns `boolean`, never throws |
| `asyncValidate(value, schema)` | Async boolean, never rejects |

---

## Changes from the Archive

| Archive (`error-alchemy`) | This implementation |
|---|---|
| `cause?: string` field | Renamed to `reason` (avoids `Error.cause` collision) |
| `popTranceStack` (typo) | Fixed to `popTraceStack` |
| `escapeIdentifierPart` using string `"///g"` | Fixed to regex `/\//g` |
| `uuid` package for IDs | `crypto.randomUUID()` — no extra dependency |
| `Object.hasOwnProperty.call` | `Object.hasOwn()` |
| Broken origin constructor (hasOwnProperty + err.cause) | Fixed to `instanceof TransmutedError` check |
| `simpleGetter` test artifact on TransmutedError | Removed |
| CommonJS, tsc, jest | Full ESM, tsup, vitest |
