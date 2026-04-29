import type { LogLevel, LogEntry } from "../types";
import { formatEntry } from "../formatters/formatEntry";
import type { Transport } from "./types";

const getConsoleFn = (level: LogLevel) => {
  if (level === "debug") return console.debug;
  if (level === "warn")  return console.warn;
  if (level === "error" || level === "fatal") return console.error;
  return console.info;
};

/**
 * Universal console transport — works in Node.js and browser environments.
 *
 * Routes each log level to the matching `console` method so that DevTools
 * and terminal filters work as expected. Uses chalk for formatting; chalk
 * automatically degrades to plain text in environments without ANSI support.
 */
export class ConsoleTransport implements Transport {
  write(entry: LogEntry): void {
    getConsoleFn(entry.level)(formatEntry(entry));
  }

  flushSync(): void {
    // No-op — console writes are synchronous.
  }

  destroy(): void {
    // No-op — nothing to close.
  }
}
