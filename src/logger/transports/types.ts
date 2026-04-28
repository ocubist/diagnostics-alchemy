import type { LogEntry, OutputRestriction } from "../types";

/**
 * Minimal interface any transport must satisfy.
 * Transports are created once and shared across `specialize()` calls.
 */
export interface Transport {
  /** Write a log entry to this transport. */
  write(entry: LogEntry, logOutput: OutputRestriction): void;
  /** Flush any pending writes synchronously (called on process exit). */
  flushSync(): void;
}
