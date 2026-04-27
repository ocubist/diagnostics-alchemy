import { EventEmitter, Writable } from "stream";

import { extractLevelType } from "../helpers/extractLevelType";
import { prepareLogObj } from "../helpers/prepareLogObj/prepareLogObj";

import { LoggerClassConfig } from "../types/LoggerClassConfigType";
import { getAnsiFormatters } from "../helpers/formatterFunctions/getAnsiFormatters";
import { formatLogObj } from "../helpers/formatterFunctions/formatLogObj";
import { simplifyLogObject } from "../helpers/simplifyLogObject";

export class BrowserTransportModule extends EventEmitter {
  currentOperatingEnv: "device" | "server";
  loggerConfig: LoggerClassConfig;

  constructor(props: {
    loggerConfig: LoggerClassConfig;
    currentOperatingEnv: "device" | "server";
  }) {
    super();

    const { currentOperatingEnv, loggerConfig } = props;

    this.loggerConfig = loggerConfig;
    this.currentOperatingEnv = currentOperatingEnv;

    this.on("error", this.handleError);
  }

  allowServerLog() {
    // false, if not server
    if (this.currentOperatingEnv !== "server") {
      return false;
    }

    // false, if server not allowed
    if (
      this.loggerConfig.restrictions.environment !== "all" &&
      this.loggerConfig.restrictions.environment !== "server"
    ) {
      return false;
    }

    return true;
  }

  allowDeviceLog() {
    // false, if not browser
    if (this.currentOperatingEnv !== "device") {
      return false;
    }

    // false, if browser not allowed
    if (
      this.loggerConfig.restrictions.environment !== "all" &&
      this.loggerConfig.restrictions.environment !== "device"
    ) {
      return false;
    }

    return true;
  }

  allowStdLog() {
    // false, if stdOut not allowed
    if (
      this.loggerConfig.restrictions.logOutput !== "all" &&
      this.loggerConfig.restrictions.logOutput !== "stdOut"
    ) {
      return false;
    }

    return true;
  }

  allowTerminalLog() {
    // false, if server-log not allowed
    if (!this.allowServerLog()) return false;

    // false, if stdOut not allowed
    if (!this.allowStdLog()) return false;

    return true;
  }

  allowBrowserLog() {
    // false, if device-log not allowed
    if (!this.allowDeviceLog()) return false;

    // false, if stdOut not allowed
    if (!this.allowStdLog()) return false;

    return true;
  }

  allowFileLog() {
    // false, if server-log not allowed
    if (!this.allowServerLog()) return false;

    // false, if filePaths do not exist
    if (this.loggerConfig.filePaths.length === 0) return false;

    return true;
  }

  allowCallbacks() {
    return this.loggerConfig.callbackFunctions.length !== 0;
  }

  handleError(error: unknown) {
    // Handle the error, such as logging it or cleaning up resources
    console.error("Error in CustomTransport:", error);
  }

  _write(
    chunk: Buffer,
    encoding: string,
    callback: (error?: Error | null) => void
  ) {
    try {
      const preparedLogObjs = prepareLogObj(chunk, this.loggerConfig);
      const promises: Promise<void>[] = [];

      for (const logObject of preparedLogObjs) {
        // # Terminal and Browser Formatted Logs
        if (
          (this.currentOperatingEnv === "server" && this.allowTerminalLog()) ||
          (this.currentOperatingEnv === "device" && this.allowBrowserLog())
        ) {
          try {
            const type = extractLevelType(logObject);
            const output = formatLogObj(logObject, getAnsiFormatters(type));

            if (type === "fatal") {
              console.error(output);
            } else if (type === "trace") {
              const traceOutput = output.slice(0, -2);
              console.trace(traceOutput);
              process.stdout.write("\n\n");
            } else {
              console[type](output);
            }
          } catch (err) {
            this.emit("error", err);
          }
        }

        // # File
        // No file-write in Browser-Environment

        // # Callbacks
        if (this.allowCallbacks()) {
          const simplifiedLogObject = simplifyLogObject(logObject);
          this.loggerConfig.callbackFunctions.forEach((fn) => {
            fn(simplifiedLogObject);
          });
        }
      }

      callback(null);
    } catch (err) {
      this.emit("error", err);
    }
  }
}
