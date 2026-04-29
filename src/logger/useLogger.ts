import { Logger } from "./Logger";
import type { LoggerOptions } from "./types";
import { ConsoleTransport } from "./transports/ConsoleTransport";

/**
 * Creates a root `Logger` backed by the universal console transport.
 *
 * Works in Node.js and browser environments without any configuration.
 * For file output, add `@ocubist/da-file-transport` as a callback:
 *
 * @example
 * import { createFileTransport } from "@ocubist/da-file-transport";
 *
 * const log = useLogger({
 *   where: "api",
 *   callbackFunctions: [createFileTransport({ path: "logs/app.log" })],
 * });
 */
export const useLogger = (options: LoggerOptions = {}): Logger =>
  new Logger(options, new ConsoleTransport());
