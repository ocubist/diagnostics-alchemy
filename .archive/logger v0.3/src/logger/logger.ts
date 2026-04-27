// @index('./**/*.ts', f => `export * from '${f.path}'`)

import { setSingletonIfNotExists } from "@ocubist/singleton-manager";
import { LoggerClass } from "../LoggerClass";
import { config } from "../config";

// @endindex

export const logger = setSingletonIfNotExists(
  config.loggerSingletonName,
  () => new LoggerClass({})
);
