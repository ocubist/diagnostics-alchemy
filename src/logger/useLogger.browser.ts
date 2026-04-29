import { Logger } from "./Logger";
import type { LoggerOptions } from "./types";
import { BrowserTransport } from "./transports/BrowserTransport";

/**
 * Creates a root `Logger` backed by the browser transport (console + %c CSS colours).
 *
 * This is the browser-side entry point, resolved automatically via the package's
 * `"browser"` conditional export — consumers import `@ocubist/diagnostics-alchemy`
 * and get the right implementation without any manual switching.
 *
 * `logOutput` and `filePath` options are accepted but ignored — file writes and
 * stdout are Node.js-only concepts.
 *
 * @example
 * const log = useLogger({ where: "app", minLevel: "info" });
 * log.info("Page loaded");
 */
export const useLogger = (options: LoggerOptions = {}): Logger => {
  return new Logger(options, new BrowserTransport());
};
