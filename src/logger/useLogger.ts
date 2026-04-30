import { Logger } from "./Logger";
import type { ConsoleTransportConfig, LogLevel, LogEntry, LoggerOptions, Transport } from "./types";
import { formatEntry } from "./formatters/formatEntry";

// ─── Built-in console transport ───────────────────────────────────────────────

const DEFAULT_CONSOLE_CONFIG: Required<ConsoleTransportConfig> = {
  enableTransport: true,
  timezone: "UTC",
  minLevel: "debug",
};

const getConsoleFn = (level: LogLevel) => {
  if (level === "debug") return console.debug;
  if (level === "warn")  return console.warn;
  if (level === "error" || level === "fatal") return console.error;
  return console.info;
};

const createConsoleTransport = (config: Required<ConsoleTransportConfig>): Transport => ({
  write: (entry: LogEntry): void => {
    getConsoleFn(entry.level)(formatEntry(entry, config.timezone));
  },
  minLevel: config.minLevel,
});

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates a root `Logger`.
 *
 * The built-in console transport is included by default. Configure it via the
 * `console` option — or disable it entirely with `enableTransport: false`.
 *
 * Each additional transport in `transports` manages its own `minLevel`.
 *
 * @example
 * import { createFileTransport } from "@ocubist/da-file-transport";
 *
 * const log = useLogger({
 *   where: "api",
 *   console: { timezone: "Europe/Berlin", minLevel: "debug" },
 *   transports: [createFileTransport({ path: "logs/app.log" })],
 * });
 */
export const useLogger = (options: LoggerOptions = {}): Logger => {
  const consoleCfg: Required<ConsoleTransportConfig> = {
    ...DEFAULT_CONSOLE_CONFIG,
    ...options.console,
  };

  const transports: Transport[] = [];
  if (consoleCfg.enableTransport) {
    transports.push(createConsoleTransport(consoleCfg));
  }
  if (options.transports) transports.push(...options.transports);

  return new Logger(options, transports);
};
