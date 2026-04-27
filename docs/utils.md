# utils — Deep Analysis

**Package:** `@ocubist/utils` v0.6.2  
**Status:** Never built, incomplete exports, multiple debug statements left in  
**Verdict:** Mixed. Some parts are genuinely valuable (objectify, objectifyError). Most of the rest is either covered by better packages or trivially inlinable.

---

## What It Does

A collection of utility functions across 6 domains:

1. **ANSI** — detect and apply ANSI color codes
2. **Async** — `delay` helper
3. **Node environment detection** — `isNodeEnvironment`, `isServer`, `isDevice`, `isDevelopment`, `isProduction`
4. **Object serialization** — `objectify`, `objectifyError`
5. **UUID** — `createUUID`, `validateUUID`, `assertUUID`
6. **Types** — `ParamWithSchema`, `ParamWithOptionalSchema`

---

## Module-by-Module Analysis

### 1. `ansify` — ANSI Color Support

**What it does:**

- Re-exports `ansi-colors` as `ansify`
- Detects ANSI support on import (async, via `ansiInitializationPromise`)
- Disables `ansi-colors` if ANSI is not supported

**`asyncDetectANSISupport`:**
Uses `require('supports-color')` — a hard CJS `require()` call:

```typescript
if (typeof require !== "undefined") {
  supportsColorModule = require("supports-color");
}
```

**Critical bug for ESM:** `supports-color` v9+ is pure ESM. In a strict ESM environment, `require()` does not exist. This will silently fail (caught by `try/catch`), then fall through to env variable checks.

**Better approach:** Use `supports-color` with a proper ESM dynamic import:

```typescript
const { stdout } = await import("supports-color");
if (stdout) return true;
```

Or simply use `process.stdout.hasColors?.()` which is built into Node 11.13+.

**What to keep:** The concept of an `ansify` wrapper that handles ANSI capability detection is useful for the logger (for pretty dev-mode output). But the implementation needs to be rewritten for ESM.

**Are there better packages?** `chalk` v5 is pure ESM, handles color detection automatically, and is the industry standard. However, `ansi-colors` is lighter and has no-dep. For a logger, either works.

---

### 2. `delay`

```typescript
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
```

Single line. No reason to import a package for this. Keep as inline utility in any package that needs it.

---

### 3. `nodeDetector` — Environment Detection

**What it does:** 5 functions detecting Node.js environment state.

```typescript
isNodeEnvironment(); // process.versions.node exists
isServer(); // typeof window === "undefined"
isDevice(); // typeof window !== "undefined"
isDevelopment(); // process.env.NODE_ENV === "development"
isProduction(); // process.env.NODE_ENV === "production"
```

**Problems:**

- `isServer`, `isDevice`, `isDevelopment`, `isProduction` all log a `console.error` (not throw) if called outside Node. This means they silently fail in browser environments instead of being explicit.
- `isDevice()` checks `typeof window !== "undefined"` which is a browser check. The function is named "isDevice" but actually means "isBrowser". Naming is misleading.
- All of these are trivially replaceable with inline checks in any app.

**Are there better packages?** `std-env` (by UnJS) is ESM-first, covers all these and more (runtime detection, CI detection, etc.) with a clean API.

**Verdict:** Drop in favor of `std-env` or inline the 1-2 you need.

---

### 4. UUID Utilities

```typescript
createUUID(options?)    // uuidv4 wrapper
validateUUID(uuid)      // uuid.validate wrapper
assertUUID(uuid)        // throws AssertUUIDFailedError if invalid
```

**Problems:**

- All three are thin wrappers around the `uuid` package
- `createUUID` and `validateUUID` add essentially no value over importing `uuid` directly
- `assertUUID` is the only one worth keeping (throws a typed error)

**Better approach:** Replace `uuid` dependency with `crypto.randomUUID()` (Node 14.17+, browser-native, zero deps):

```typescript
export const createUUID = () => crypto.randomUUID();
```

For `validateUUID`, the regex check can be inlined or use `uuid` package's `validate`. `assertUUID` that throws a typed error is worth keeping.

---

### 5. `objectify` — Deep Any-Value Serializer

This is the most valuable and unique part of the package. It converts **any JavaScript value** to a plain, JSON-serializable object.

**What it handles:**

- Primitives → `{ val: primitive }`
- Plain objects → serialized with sorted keys, depth-limited, circular reference protected
- Arrays → elements processed recursively
- `Set` → converted to array, elements processed
- `Map` → converted to object (string keys only)
- `Error` → extracts `name`, `message`, `stack` (stack parsed into structured `StackLine[]`)
- Unsupported types (Symbol, Function) → ignored

**Key features:**

- **Deterministic key order** — keys sorted alphabetically (`sortKeys`)
- **Circular reference protection** — `WeakSet` tracking
- **Depth limiting** — default depth 5, returns `{ summary: "[Object]" }` / `{ summary: "[Error]" }` when exceeded
- **Stack parsing** — parses each stack line into `{ text, filePath, line, location }` structured objects
- **Compiler env filtering** — `compilerEnvKeyWords` list filters out internal/node/jest/webpack stack frames

**Problems:**

- `console.log("simplifyData", { val, depth })` in `simplifyData.ts` — active debug statement
- `console.log("objectifyError", ...)` in `objectify/helpers/objectifyError.ts` — active debug statement
- The function is exported as `simplifyData` but the tests reference it as `objectify` — the naming is inconsistent
- Depth is a plain number parameter, not a named option — less discoverable API

**Are there better packages?** Not really for this exact use case. `serialize-error` (sindresorhus) does Error→object, but doesn't handle the full type dispatch (Set, Map, circular refs, depth). `flatted` does circular-safe JSON. But nothing combines Error parsing + arbitrary type dispatch + depth limiting + deterministic keys in one package. This is genuinely novel.

---

### 6. `objectifyError` — Advanced Error Serializer

A separate, more powerful error-to-object converter. Built on top of `extractAllProperties` which walks the full prototype chain.

**What it does:**

```typescript
objectifyError(err, {
  cutCompilerStackTracing: true, // strip node/jest/webpack frames from stack
  ignoreFunctions: true, // omit function properties
  ignoreStack: false, // set true to replace stack with "[omitted]"
  ignoreUndefined: true, // omit undefined-valued properties
  maxDepth: 10, // max recursion depth for nested errors
});
```

**Key behaviors:**

- Walks the full prototype chain (gets inherited properties too)
- Handles circular references (`[Circular]`)
- Handles depth limit (`[MaxDepthExceeded]`)
- Auto-ignores stack for the `origin` property of `TransmutedError` (avoids stack duplication)
- Handles nested `Error` instances recursively

**Problems:**

- `extractAllProperties.ts` has 5+ active `console.log` calls — all debug statements left in
- Walking the full prototype chain can be very slow for deep class hierarchies
- The two implementations (`objectify/helpers/objectifyError.ts` vs `objectifyError/objectifyError.ts`) have diverged and are not clearly differentiated

**Are there better packages?** `serialize-error` from sindresorhus handles the basic case but doesn't do prototype chain walking or the custom filtering options. For integration with `TransmutedError`, this custom implementation makes sense.

---

### 7. `ParamWithSchema` Types

```typescript
interface ParamWithOptionalSchema<T> {
  val: T;
  schema?: ZodSchema<T>;
}
interface ParamWithSchema<T> {
  val: T;
  schema: ZodSchema<T>;
}
```

Used by `http-request-handler` for typed validation. Straightforward. Worth keeping if the http request handler concept carries forward.

---

## Critical Export Bug

`objectify` and `objectifyError` are **not exported** from `src/index.ts`. The current `index.ts` does not include any exports from `./objetFunctions/**`. This means anyone importing `@ocubist/utils` cannot access these functions despite them being the most valuable part of the package.

---

## Debug Statements Count

| File                                             | Debug statements   |
| ------------------------------------------------ | ------------------ |
| `simplifyData.ts`                                | 1 (`console.log`)  |
| `objectify/helpers/objectifyError.ts`            | 1 (`console.log`)  |
| `objectifyError/helpers/extractAllProperties.ts` | 5+ (`console.log`) |

These are all production code paths and would spam output in any real usage.

---

## Verdict for alchemy-diagnostics

**Keep and clean up:**

- `objectify` / `simplifyData` — rename to `objectify`, remove debug logs, add to exports
- `objectifyError` — remove debug logs, keep the advanced version (`objectifyError/objectifyError.ts`)
- `assertUUID` / `createUUID` pattern — keep as internal utility, replace `uuid` dep with `crypto.randomUUID()`

**Drop or replace:**

- `ansify` → use `chalk` v5 or rewrite for ESM with proper dynamic import
- `asyncDetectANSISupport` → rewrite using `process.stdout.hasColors?.()` or dynamic import of `supports-color`
- `delay` → inline wherever needed
- `isNodeEnvironment`/`isServer`/`isDevelopment`/`isProduction` → use `std-env` or inline
- `validateUUID` / `createUUID` wrappers → inline or use `crypto.randomUUID()`

**Fix:**

- Remove all `console.log` debug statements
- Unify the two `objectifyError` implementations (keep the more capable one)
- Add `objectify` and `objectifyError` to `index.ts` exports
- Rename `simplifyData` → `objectify` consistently
