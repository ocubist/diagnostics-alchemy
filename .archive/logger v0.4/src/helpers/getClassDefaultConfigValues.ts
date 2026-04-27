import { isDevelopment } from "@ocubist/utils";
import { selectEnv } from "../selectors/selectEnv";
import { LoggerClassConfig } from "../types/LoggerClassConfigType";

export const getClassDefaultConfigValues = (): LoggerClassConfig => {
  return {
    callbackFunctions: [],
    filePaths: selectEnv.filePaths()?.split(" ") ?? [],
    level: selectEnv.defaultLevel() ?? isDevelopment() ? "debug" : "info",
    redactList: [],
    restrictions: {
      environment: "all",
      logOutput: "all",
      runtimeEnvironment: "all",
    },
    specializations: [],
    colorize: "trueIfColorSupportDetected",
  };
};
