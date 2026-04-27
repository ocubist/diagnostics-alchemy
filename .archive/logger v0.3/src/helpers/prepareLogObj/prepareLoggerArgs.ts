import { z } from "zod";
import { LoggerArgs, PayloadSchema, PreparedLoggerArgs } from "../../types";
import { objectifyError } from "./objectifyError";

export const prepareLoggerArgs: (
  loggerArgs: LoggerArgs,
  trace?: string[]
) => PreparedLoggerArgs = ([arg0, arg1, arg2], trace) => {
  const result: PreparedLoggerArgs = {
    trace,
  };

  if (arg2 !== undefined) {
    // #Case 1: 3 arguments
    // * [msg, err, payload]
    result.msg = z.string().parse(arg0);
    result.err = objectifyError(arg1);
    result.payload = PayloadSchema.parse(arg2);
  } else if (arg1 !== undefined) {
    // # Case2: 2 arguments
    // [msg, payload]
    // [msg, err]
    // [err, payload]
    if (typeof arg0 === "string") {
      if (arg1 instanceof Error) {
        // * [msg, err]
        result.msg = arg0;
        result.err = objectifyError(arg1);
      } else if (typeof arg1 === "object") {
        // * [msg, payload]
        result.msg = arg0;
        result.payload = PayloadSchema.parse(arg1);
      } else {
        // * default: [msg, err]
        result.msg = arg0;
        result.err = objectifyError(arg1);
      }
    } else {
      // * [err, payload]
      result.err = objectifyError(arg0);
      result.payload = PayloadSchema.parse(arg1);
    }
  } else {
    // # Case 3: 1 argument
    // [msg]
    // [payload]
    // [err]
    if (arg0 instanceof Error) {
      // * [err]
      result.err = objectifyError(arg0);
    } else if (typeof arg0 === "string") {
      // * [msg]
      result.msg = arg0;
    } else if (typeof arg0 === "object") {
      // * [payload]
      result.payload = PayloadSchema.parse(arg0);
    } else {
      // * any other case is also [err]
      result.err = objectifyError(arg0);
    }
  }

  return result;
};
