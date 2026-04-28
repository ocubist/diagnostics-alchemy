import type { LogEntry } from "../types";
import { levelCssStyles } from "../formatters/levelColors";
import type { Transport } from "./types";

// Console method per log level
const consoleMethods = {
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
  fatal: console.error,
} as const;

/**
 * Browser transport — writes to the console using `%c` CSS directives
 * so that log levels appear color-coded in DevTools.
 *
 * `logOutput` and `filePath` are intentionally ignored in the browser;
 * SonicBoom and file writes are Node.js-only.
 */
export class BrowserTransport implements Transport {
  write(entry: LogEntry): void {
    const consoleFn = consoleMethods[entry.level];
    const levelLabel = entry.level.toUpperCase().padEnd(5);
    const wherePart = entry.where ? `[${entry.where}]` : "";
    const whyPart = entry.why ? `(${entry.why})` : "";
    const context = [wherePart, whyPart].filter(Boolean).join(" ");
    const prefix = context ? `${context} ` : "";

    if (entry.payload && Object.keys(entry.payload).length > 0) {
      consoleFn(
        `%c${levelLabel}%c ${prefix}${entry.message}`,
        levelCssStyles[entry.level],
        "",
        entry.payload
      );
    } else {
      consoleFn(
        `%c${levelLabel}%c ${prefix}${entry.message}`,
        levelCssStyles[entry.level],
        ""
      );
    }
  }

  flushSync(): void {
    // No-op — console writes are synchronous.
  }
}
