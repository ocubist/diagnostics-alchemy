import pino from "pino";

import { OmniTransportModule } from "../OmniTransportModule";
import {
  getClassDefaultConfigValues,
  getCurrentOperatingEnv,
  ignore,
  prepareLoggerArgs,
} from "../helpers";
import {
  LoggerArgs,
  LoggerClassConfig,
  LoggerClassConfigSchema,
  LoggerClassProps,
  Pino,
  Specialization,
  SpecializationOptions,
} from "../types";

export class LoggerClass {
  private _pino: Pino;
  private _config: LoggerClassConfig;

  get config() {
    return { ...this._config };
  }

  constructor(loggerClassProps: LoggerClassProps) {
    this._config = getClassDefaultConfigValues();
    this._pino = pino();

    this.configure({
      ...this._config,
      ...loggerClassProps,
    });
  }

  trace(...loggerArgs: LoggerArgs) {
    if (ignore(this._config.restrictions)) return;

    // this._pino.trace(prepareLoggerArgs(loggerArgs));

    // Capture the stack trace
    const error = new Error();
    let traceStr = error.stack;
    let trace: string[] = [];

    // Process the stack trace to remove unwanted lines
    if (traceStr) {
      const lines = traceStr.split("\n");
      // Remove the first line ("Error") and the trace for this function
      trace = lines.slice(2);
    }

    this._pino.trace(prepareLoggerArgs(loggerArgs, trace));
  }

  debug(...loggerArgs: LoggerArgs) {
    if (ignore(this._config.restrictions)) return;

    this._pino.debug(prepareLoggerArgs(loggerArgs));
  }

  info(...loggerArgs: LoggerArgs) {
    if (ignore(this._config.restrictions)) return;

    this._pino.info(prepareLoggerArgs(loggerArgs));
  }

  warn(...loggerArgs: LoggerArgs) {
    if (ignore(this._config.restrictions)) return;

    this._pino.warn(prepareLoggerArgs(loggerArgs));
  }

  error(...loggerArgs: LoggerArgs) {
    if (ignore(this._config.restrictions)) return;

    this._pino.error(prepareLoggerArgs(loggerArgs));
  }

  fatal(...loggerArgs: LoggerArgs) {
    if (ignore(this._config.restrictions)) return;

    this._pino.fatal(prepareLoggerArgs(loggerArgs));
  }

  specialize(specialization: Specialization, options?: SpecializationOptions) {
    let loggerClassProps: LoggerClassProps = {
      ...this.config,
      specializations: [...this._config.specializations, specialization],
    };

    if (options !== undefined) {
      loggerClassProps = { ...loggerClassProps, ...options };
    }

    return new LoggerClass(loggerClassProps);
  }

  overrideConfigurations(configurations: LoggerClassProps) {
    this.configure({
      ...this._config,
      ...configurations,
    });
  }

  private configure(configurations: LoggerClassConfig) {
    this._config = LoggerClassConfigSchema.parse(configurations);

    this._pino = pino(
      {
        level: this._config.level,
        redact: this._config.redactList,
      },
      new OmniTransportModule({
        currentOperatingEnv: getCurrentOperatingEnv(),
        loggerConfig: this._config,
      })
    );
  }
}
