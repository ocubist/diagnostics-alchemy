import { PinoLogObject } from "../../types/PinoLogObjType";

export const cleanUpPinoLogObjTrace = (
  logObj: PinoLogObject
): PinoLogObject => {
  if (typeof logObj.trace !== undefined && typeof logObj.trace === "string") {
    const traceLines = (logObj.trace as string)
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l !== "");

    if (traceLines.length > 0) {
      logObj.trace = traceLines;
    } else {
      delete logObj.trace;
    }
  }

  return logObj;
};
