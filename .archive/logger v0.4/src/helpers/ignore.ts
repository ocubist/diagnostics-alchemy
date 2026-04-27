import {
  isDevelopment,
  isDevice,
  isNodeEnvironment,
  isProduction,
  isServer,
} from "@ocubist/utils";
import { LoggerRestrictions } from "../types/LoggerRestrictionsType";

export const ignore = (restrictions: LoggerRestrictions) => {
  if (!isNodeEnvironment()) return true;
  if (!isProduction() && restrictions.runtimeEnvironment === "production")
    return true;
  if (!isDevelopment() && restrictions.runtimeEnvironment === "development")
    return true;
  if (!isDevice() && restrictions.environment === "device") return true;
  if (!isServer() && restrictions.environment === "server") return true;
  return false;
};
