# file-stream-manager — Deep Analysis

**Package:** `@ocubist/file-stream-manager` v0.5.0  
**Status:** Never built, source complete  
**Verdict:** The concept is solid and necessary for the logger. Do not expose as a standalone package — internalize into alchemy-diagnostics.

---

## What It Does

Manages high-performance file write streams (via SonicBoom) with:

- **Shared stream access** — multiple callers can subscribe to the same file path
- **Reference counting** — the stream stays open as long as at least one subscriber exists
- **Graceful shutdown** — process signal handlers ensure buffers are flushed before exit
- **Write event notifications** — emits events when data is written (for the logger to react to)

---

## Architecture

### Core Concepts

**Stream Storage:** Open streams are stored in `singleton-manager` under the `file-stream-manager` namespace, keyed by `"stream: " + filePath`.

**Subscription Model:**

```
subscribeToFileStream(filePath)    → opens stream if not open; counter++
unsubscribeFromFileStream(filePath) → counter--; if counter == 0, close stream
```

This is the "reference counting" pattern. Three logger instances writing to the same file all subscribe — the stream stays open until all three unsubscribe.

**SonicBoom Configuration (defaults):**

```typescript
{
  dest: filePath,
  mkdir: true,           // auto-create directories
  sync: false,           // async writes for performance
  minLength: 4096,       // 4KB buffer before flushing
}
```

### Function Overview

| Function                              | Description                                          |
| ------------------------------------- | ---------------------------------------------------- |
| `openFileStream(filePath, options?)`  | Opens a SonicBoom stream, stores in singleton        |
| `closeFileStream(filePath)`           | Calls `flushSync()`, then `end()`, removes singleton |
| `writeFileStream(filePath, chunk)`    | Writes to stream, emits write event                  |
| `readFileStream(filePath)`            | Reads file with `fs.readFile` (NOT the stream!)      |
| `flushFileStream(filePath, cb?)`      | Calls `instance.flush(cb)`                           |
| `subscribeToFileStream(filePath)`     | Opens if needed + increments counter                 |
| `unsubscribeFromFileStream(filePath)` | Decrements counter, closes if 0                      |
| `isFileStreamOpen(filePath)`          | Boolean check                                        |
| `getFileStreamUsageCount(filePath)`   | Returns subscription counter                         |
| `getOpenFileStreams()`                | Returns all currently open file paths                |
| `forceCloseOfAllFileStreams()`        | Emergency close all streams                          |
| `useFileStreamManager(filePath)`      | Facade returning all operations for one path         |

### Process Signal Handling

On first `openFileStream`, process listeners are registered:

```typescript
process.once("SIGINT", runAllStreamCleanupCallbacks);
process.once("SIGTERM", runAllStreamCleanupCallbacks);
process.once("exit", runAllStreamCleanupCallbacks);
```

`runAllStreamCleanupCallbacks` calls `onExitCB` for every open stream. `onExitCB` retries `flushSync` up to 5 times with 1-second delays, then calls `instance.end()`.

On last `closeFileStream`, listeners are removed.

### Error Types

All crafted with `useErrorAlchemy`:

- `OpenFileStreamFailedError` — unexpected error opening stream
- `FileStreamToOpenAlreadyOpenError` — tried to open already-open stream
- `CloseFileStreamFailedError` — unexpected error closing stream
- `FileStreamNotFoundError` — stream not found on close
- `WriteFileStreamFailedError` — write failed
- `FileStreamToWriteDoesNotExistError` — write to non-open stream
- `ReadFileStreamFailedError` — file read failed
- `FileToReadDoesNotExistError` — file doesn't exist on read
- `FlushFileStreamFailedError` — flush failed
- `FileStreamToFlushDoesNotExistError` — flush on non-existent stream
- `SubscribeToFileStreamFailedError` — unexpected subscribe error
- `NoSubscriptionsFoundError` — counter was undefined on unsubscribe
- `FileStreamToUnsubscribeDoesNotExist` — stream not found on unsubscribe
- `FileStreamToReadCounterDoesNotExistError` — counter read on closed stream
- `FileStreamDoesNotProvideCounterError` — stream opened directly (not via subscribe)
- `ForceCloseOfAllFileStreamsFailedError` — force close failed

---

## Problems Found

### 1. Never built

No `dist/` directory. Can't be used.

### 2. `readFileStream` doesn't use the stream

```typescript
export const readFileStream = async (filePath: string): Promise<string> => {
  const fs = await import("fs/promises");
  const data = await fs.readFile(filePath, "utf8");
  return data;
};
```

This reads the file with `fs.readFile`, not the SonicBoom write stream. The naming `readFileStream` is misleading — it's really `readFile`. Also, SonicBoom is a **write-only** stream; you cannot read from it. Reading from a file being actively written to can produce incomplete data unless you flush first.

### 3. Bug in `forceCloseOfAllFileStreams`

```typescript
getAllFileStreamSingletonKeys().forEach(async (key) => {
  const instance = getSingleton<OpenFileStreamSingletonObject>(key).instance;
  instance.end();
  removeSingleton(key);
});
```

`forEach` with `async` doesn't await the promises. This is fire-and-forget — if any operation fails, the error is swallowed. Should use `for...of` with proper `await`.

Also, `instance.end()` is called without flushing first. SonicBoom's `end()` does flush, but the `onExitCB` pattern (which retries on flush failure) is bypassed here.

### 4. Bug in `openFileStream` catch block

```typescript
try {
  // ...
  if (allKeys.includes(key)) {
    throw new FileStreamToOpenAlreadyOpenError({...});  // ← thrown inside try
  }
  // ...
} catch (err) {
  throw new OpenFileStreamFailedError({                 // ← catches and wraps everything
    message: "Unexpected error opening the FileStream",
    origin: err,
  });
}
```

The `FileStreamToOpenAlreadyOpenError` is thrown inside the `try` block, so it gets caught and re-wrapped as `OpenFileStreamFailedError`. The specific error type is lost. The "already open" check should happen before the `try` block.

### 5. `getFileStreamUsageCount` falsy check bug

```typescript
if (!counter) {
  throw new FileStreamDoesNotProvideCounterError({...});
}
```

`!counter` is true when counter is `0`. But `0` is a valid counter value (just before cleanup). Should be `if (counter === undefined)`.

### 6. Write event depends on `event-handler`

```typescript
import { useEventHandler } from "@ocubist/event-handler";
export const writeFileStreamEventHandler = useEventHandler(
  config.writeEventName,
);
```

This creates a hard dependency on the event-handler package (which is also unbuilt). For alchemy-diagnostics, this coupling should be replaced with a simple callback pattern.

### 7. `useFileStreamManagerSingleton` is called at module level

```typescript
const { setSingletonIfNotExists, removeSingleton } =
  useFileStreamManagerSingleton();
```

This runs when the module is first imported, which is fine in CJS but can have side effects in ESM depending on evaluation order. In ESM, this needs careful consideration.

---

## What's Genuinely Good

- **Reference counting** for shared streams is the right pattern for a logger with multiple destinations or transports sharing a file.
- **Process signal handling** with `flushSync` retries is production-quality thinking — SonicBoom can lose data without this.
- **The `onExitCB` retry pattern** (5 attempts with 1-second delay) is robust.
- **Auto mkdir** via `createFileAndFolderIfDoesntExist` is a nice quality-of-life feature.
- **The subscription pattern** (`subscribe`/`unsubscribe`) cleanly separates "who opens the stream" from "who uses the stream" — multiple logger instances can share one stream without fighting over lifecycle.

---

## How It Fits Into the Logger

The intended architecture is:

1. Logger calls `subscribeToFileStream(filePath)` on initialization
2. Logger calls `writeFileStream(filePath, logLine)` for each log entry
3. Logger calls `unsubscribeFromFileStream(filePath)` on shutdown
4. If multiple logger instances write to the same file, reference counting keeps the stream open

This is exactly the right approach for a high-performance file logger using SonicBoom.

---

## Verdict for alchemy-diagnostics

**Internalize, don't expose as a package.** The file-stream-manager's API is only useful to the logger — there's no standalone reason to expose it publicly.

**Keep:**

- The reference-counting subscription model
- The SonicBoom integration with flush-on-exit
- Process signal handlers with retry
- The `openFileStream`/`closeFileStream`/`writeFileStream` core functions
- Auto-create file and directory

**Replace:**

- `singleton-manager` → module-level `Map<string, OpenStreamObject>`
- `event-handler` for write events → simple callback `Set` or Node's `EventEmitter`
- `readFileStream` → rename to `readFile` or remove entirely

**Fix:**

- The `try/catch` wrapping the "already open" check (move the check before the `try`)
- The `forceCloseOfAllFileStreams` `forEach(async ...)` bug
- The `!counter` falsy check → `counter === undefined`
