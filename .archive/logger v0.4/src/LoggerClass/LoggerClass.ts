import pino from "pino";
import { Pino } from "../types/PinoType";
import { LoggerClassConfig } from "../types/LoggerClassConfigType";
import { LoggerClassProps } from "../types/LoggerClassPropsType";
import { getClassDefaultConfigValues } from "../helpers/getClassDefaultConfigValues";
import { ignore } from "../helpers/ignore";
import { prepareLoggerArgs } from "../helpers/prepareLogObj/prepareLoggerArgs";
import { LoggerArgs } from "../types/LoggerArgsType";
import { Specialization } from "../types/SpecializationType";
import { SpecializationOptions } from "../types/SpecializationPropsType";
import { getCurrentOperatingEnv } from "../helpers/getCurrentOperationEnv";
import { isServer } from "@ocubist/utils";
// import { BrowserTransportModule } from "../TransportModules/BrowserTransportModule";
// import { NodeTransportModule } from "../TransportModules/NodeTransportModule";

// @ts-ignore
let TransportModule;

if (isServer()) {
  const {
    NodeTransportModule,
  } = require("../TransportModules/NodeTransportModule");
  TransportModule = NodeTransportModule;
} else {
  const {
    BrowserTransportModule,
  } = require("../TransportModules/BrowserTransportModule");
  TransportModule = BrowserTransportModule;
}

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
    this._config = LoggerClassConfig.parse(configurations);

    this._pino = pino(
      {
        level: this._config.level,
        redact: this._config.redactList,
      },
      // @ts-ignore
      new TransportModule({
        currentOperatingEnv: getCurrentOperatingEnv(),
        loggerConfig: this._config,
      })
    );
  }
}
