import type { LogCallContext, LogEntry, LogLevel, LoggerOptions } from "./types";
import { isLevelEnabled } from "./types";
import { buildContextPath } from "./context";
import type { Transport } from "./transports/types";

/** Resolved, non-optional internal config after applying defaults. */
interface ResolvedConfig {
  where: string | undefined;
  why: string | undefined;
  minLevel: LogLevel;
  callbacks: ((entry: LogEntry) => void)[];
}

/**
 * The hierarchical logger.
 * Create with `useLogger(options)` — never instantiate directly.
 *
 * Each call to `specialize(options)` returns a *new* Logger that appends
 * context segments to the parent's `where` / `why` paths. All specializations
 * share the same underlying transport.
 */
export class Logger {
  private readonly config: ResolvedConfig;
  private readonly transport: Transport;

  /** @internal — use `useLogger()` or `Logger.specialize()` instead. */
  constructor(options: LoggerOptions, transport: Transport) {
    this.transport = transport;
    this.config = {
      where: options.where?.trim() || undefined,
      why: options.why?.trim() || undefined,
      minLevel: options.minLevel ?? "debug",
      callbacks: options.callbackFunctions ?? [],
    };
  }

  // ─── Specialization ────────────────────────────────────────────────────────

  /**
   * Returns a new Logger with additional context appended to this logger's
   * `where` and `why` paths.
   *
   * All other options are inherited unless explicitly overridden.
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
        minLevel: options.minLevel ?? this.config.minLevel,
        callbackFunctions: [
          ...this.config.callbacks,
          ...(options.callbackFunctions ?? []),
        ],
      },
      this.transport
    );
  }

  // ─── Public log methods ────────────────────────────────────────────────────

  debug(message: string, context?: LogCallContext): void { this.logBase("debug", message, context); }
  info(message: string, context?: LogCallContext): void  { this.logBase("info",  message, context); }
  warn(message: string, context?: LogCallContext): void  { this.logBase("warn",  message, context); }
  error(message: string, context?: LogCallContext): void { this.logBase("error", message, context); }
  fatal(message: string, context?: LogCallContext): void { this.logBase("fatal", message, context); }

  // ─── Internals ─────────────────────────────────────────────────────────────

  private logBase(level: LogLevel, message: string, context?: LogCallContext): void {
    if (!isLevelEnabled(level, this.config.minLevel)) return;

    const entry: LogEntry = {
      level,
      time: Date.now(),
      message,
      where: buildContextPath(this.config.where, context?.where),
      why: buildContextPath(this.config.why, context?.why),
      payload: context?.payload,
    };

    this.transport.write(entry);

    for (const cb of this.config.callbacks) {
      cb(entry);
    }
  }

  /** Flush pending writes synchronously (useful in tests or shutdown hooks). */
  flushSync(): void {
    this.transport.flushSync();
  }
}
