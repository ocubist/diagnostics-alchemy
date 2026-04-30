import type { LogCallContext, LogEntry, LogLevel, LoggerOptions, PlainLogger, Transport } from "./types";
import { isLevelEnabled } from "./types";
import { buildContextPath } from "./context";

/** Resolved, non-optional internal config after applying defaults. */
interface ResolvedConfig {
  where: string | undefined;
  why: string | undefined;
  transports: Transport[];
}

/**
 * The hierarchical logger.
 * Create with `useLogger(options)` — never instantiate directly in app code.
 *
 * Each call to `specialize(options)` returns a *new* Logger that appends
 * context segments to the parent's `where` / `why` paths and stacks any
 * additional transports on top of the parent's transport list.
 */
export class Logger {
  private readonly config: ResolvedConfig;

  /** @internal — use `useLogger()` or `Logger.specialize()` instead. */
  constructor(options: LoggerOptions, transports: Transport[]) {
    this.config = {
      where: options.where?.trim() || undefined,
      why: options.why?.trim() || undefined,
      transports,
    };
  }

  // ─── Specialization ────────────────────────────────────────────────────────

  /**
   * Returns a new Logger with additional context appended to this logger's
   * `where` and `why` paths.
   *
   * All other options are inherited unless explicitly overridden.
   * The `console` option is ignored here — it only has effect in `useLogger()`.
   *
   * @example
   * const authLogger = appLogger.specialize({ where: "auth", why: "user-session" });
   * authLogger.info("Token refreshed"); // where: "app.auth"
   */
  specialize(options: LoggerOptions): Logger {
    return new Logger(
      {
        where: buildContextPath(this.config.where, options.where),
        why: buildContextPath(this.config.why, options.why),
      },
      [...this.config.transports, ...(options.transports ?? [])]
    );
  }

  // ─── Plain sub-logger ─────────────────────────────────────────────────────

  /**
   * Plain text output — prints the raw string directly to the matching
   * `console.*` method. No timestamp, level badge, context, colouring, or
   * transport filtering. Always fires regardless of any minLevel setting.
   *
   * @example
   * logger.plain.info("Starting migration...");
   * logger.plain.warn("Slow query detected\nQuery: SELECT * FROM users");
   */
  get plain(): PlainLogger {
    return {
      debug: (msg) => console.debug(msg),
      info:  (msg) => console.info(msg),
      warn:  (msg) => console.warn(msg),
      error: (msg) => console.error(msg),
      fatal: (msg) => console.error(msg),
    };
  }

  // ─── Public log methods ────────────────────────────────────────────────────

  debug(message: string, context?: LogCallContext): void { this.logBase("debug", message, context); }
  info(message: string, context?: LogCallContext): void  { this.logBase("info",  message, context); }
  warn(message: string, context?: LogCallContext): void  { this.logBase("warn",  message, context); }
  error(message: string, context?: LogCallContext): void { this.logBase("error", message, context); }
  fatal(message: string, context?: LogCallContext): void { this.logBase("fatal", message, context); }

  // ─── Internals ─────────────────────────────────────────────────────────────

  private logBase(level: LogLevel, message: string, context?: LogCallContext): void {
    const entry: LogEntry = {
      level,
      time: Date.now(),
      message,
      where: buildContextPath(this.config.where, context?.where),
      why: buildContextPath(this.config.why, context?.why),
      payload: context?.payload,
    };

    for (const transport of this.config.transports) {
      if (isLevelEnabled(level, transport.minLevel ?? "debug")) {
        transport.write(entry);
      }
    }
  }
}
