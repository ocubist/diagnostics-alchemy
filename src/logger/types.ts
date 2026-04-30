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
 * A structured log entry — the universal record passed to transports.
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
 * A transport — receives emitted `LogEntry` objects and writes them somewhere.
 *
 * `minLevel` filters which entries reach `write()`. Entries below the threshold
 * are silently skipped for this transport only. Defaults to `"debug"`.
 *
 * @example
 * const myTransport: Transport = {
 *   write: (entry) => sendToServer(entry),
 *   minLevel: "warn",
 * };
 */
export interface Transport {
  write(entry: LogEntry): void;
  minLevel?: LogLevel;
}

/**
 * Configuration for the built-in console transport.
 * All fields are optional — unset fields fall back to their defaults.
 */
export interface ConsoleTransportConfig {
  /**
   * Include the built-in console transport. Defaults to `true`.
   * Set to `false` for file-only setups.
   */
  enableTransport?: boolean;

  /**
   * IANA timezone name used when formatting timestamps.
   * Defaults to `"UTC"`.
   *
   * @example "Europe/Berlin", "America/New_York"
   */
  timezone?: string;

  /**
   * Minimum log level for console output. Defaults to `"debug"`.
   * Entries below this level are not printed to the console.
   */
  minLevel?: LogLevel;
}

/**
 * The plain sub-logger exposed as `logger.plain`.
 * Each method prints the raw string directly to the matching `console.*` method.
 * No timestamp, level badge, context, colouring, or transport filtering —
 * always fires regardless of any minLevel setting.
 */
export interface PlainLogger {
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  fatal(message: string): void;
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

  /**
   * Built-in console transport configuration.
   * Only has effect when passed to `useLogger()` — ignored in `specialize()`.
   */
  console?: ConsoleTransportConfig;

  /**
   * Additional transports — each receives every `LogEntry` that passes its
   * own `minLevel` threshold.
   *
   * @example
   * import { createFileTransport } from "@ocubist/da-file-transport";
   * useLogger({ transports: [createFileTransport({ path: "logs/app.log" })] });
   */
  transports?: Transport[];
}

/**
 * Returns `true` when `level` is at or above `minLevel`.
 */
export const isLevelEnabled = (level: LogLevel, minLevel: LogLevel): boolean =>
  LOG_LEVEL_ORDER[level] >= LOG_LEVEL_ORDER[minLevel];
