import type { LogLevel, LogEntry } from "../types";
import { levelCssStyles } from "../formatters/levelColors";
import type { Transport } from "./types";

/**
 * Resolves the console method for a given level at call time (not at import time).
 * This is intentional — it allows `vi.spyOn(console, "info")` etc. to intercept
 * calls in tests, which wouldn't work if the references were cached at module load.
 */
const getConsoleFn = (level: LogLevel) => {
  if (level === "debug") return console.debug;
  if (level === "warn") return console.warn;
  if (level === "error" || level === "fatal") return console.error;
  return console.info;
};

/**
 * Browser transport — writes to the console using `%c` CSS directives
 * so that log levels appear color-coded in DevTools.
 *
 * `logOutput` and `filePath` are intentionally ignored in the browser;
 * SonicBoom and file writes are Node.js-only.
 */
export class BrowserTransport implements Transport {
  write(entry: LogEntry): void {
    const consoleFn = getConsoleFn(entry.level);
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

  destroy(): void {
    // No-op — nothing to close.
  }
}
