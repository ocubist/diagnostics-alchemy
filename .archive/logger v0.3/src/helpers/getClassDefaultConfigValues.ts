import { isDevelopment } from "@ocubist/utils";
import { selectEnv } from "../selectors";
import { LoggerClassConfig } from "../types";

export const getClassDefaultConfigValues = (): LoggerClassConfig => {
  return {
    apiUrls: selectEnv.apiUrls()?.split(" ") ?? [],
    filePaths: selectEnv.apiUrls()?.split(" ") ?? [],
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
