# event-handler — Deep Analysis

**Package:** `@ocubist/event-handler` v0.2.3  
**Status:** Never built, source complete  
**Verdict:** Drop. This is a redundant wrapper over Node's built-in `EventEmitter`.

---

## What It Does

Wraps Node.js's `EventEmitter` with a cleaner API, using `singleton-manager` to maintain a single global emitter instance.

```typescript
const { emit, on, once, off, listenerCount } = useEventHandler("log:write");

// Subscribe
on<{ filePath: string; chunk: string }>((data) => {
  console.log("wrote to", data.filePath);
});

// Emit
emit({ filePath: "./app.log", chunk: "hello\n" });

// Get all registered event names
const events = getAllEvents(); // ["log:write", ...]
```

---

## Architecture

### Global Singleton Pattern

The package stores two things in `singleton-manager` under the `@ocubist` namespace:

1. `global-event-emitter` — a single shared `EventEmitter` instance
2. `global-event-emitter-events` — a `Set<string>` of all event names that have been used

### Prefix Trick

Instead of using a single event name, the package creates two prefixed event names per logical event:

- `on:eventName` — used for persistent listeners
- `once:eventName` — used for one-time listeners

This is a manual reimplementation of behavior that `EventEmitter` already provides natively.

### `useEventHandler(eventName)` API

| Method                 | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `emit(data?)`          | Emits on both `on:eventName` and `once:eventName`   |
| `on(listener)`         | Registers a persistent listener; deduplicates       |
| `once(listener)`       | Registers a one-time listener; deduplicates         |
| `off(listener)`        | Removes listener from both prefixed events          |
| `listenerCount()`      | Sum of both prefixed event listener counts          |
| `getListeners()`       | Combined array of all listeners                     |
| `removeAllListeners()` | Removes all listeners and cleans the event name set |

### `getAllEvents()`

Returns all event names that have ever been registered (from the `Set`).

---

## Problems

### 1. Redundancy — Node's `EventEmitter` already does this

The entire API (`on`, `once`, `off`, `emit`, `listenerCount`, `getListeners`) is available directly on `EventEmitter`. The manual prefix trick is needed only because the package reimplements `once` behavior manually instead of using the native `emitter.once()`.

The native `EventEmitter.once()` already removes the listener after the first call. The package's approach adds complexity without benefit.

### 2. Global single `EventEmitter` for all events

All events from all callers share the same `EventEmitter` instance. This means:

- The default max listener limit (10) is shared across ALL event names
- There's no isolation between unrelated event channels
- In tests, you can't easily create fresh emitters per test

### 3. Deduplication logic is fragile

```typescript
const on = <T = any>(listener: EventListener<T>) => {
  if (!eventEmitter.listeners(`on:${eventName}`).includes(listener)) {
    if (eventEmitter.listeners(`once:${eventName}`).includes(listener)) {
      eventEmitter.off(`once:${eventName}`, listener);
    }
    eventEmitter.on(`on:${eventName}`, listener);
  }
};
```

This deduplication relies on reference equality of functions. Anonymous arrow functions will always be considered new, so deduplication won't work for them.

### 4. Never built

No `dist/` directory. Can't be imported.

### 5. `emit` adds the event name AFTER emitting

```typescript
const emit = <T = any>(data?: T) => {
  eventEmitter.emit(`on:${eventName}`, data);
  eventEmitter.emit(`once:${eventName}`, data);
  const eventNames = getEventNamesMap();
  eventNames.add(eventName); // ← this runs after emitting, not before
};
```

This means the first emit won't be in `getAllEvents()` until after it completes. Minor, but inconsistent.

---

## Are There Better Options?

### Option 1: Node's built-in `EventEmitter` (zero deps)

```typescript
import { EventEmitter } from "node:events";
const emitter = new EventEmitter();
emitter.on("log:write", (data) => { ... });
emitter.emit("log:write", { filePath: "./app.log" });
```

This is what `event-handler` wraps. Just use it directly.

### Option 2: `eventemitter3` (npm package)

A popular (120M+ weekly downloads), high-performance EventEmitter compatible with browsers and Node.js. ESM-compatible. Mostly drop-in replacement for Node's EventEmitter. Slightly faster and with better browser support.

```typescript
import EventEmitter from "eventemitter3";
const emitter = new EventEmitter<{
  "log:write": [{ filePath: string; chunk: string }];
}>();
```

### Option 3: Simple callback pattern

For the logger use case (subscribing to write events from file-stream-manager), a simple callback array is sufficient:

```typescript
const writeCallbacks = new Set<(data: WriteEvent) => void>();
export const onWrite = (cb: (data: WriteEvent) => void) => {
  writeCallbacks.add(cb);
};
export const offWrite = (cb: (data: WriteEvent) => void) => {
  writeCallbacks.delete(cb);
};
```

---

## Verdict for alchemy-diagnostics

**Drop the package entirely.**

In the new `alchemy-diagnostics` package, any internal event communication should use either:

- Node's built-in `EventEmitter` directly (for anything complex)
- Simple module-level callback sets (for the single use case of write events in file-stream-manager)

The `getAllEvents()` utility is a nice addition; if needed, it can be replicated with a `Set` in 3 lines.
