import { useSingleton } from "@ocubist/singleton-manager";
import { config } from "../config/config";
import { LoggerClass } from "../LoggerClass/LoggerClass";

const { setSingletonIfNotExists } = useSingleton(config.loggerSingletonName);

export const logger = setSingletonIfNotExists(
  config.loggerSingletonName,
  () => new LoggerClass({})
);
