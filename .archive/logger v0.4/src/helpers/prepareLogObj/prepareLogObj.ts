import z from "zod";
import { cleanUpPinoLogObjErr } from "./cleanUpPinoLogObjErr";
import { cleanUpPinoLogObjTrace } from "./cleanUpPinoLogObjTrace";
import { LoggerClassConfig } from "../../types/LoggerClassConfigType";
import { PinoLogObject } from "../../types/PinoLogObjType";

export const prepareLogObj = (
  chunk: Buffer,
  config: LoggerClassConfig
): PinoLogObject[] => {
  const chunkStrings = chunk
    .toString()
    .split("\n")
    .filter((cs) => cs !== "");

  const prepared = z.array(PinoLogObject).parse(
    chunkStrings
      .map((cs) => JSON.parse(cs))
      .map((lo) => cleanUpPinoLogObjErr(lo))
      .map((lo) => cleanUpPinoLogObjTrace(lo))
      .map((lo) => {
        lo.specializations = config.specializations;
        return lo;
      })
  );

  return prepared;
};
