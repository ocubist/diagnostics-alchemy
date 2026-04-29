import { Logger } from "./Logger";
import type { LogLevel, LogEntry, LoggerOptions, Transport } from "./types";
import { formatEntry } from "./formatters/formatEntry";

// ─── Built-in console transport ───────────────────────────────────────────────

const getConsoleFn = (level: LogLevel) => {
  if (level === "debug") return console.debug;
  if (level === "warn")  return console.warn;
  if (level === "error" || level === "fatal") return console.error;
  return console.info;
};

const consoleTransport: Transport = (entry: LogEntry): void => {
  getConsoleFn(entry.level)(formatEntry(entry));
};

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates a root `Logger`.
 *
 * By default the built-in console transport is included; set `console: false`
 * to suppress it (e.g. when you only want file output).
 *
 * Add extra transports via `transports: [...]`. Each transport is a plain
 * function `(entry: LogEntry) => void` — for example:
 *
 * @example
 * import { createFileTransport } from "@ocubist/da-file-transport";
 *
 * const log = useLogger({
 *   where: "api",
 *   transports: [createFileTransport({ path: "logs/app.log" })],
 * });
 */
export const useLogger = (options: LoggerOptions = {}): Logger => {
  const transports: Transport[] = [];
  if (options.console !== false) transports.push(consoleTransport);
  if (options.transports) transports.push(...options.transports);
  return new Logger(options, transports);
};
