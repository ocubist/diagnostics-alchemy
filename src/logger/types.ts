/** The five log levels in ascending severity order. */
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

/** Ordered severity map — used to filter by minLevel. */
export const LOG_LEVEL_ORDER: Readonly<Record<LogLevel, number>> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

/**
 * A structured log entry — the universal record passed to transports and callbacks.
 */
export interface LogEntry {
  level: LogLevel;
  time: number;
  message: string;
  where?: string;
  why?: string;
  payload?: Record<string, unknown>;
}

/**
 * Per-call context that can be attached at individual log-call sites.
 * `where` and `why` each add one more dot-segment to the logger's existing path.
 */
export interface LogCallContext {
  where?: string;
  why?: string;
  payload?: Record<string, unknown>;
}

/**
 * Options accepted by `useLogger` (and `Logger.specialize`).
 */
export interface LoggerOptions {
  /**
   * Where context segment — a word describing the location/module.
   * Dot-appended to the parent logger's `where` path.
   */
  where?: string;

  /**
   * Why context segment — a word describing the intent/operation.
   * Dot-appended to the parent logger's `why` path.
   */
  why?: string;

  /** Minimum log level to emit. Defaults to "debug". */
  minLevel?: LogLevel;

  /**
   * Array of callback functions called with every emitted LogEntry.
   * Useful for remote sinks, metrics, or custom alerting.
   * Use `@ocubist/da-file-transport` for file output.
   */
  callbackFunctions?: ((entry: LogEntry) => void)[];
}

/**
 * Returns `true` when `level` is at or above `minLevel`.
 */
export const isLevelEnabled = (level: LogLevel, minLevel: LogLevel): boolean =>
  LOG_LEVEL_ORDER[level] >= LOG_LEVEL_ORDER[minLevel];
