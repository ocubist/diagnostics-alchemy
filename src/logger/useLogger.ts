import { Logger } from "./Logger";
import type { LoggerOptions } from "./types";
import { NodeTransport } from "./transports/NodeTransport";

/**
 * Creates a root `Logger` backed by the Node.js transport (stdout + optional file).
 *
 * This is the server-side entry point. In browser contexts, the package's
 * conditional export automatically resolves to `useLogger.browser.ts` instead,
 * which uses `BrowserTransport` — no manual switching needed.
 *
 * @example
 * const log = useLogger({ where: "app", minLevel: "info" });
 * log.info("Server started");
 *
 * const authLog = log.specialize({ where: "auth", why: "user-session" });
 * authLog.warn("Token nearing expiry", { payload: { userId: "u123" } });
 */
export const useLogger = (options: LoggerOptions = {}): Logger => {
  const transport = new NodeTransport(options.filePath, options.logOutput ?? "stdOut");
  return new Logger(options, transport);
};
