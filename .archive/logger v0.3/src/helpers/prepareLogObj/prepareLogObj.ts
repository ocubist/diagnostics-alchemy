import z from "zod";
import {
  LoggerClassConfig,
  PinoLogObject,
  PinoLogObjectSchema,
} from "../../types";
import { cleanUpPinoLogObjErr } from "./cleanUpPinoLogObjErr";
import { cleanUpPinoLogObjTrace } from "./cleanUpPinoLogObjTrace";

export const prepareLogObj = (
  chunk: Buffer,
  config: LoggerClassConfig
): PinoLogObject[] => {
  const chunkStrings = chunk
    .toString()
    .split("\n")
    .filter((cs) => cs !== "");

  const prepared = z.array(PinoLogObjectSchema).parse(
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
