import { ansify } from "@ocubist/utils";

import { formatTime } from "./formatTime";
import { FormatStringFunction, Formatters } from "../../types/FormatterFunctions";
import { LoggerLevelType } from "../../types/LoggerLevelType";

export const getAnsiFormatters = (type: LoggerLevelType): Formatters => {
  function primaryModifiers(type: LoggerLevelType): {
    primary: FormatStringFunction;
    msg: FormatStringFunction;
  } {
    if (type === "trace") {
      return {
        primary: ansify.gray.dim,
        msg: ansify.whiteBright,
      };
    } else if (type === "debug") {
      return {
        primary: ansify.magenta,
        msg: ansify.magentaBright,
      };
    } else if (type === "info") {
      return {
        primary: ansify.green,
        msg: ansify.greenBright,
      };
    } else if (type === "warn") {
      return {
        primary: ansify.yellow,
        msg: ansify.yellowBright,
      };
    } else if (type === "error") {
      return {
        primary: ansify.red,
        msg: ansify.yellow,
      };
    } else if (type === "fatal") {
      return {
        primary: ansify.bgRed.white,
        msg: ansify.yellow,
      };
    }

    throw new Error(
      "Type for the Formatters didn't match. This should not have happened..."
    );
  }

  function traceFormatter(a: Array<string>) {
    const traceString = a
      .map((t) => t.trim())
      .filter((t) => t !== "")
      .join("\n");
    return ansify.gray(traceString);
  }

  const { msg, primary } = primaryModifiers(type);

  return {
    primary,
    type: (s) => ansify.underline.bold(primary(s)),
    time: (n) => primary(formatTime(n)),
    msg: (s) => ansify.italic(msg(s)),
    trace: traceFormatter,
    error: (oe) => {
      if (Object.keys(oe).length === 0) return "";

      const theOe = { ...oe };
      const trace = oe.stack;
      delete theOe.stack;

      let output = ansify.red.underline("Error");

      if (trace !== undefined) {
        output += "\n" + traceFormatter(trace);
      }

      output += "\n" + JSON.stringify(theOe, null, 3);

      const [titleLine, ...rest] = output.split("\n");
      output = [
        titleLine,
        ...rest.map((l) => ansify.red("│  ") + ansify.white(l)),
      ].join("\n");

      return output;
    },
    specializationPayload: (o) => {
      return (
        ansify.cyan.underline("Specialization") +
        "\n" +
        JSON.stringify(o, null, 3)
          .split("\n")
          .map((l) => ansify.cyan("│  ") + ansify.white(l))
          .join("\n")
      );
    },
    specializationName: ansify.cyan,
    payload: (o) => {
      return (
        ansify.magentaBright.underline("Payload") +
        "\n" +
        JSON.stringify(o, null, 3)
          .split("\n")
          .map((l) => ansify.magentaBright("│  ") + ansify.white(l))
          .join("\n")
      );
    },
  };
};
