import { LoggerLevelType, PinoLogObject } from "../types";

export const extractLevelType = (logObj: PinoLogObject): LoggerLevelType => {
  if (logObj.level <= 10) return "trace";
  if (logObj.level <= 20) return "debug";
  if (logObj.level <= 30) return "info";
  if (logObj.level <= 40) return "warn";
  if (logObj.level <= 50) return "error";
  if (logObj.level <= 60) return "fatal";
  return "info";
};
