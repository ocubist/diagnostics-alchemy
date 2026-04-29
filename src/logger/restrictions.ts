import type { LogLevel, RuntimeRestriction } from "./types";
import { LOG_LEVEL_ORDER } from "./types";

/**
 * Checks whether NODE_ENV satisfies the restriction.
 * Returns `true` if the logger should proceed.
 * When NODE_ENV is unset, "development" mode is assumed.
 */
export const checkRuntimeRestriction = (
  restriction: RuntimeRestriction
): boolean => {
  if (restriction === "all") return true;
  const nodeEnv =
    typeof process !== "undefined" ? process.env["NODE_ENV"] : undefined;
  const env = nodeEnv ?? "development";
  if (restriction === "development") return env === "development";
  if (restriction === "production") return env === "production";
  return true;
};

/**
 * Returns `true` when `level` is at or above `minLevel`.
 */
export const isLevelEnabled = (level: LogLevel, minLevel: LogLevel): boolean =>
  LOG_LEVEL_ORDER[level] >= LOG_LEVEL_ORDER[minLevel];
