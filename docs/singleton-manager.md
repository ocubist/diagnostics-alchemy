# singleton-manager — Deep Analysis

**Package:** `@ocubist/singleton-manager` v0.6.1  
**Status:** Built, solid, but architecturally questionable in ESM  
**Verdict:** Internalize the concept; do not carry forward as a standalone package.

---

## What It Does

Provides a namespaced singleton registry. You call `useSingleton(name)` to get a set of functions scoped to a named namespace. Within that namespace, you can store and retrieve arbitrary values by key.

```typescript
const { setSingletonIfNotExists, getSingleton } = useSingleton(
  "file-stream-manager",
);

// Store once, retrieve anywhere
setSingletonIfNotExists(
  "my-stream",
  () => new SonicBoom({ dest: "./log.txt" }),
);
const stream = getSingleton<SonicBoom>("my-stream");
```

---

## Architecture

### `SingletonHold` (private)

A module-level class holding a `Record<string, SingletonManager>`. Each namespace gets its own `SingletonManager` instance. The `SingletonHold` is a static class used internally — it's never exported.

### `SingletonManager` (private)

A simple `Record<string, unknown>` store with typed get/set/has/remove/clear/getAllKeys methods. Nothing surprising here.

### `useSingleton(name)` (public)

The main API. Returns a `SingletonFunctions` interface with:

| Method                                      | Description                                                     |
| ------------------------------------------- | --------------------------------------------------------------- |
| `getSingleton<T>(name)`                     | Retrieve or throw `SingletonDoesNotExistError`                  |
| `setSingleton<T>(name, value, force?)`      | Store; throws `SingletonAlreadyExistsError` unless `force=true` |
| `setSingletonIfNotExists<T>(name, factory)` | Store if absent using a factory function, return the value      |
| `hasSingleton(name)`                        | Boolean check                                                   |
| `updateSingleton<T>(name, value)`           | Update existing or throw `SingletonDoesNotExistError`           |
| `removeSingleton(name)`                     | Delete if exists                                                |
| `registerInstanceAsSingleton(instance)`     | Stores with a random UUID key, returns the UUID                 |
| `unregisterInstanceAsSingleton(id)`         | Removes by UUID                                                 |
| `clearSingletons('CONFIRM')`                | Clears all singletons in namespace (requires 'CONFIRM' string)  |
| `getAllSingletonKeys()`                     | Returns all key names in the namespace                          |

### Error Types

All errors are crafted with `useErrorAlchemy`:

- `SingletonDoesNotExistError` — thrown on `getSingleton`/`updateSingleton` when key missing
- `SingletonAlreadyExistsError` — thrown on `setSingleton` when key exists and `force=false`
- `SingletonClearConfirmationError` — thrown when `clearSingletons` is called without `'CONFIRM'`

---

## What's Used For (in this monorepo)

1. **`file-stream-manager`** — stores open SonicBoom instances keyed by file path
2. **`event-handler`** — stores the global `EventEmitter` and event name `Set`
3. **`logger`** — would use it for logger instances

---

## Problems

### 1. ESM modules ARE singletons

The primary use case for a singleton manager is ensuring only one instance of something exists. In ESM, **module-level variables are singletons by nature** — the module is evaluated once and cached. So:

```typescript
// This IS a singleton in ESM — no manager needed
export const db = new DatabaseConnection();
export const eventEmitter = new EventEmitter();
```

The singleton-manager adds value only in specific scenarios:

- When you need **runtime-keyed storage** (dynamic key names not known at compile time)
- When you need singletons that can be **cleared or swapped** (e.g., in tests)
- When you need **cross-module storage** without circular imports

For the file-stream-manager's use case (tracking open streams by file path), a simple module-level `Map<string, StreamObject>` achieves the same goal without the overhead.

### 2. `Object.hasOwnProperty.call` should be `Object.hasOwn()`

```typescript
if (!Object.hasOwnProperty.call(SingletonHold.singletons, name)) {
```

Should be:

```typescript
if (!Object.hasOwn(SingletonHold.singletons, name)) {
```

### 3. The `'CONFIRM'` clear pattern is awkward

```typescript
clearSingletons("CONFIRM");
```

This string confirmation pattern is a safety guard but adds no real protection (you can still accidentally hardcode 'CONFIRM'). A better approach is to simply not expose `clear` in production APIs, or use a test-only utility.

### 4. CJS-only, no `exports` field

Same as error-alchemy — needs a full ESM migration.

### 5. Depends on `@ocubist/utils` only for `createUUID`

The entire `@ocubist/utils` dependency exists only to call `createUUID()` in `registerInstanceAsSingleton`. This can be replaced with `crypto.randomUUID()`.

---

## Are There Better Packages?

For **dependency injection**: `tsyringe`, `inversify`, `awilix` — these are far more capable but also heavier. They support constructor injection, lifetime management, scopes, etc.

For **the specific use case** of "runtime-keyed object registry with lifecycle management": there's no standard package for this, but it's easily replaced with a plain `Map`.

For **simple module singletons**: just use ESM module cache.

---

## Verdict for alchemy-diagnostics

**Do not carry forward as a package.** Instead:

- For the logger: use module-level `Map<string, LoggerInstance>` to track instances by name
- For the file-stream-manager internals: use module-level `Map<string, StreamObject>`
- If the runtime-keyed registry concept is useful, inline it as a small internal utility (10 lines) rather than a full package

The `SingletonDoesNotExistError` / `SingletonAlreadyExistsError` error types are worth keeping — they express intent clearly. But they can live in the logger package directly.
