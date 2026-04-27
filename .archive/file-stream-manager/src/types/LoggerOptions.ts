/**
 * LoggerOptions type definition.
 * @typedef {Object} LoggerOptions
 * @property {'debug' | 'info' | 'warn' | 'error'} level - The logging level.
 * @property {'json' | 'text'} [format] - The format of the log output.
 * @property {string} [destination] - The destination where logs are written.
 */
export interface LoggerOptions {
  level: "debug" | "info" | "warn" | "error";
  format?: "json" | "text";
  destination?: string;
}
