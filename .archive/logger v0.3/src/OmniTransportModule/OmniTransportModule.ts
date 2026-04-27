import { Writable } from "stream";
import { formatLogObj, getAnsiFormatters } from "../helpers";
import { extractLevelType } from "../helpers/extractLevelType";
import { prepareLogObj } from "../helpers/prepareLogObj/prepareLogObj";
import { LoggerClassConfig } from "../types";
import {
  openFileStream,
  subscribeToFileStream,
  unsubscribeFromFileStream,
  writeFileStream,
} from "@ocubist/file-stream-manager";
import z, { ZodSchema } from "zod";

const transportRegistry = new FinalizationRegistry((filePaths: string[]) => {
  filePaths.forEach(unsubscribeFromFileStream);
});

export class OmniTransportModule extends Writable {
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

    this.loggerConfig.filePaths.forEach((fp) => {
      openFileStream(fp);
      subscribeToFileStream(fp);
    });
    transportRegistry.register(this, this.loggerConfig.filePaths);

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

  allowApiLog() {
    // false, if apiUrl does not exist
    if (this.loggerConfig.apiUrls.length === 0) return false;

    return true;
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
        if (this.allowFileLog()) {
          const output = JSON.stringify(logObject) + "\n";

          this.loggerConfig.filePaths.forEach((fp) => {
            try {
              writeFileStream(fp, output);
            } catch (err) {
              this.emit("error", err);
            }
          });
        }

        // # Api
      }

      callback(null);

      // // # Terminal and Browser Formatted Logs
      // if (
      //   (this.currentOperatingEnv === "server" && this.allowTerminalLog()) ||
      //   (this.currentOperatingEnv === "device" && this.allowBrowserLog())
      // ) {
      //   const consoleLogPromises = preparedLogObjs.map(async (lo) => {
      //     const type = extractLevelType(lo);
      //     const output = formatLogObj(lo, getAnsiFormatters(type));

      //     if (type === "fatal") {
      //       console.error(output);
      //     } else if (type === "trace") {
      //       const traceOutput = output.slice(0, -2);
      //       console.trace(traceOutput);
      //       process.stdout.write("\n\n");
      //     } else {
      //       console[type](output);
      //     }
      //   });

      //   promises.push(...consoleLogPromises);

      //   // (async () => {
      //   //   for (const logObject of preparedLogObjs) {
      //   //     const type = extractLevelType(logObject);
      //   //     const output = formatLogObj(logObject, getAnsiFormatters(type));

      //   //     if (type === "fatal") {
      //   //       console.error(output);
      //   //     } else if (type === "trace") {
      //   //       const traceOutput = output.slice(0, -2);
      //   //       console.trace(traceOutput);
      //   //       process.stdout.write("\n\n");
      //   //     } else {
      //   //       console[type](output);
      //   //     }
      //   //   }
      //   // })().catch((err) => {
      //   //   this.emit("error", err);
      //   // });
      // }

      // // # File
      // if (this.allowFileLog()) {
      //   const fileLogPromises = preparedLogObjs.map(async (lo) => {
      //     const output = JSON.stringify(lo) + "\n";

      //     this.loggerConfig.filePaths.forEach(async (fp) =>
      //       writeFileStream(fp, output)
      //     );
      //   });

      //   promises.push(...fileLogPromises);

      //   // (async () => {
      //   //   preparedLogObjs
      //   //     .map((lo) => JSON.stringify(lo) + "\n")
      //   //     .forEach((chunk) => {
      //   //       this.loggerConfig.filePaths.forEach((filePath) =>
      //   //         writeFileStream(filePath, chunk)
      //   //       );
      //   //     });
      //   //   // write preparedLogObjs line by line to file
      //   // })().catch((err) => {
      //   //   this.emit("error", err);
      //   // });
      // }

      // // # Api
      // // if (this.allowApiLog()) {
      // //   (async () => {
      // //     // post preparedLogObjs in a bundle to an apiLink
      // //   })().catch((err) => {
      // //     this.emit("error", err);
      // //   });
      // // }

      // Promise.all(promises)
      //   .then(() => {
      //     callback(null);
      //   })
      //   .catch((err) => {
      //     callback(err);
      //   });
    } catch (err) {
      this.emit("error", err);
    }
  }

  // _destroy(
  //   error: Error | null,
  //   callback: (error?: Error | null | undefined) => void
  // ): void {
  //   console.log("_DESTROY_");
  //   this.loggerConfig.filePaths.forEach(unsubscribeFromFileStream);
  //   super._destroy(error, callback);
  // }
}

const Schema = z.object({ name: z.string() });

const f = <T extends ZodSchema>(schema: T, val: unknown): z.infer<T> => {
  return schema.parse(val);
};

const a = f(Schema, { name: "hans" });
