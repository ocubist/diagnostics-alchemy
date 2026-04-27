# error-alchemy — Deep Analysis

**Package:** `@ocubist/error-alchemy` v0.9.2  
**Status:** Built, published, solid foundation  
**Verdict:** The best package in the monorepo. Keep and modernize.

---

## What It Does

error-alchemy is a structured error framework for TypeScript. It provides:

1. **A rich base error class** (`TransmutedError`) that extends `Error` with typed metadata
2. **Two semantic subclasses** (`MysticError`, `SynthesizedError`) for categorizing error state
3. **Factory functions** for creating custom typed error classes at definition time
4. **A transmuter system** for converting foreign errors (Axios, Zod, etc.) into typed errors
5. **A synthesizer system** for chaining transmuters into a middleware pipeline
6. **A resolver system** for routing errors to handlers at the boundary
7. **Zod-based validation helpers** that throw typed errors on failure

---

## Architecture

### The Error Hierarchy

```
Error (native)
└── TransmutedError          ← enriched base class
    ├── MysticError           ← semantic: unhandled / unknown origin
    └── SynthesizedError      ← semantic: identified / ready to handle
```

**TransmutedError** enriches `Error` with:

- `name` — overridden, no longer generic "Error"
- `severity` — `unimportant | minor | unexpected | critical | fatal | catastrophic`
- `errorCode` — one of 70+ predefined codes (e.g. `DATA_INTEGRITY_VIOLATION`, `HTTP_NOT_FOUND`)
- `module` — the package/system where the error originates
- `context` — the function/component where the error originates
- `cause` — human-readable description of _why_ this error exists (distinct from the error message)
- `payload` — arbitrary `Record<string, unknown>` for structured debugging data
- `origin` — the original error that was caught and wrapped
- `instanceUuid` — unique UUID per error instance
- `identifier` getter — composed string `name/module/context/errorCode`
- `severityDescription` getter — human-readable severity label

**MysticError** — identical to `TransmutedError`, semantic label for "this error hasn't been handled yet, origin unknown."

**SynthesizedError** — identical to `TransmutedError`, semantic label for "this error is identified and can be caught by type."

### The Crafting System

Instead of manually subclassing, you use factory functions:

```typescript
// Define once, at module level
const { craftMysticError } = useErrorAlchemy("my-module", "my-context");

export const FileNotFoundError = craftMysticError({
  name: "FileNotFoundError",
  cause: "The requested file does not exist",
  errorCode: "FILE_NOT_FOUND",
  severity: "critical",
});

// Use at runtime
throw new FileNotFoundError({ message: `File not found: ${path}`, payload: { path } });

// Check type
if (FileNotFoundError.compare(err)) { ... }
```

Each crafted class:

- Inherits from `MysticError` or `SynthesizedError`
- Has a `dynamicClassUuid` for class-identity comparison
- Has a static `compare(err)` method as a safe `instanceof` alternative
- Has `module` and `context` pre-filled from `useErrorAlchemy`

### `useErrorAlchemy(module, context)`

The main entry point. Returns all crafting functions pre-bound to the `module`/`context` pair:

- `craftMysticError`
- `craftSynthesizedError`
- `craftErrorTransmuter`
- `craftErrorSynthesizer`
- `craftErrorLogger`
- `craftErrorResolverMap`
- `craftErrorResolver`

### The Transmuter System

A **Transmuter** converts an unknown error into a typed one:

```typescript
// Define
const axiosTransmuter = craftErrorTransmuter(
  (err) => axios.isAxiosError(err), // detector: is this my type?
  (err: AxiosError) =>
    new MyHttpError({
      // transmuter: convert it
      message: err.message,
      origin: err,
    }),
);

// Use
const typed = axiosTransmuter.execute(unknownError); // runs detector, then transmuter if match
```

### The Synthesizer System

A **Synthesizer** chains multiple transmuters. It tries each one until a match:

```typescript
const synthesizer = craftErrorSynthesizer([
  axiosTransmuter,
  zodTransmuter,
  myCustomTransmuter,
]);

const typedError = synthesizer.synthesize(unknownError);
```

### The Resolver System

A **Resolver** handles errors at the boundary by routing to typed handlers:

```typescript
const resolver = craftErrorResolver({
  synthesizer,
  logger: (err) => console.error(err),
  errorResolverMap: craftErrorResolverMap(
    [NotFoundError, (err) => res.status(404).json({ error: err.message })],
    [AuthError, (err) => res.status(401).json({ error: err.message })],
  ),
  defaultResolver: (err) => res.status(500).json({ error: "Internal error" }),
});

// In a catch block:
resolver(err);
```

### The Logger Dispatcher

```typescript
const logger = craftErrorLogger({
  default: (err) => console.error(err),
  critical: (err) => alerting.send(err),
  fatal: (err) => process.exit(1),
});

logger(anyError); // dispatches based on severity
```

### Severity Levels

| Level          | Meaning                                 |
| -------------- | --------------------------------------- |
| `unimportant`  | Expected, informational, can be ignored |
| `minor`        | Small issue, no action required         |
| `unexpected`   | Should not happen but is not fatal      |
| `critical`     | Requires immediate attention            |
| `fatal`        | Application cannot continue normally    |
| `catastrophic` | System failure, data loss possible      |

### Error Codes

70+ predefined codes covering: AUTH, BUSINESS, CLIENT, CONFIG, DATA, DB, DEPLOYMENT, ENV, FILE, HTTP, MONITORING, NETWORK, NPM, OPERATION, PERFORMANCE, RESOURCE, RUNTIME, SECURITY, SERVER, TEST, UI, VALIDATION, WEBSOCKET, UNKNOWN.

### Validation Helpers

All throw typed errors (`AssertFailedError`, `ParseFailedError`) instead of raw Zod errors:

| Function                       | Behavior                                    |
| ------------------------------ | ------------------------------------------- |
| `assert(value, schema)`        | Asserts value matches schema (narrows type) |
| `assertDefined(value)`         | Throws if null/undefined                    |
| `assertTruthy(value)`          | Throws if falsy                             |
| `assertFalsy(value)`           | Throws if truthy                            |
| `assertEmpty(value)`           | Throws if not empty                         |
| `assertNotEmpty(value)`        | Throws if empty                             |
| `parse(value, schema)`         | Parses and throws typed error on failure    |
| `asyncParse(value, schema)`    | Async version                               |
| `validate(value, schema)`      | Returns boolean                             |
| `asyncValidate(value, schema)` | Async boolean                               |

---

## What's Genuinely Good

- The `craftMysticError`/`craftSynthesizedError` factory pattern is ergonomic and elegant — you get a proper class with `compare()`, strong types, and pre-filled metadata in one call.
- `useErrorAlchemy(module, context)` as a DI-lite pattern means every error in a module is automatically tagged — great for debugging.
- The transmuter pipeline pattern is clean and composable.
- 70+ error codes as a standardized vocabulary is one of the most practically useful parts of the whole monorepo.
- 6 severity levels map well to real-world alerting tiers.
- The resolver/resolverMap pattern nicely separates error handling from error throwing.

---

## Problems Found

### 1. Leftover test artifact in `TransmutedError`

```typescript
get simpleGetter() {
  return "works";  // ← this should not exist in production code
}
```

Remove it.

### 2. `cause` naming collision with native `Error.cause` (ES2022)

`TransmutedError` defines `cause?: string` which is a human-readable description like "This function requires a Node.js environment". But native `Error.cause` (ES2022) is also a thing — it's the original error that was the cause. This creates confusion and potential serialization issues. The field should be renamed to something like `causeDescription` or `errorCause`.

### 3. Suspicious constructor logic for `origin`

```typescript
if (props.origin instanceof Error) {
  const err = props.origin;
  // @ts-ignore
  if (err.hasOwnProperty("origin") && typeof err.cause === "string") {
    // @ts-ignore
    originProps.cause = err.cause; // ← uses err.cause but checks err.origin
  }
}
```

This checks `err.hasOwnProperty("origin")` but then reads `err.cause`. This looks like a bug — it checks one property to decide whether to read another. The intent seems to be: "if the origin is a TransmutedError, inherit its cause" — but this should just be `if (props.origin instanceof TransmutedError)`.

### 4. `Object.hasOwnProperty.call` pattern

Used in several places (`SingletonHold`, `TransmutedError` constructor). Should use `Object.hasOwn()` (ES2022) or at minimum `Object.prototype.hasOwnProperty.call()`.

### 5. Typo in utility function name

```typescript
export const popTranceStack = ...  // should be popTraceStack
```

### 6. CJS-only, no `exports` field

```json
"main": "dist/index.js",
"types": "dist/index.d.ts",
```

No `"type": "module"`, no `"exports"` field. For a new ESM package this needs to be:

```json
"type": "module",
"exports": {
  ".": {
    "import": "./dist/index.js",
    "types": "./dist/index.d.ts"
  }
}
```

And the build needs to output `.js` files with ESM syntax (not CommonJS).

### 7. Build tooling is outdated

Uses `jest` + `ts-jest` for testing and plain `tsc` for building. For a new ESM package:

- Testing: switch to `vitest` (ESM-native, zero config)
- Building: switch to `tsup` or `unbuild` (handles ESM + declaration files cleanly)

### 8. `uuid` v10 is fine but unnecessary

`uuid` is used only to generate instance UUIDs and dynamic class UUIDs. You could replace this with `crypto.randomUUID()` (Node 14.17+, browser-native), eliminating a dependency.

---

## What to Carry Forward into alchemy-diagnostics

Almost everything. The core architecture is sound:

- `TransmutedError` base class (with `cause` rename fix, remove `simpleGetter`)
- `MysticError` / `SynthesizedError` distinction
- `craftMysticError` / `craftSynthesizedError` factory pattern with `compare()`
- `useErrorAlchemy(module, context)` factory
- Transmuter / Synthesizer systems
- Resolver / ResolverMap / ErrorLogger
- Severity levels (all 6)
- ErrorCode vocabulary (all 70+)
- Validation helpers (`assert`, `parse`, `validate`, `assertDefined`, etc.)

What to modernize:

- Full ESM build
- `vitest` instead of `jest`
- `tsup` for building
- `crypto.randomUUID()` instead of `uuid` package
- Fix `cause` → `causeDescription`
- Fix origin constructor logic
- Remove `simpleGetter`
- Fix `popTranceStack` typo → `popTraceStack`
- Add `Object.hasOwn()` usage
