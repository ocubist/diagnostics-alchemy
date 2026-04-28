import { Logger } from "./Logger";
import type { LoggerOptions } from "./types";
import { NodeTransport } from "./transports/NodeTransport";
import { BrowserTransport } from "./transports/BrowserTransport";
import { isServerEnvironment } from "./restrictions";

/**
 * Creates a root `Logger` with the given options.
 *
 * The transport (stdout + optional file stream) is created once here and
 * shared with all loggers derived from `specialize()`.
 *
 * @example
 * const log = useLogger({ where: "app", minLevel: "info" });
 * log.info("Server started");
 *
 * const authLog = log.specialize({ where: "auth", why: "user-session" });
 * authLog.warn("Token nearing expiry", { payload: { userId: "u123" } });
 */
export const useLogger = (options: LoggerOptions = {}): Logger => {
  const transport = isServerEnvironment()
    ? new NodeTransport(options.filePath, options.logOutput ?? "stdOut")
    : new BrowserTransport();

  return new Logger(options, transport);
};
