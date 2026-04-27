import { PinoLogObject } from "../../types";

export const cleanUpPinoLogObjErr = (logObj: PinoLogObject): PinoLogObject => {
  // # clean up err
  if (logObj.err !== undefined) {
    if (logObj.err.type === "Object") {
      delete logObj.err.type;
    }

    if (typeof logObj.err.stack === "string") {
      const stack = (logObj.err.stack as string)
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l !== "");

      if (stack.length > 0) {
        logObj.err.stack = stack;
      } else {
        delete logObj.err.stack;
      }
    }
  }

  return logObj;
};
