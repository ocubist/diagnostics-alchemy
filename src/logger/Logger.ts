import type { LogCallContext, LogEntry, LogLevel, LoggerOptions, OutputRestriction } from "./types";
import {
  checkRuntimeRestriction,
  isLevelEnabled,
} from "./restrictions";
import { buildContextPath } from "./context";
import type { Transport } from "./transports/types";

/** Resolved, non-optional internal config after applying defaults. */
interface ResolvedConfig {
  where: string | undefined;
  why: string | undefined;
  minLevel: LogLevel;
  runtimeEnvironment: NonNullable<LoggerOptions["runtimeEnvironment"]>;
  logOutput: OutputRestriction;
  callbacks: ((entry: LogEntry) => void)[];
}

/**
 * The hierarchical logger.
 * Create with `useLogger(options)` — never instantiate directly.
 *
 * Each call to `specialize(options)` returns a *new* Logger that appends
 * context segments to the parent's `where` / `why` paths. All specializations
 * share the same underlying transport (stdout + file stream).
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
      runtimeEnvironment: options.runtimeEnvironment ?? "all",
      logOutput: options.logOutput ?? "stdOut",
      callbacks: options.callbackFunctions ?? [],
    };
  }

  // ─── Specialization ────────────────────────────────────────────────────────

  /**
   * Returns a new Logger with additional context appended to this logger's
   * `where` and `why` paths.
   *
   * All other options (restrictions, file path, etc.) are inherited unless
   * explicitly overridden.
   *
   * @example
   * const authLogger = appLogger.specialize({ where: "auth", why: "user-session" });
   * authLogger.info("Token refreshed"); // where: "app.auth", why: "app-boot.user-session"
   */
  specialize(options: LoggerOptions): Logger {
    return new Logger(
      {
        where: buildContextPath(this.config.where, options.where),
        why: buildContextPath(this.config.why, options.why),
        minLevel: options.minLevel ?? this.config.minLevel,
        runtimeEnvironment:
          options.runtimeEnvironment ?? this.config.runtimeEnvironment,
        logOutput: options.logOutput ?? this.config.logOutput,
        filePath: undefined, // transport is already created; not re-created
        callbackFunctions: [
          ...this.config.callbacks,
          ...(options.callbackFunctions ?? []),
        ],
      },
      this.transport
    );
  }

  // ─── Public log methods ────────────────────────────────────────────────────

  debug(message: string, context?: LogCallContext): void {
    this.logBase("debug", message, context);
  }

  info(message: string, context?: LogCallContext): void {
    this.logBase("info", message, context);
  }

  warn(message: string, context?: LogCallContext): void {
    this.logBase("warn", message, context);
  }

  error(message: string, context?: LogCallContext): void {
    this.logBase("error", message, context);
  }

  fatal(message: string, context?: LogCallContext): void {
    this.logBase("fatal", message, context);
  }

  // ─── Internals ─────────────────────────────────────────────────────────────

  private logBase(
    level: LogLevel,
    message: string,
    context?: LogCallContext
  ): void {
    // Restriction checks — bail early if this logger shouldn't fire
    if (!isLevelEnabled(level, this.config.minLevel)) return;
    if (!checkRuntimeRestriction(this.config.runtimeEnvironment)) return;

    // Build the log entry
    const entry: LogEntry = {
      level,
      time: Date.now(),
      message,
      where: buildContextPath(this.config.where, context?.where),
      why: buildContextPath(this.config.why, context?.why),
      payload: context?.payload,
    };

    this.transport.write(entry, this.config.logOutput);

    // Fire callbacks
    for (const cb of this.config.callbacks) {
      cb(entry);
    }
  }

  /** Flush pending file writes synchronously (useful in tests or shutdown hooks). */
  flushSync(): void {
    this.transport.flushSync();
  }
}
