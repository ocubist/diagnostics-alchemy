/**
 * @ocubist/diagnostics-alchemy — browser build
 *
 * Resolved automatically by Vite / webpack / rollup via the `"browser"`
 * conditional export in package.json. Do not import this file directly.
 *
 * Identical public API to the Node build, except:
 * - `useLogger` uses `BrowserTransport` (console + %c CSS colours)
 * - `NodeTransport`, `sonic-boom`, `chalk`, and all Node built-ins are absent
 * - `logOutput` / `filePath` options are accepted but silently ignored
 *
 * @module diagnostics-alchemy/browser
 */

// ─── Error framework (fully browser-safe) ────────────────────────────────────
export * from "./errors/index";

// ─── Logger types ─────────────────────────────────────────────────────────────
export type {
  LogLevel,
  LogEntry,
  LogCallContext,
  LoggerOptions,
  RuntimeRestriction,
  OutputRestriction,
} from "./logger/types";
export { LOG_LEVEL_ORDER } from "./logger/types";

// ─── Logger utilities ─────────────────────────────────────────────────────────
export { checkRuntimeRestriction, isLevelEnabled } from "./logger/restrictions";
export { buildContextPath } from "./logger/context";
export { objectifyError } from "./logger/formatters/objectifyError";
export { levelCssStyles } from "./logger/formatters/levelColors";

// ─── Transport ────────────────────────────────────────────────────────────────
export type { Transport } from "./logger/transports/types";
export { BrowserTransport } from "./logger/transports/BrowserTransport";

// ─── Logger ───────────────────────────────────────────────────────────────────
export { Logger } from "./logger/Logger";
export { useLogger } from "./logger/useLogger.browser";
