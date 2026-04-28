import type { EnvironmentRestriction, LogLevel, RuntimeRestriction } from "./types";
import { LOG_LEVEL_ORDER } from "./types";

// Access window via globalThis so TypeScript doesn't need the DOM lib.
const _g = globalThis as Record<string, unknown>;

/** Returns true when running on a Node.js server (no global `window`). */
export const isServerEnvironment = (): boolean => _g["window"] === undefined;

/** Returns true when running in a browser (global `window` present). */
export const isBrowserEnvironment = (): boolean => _g["window"] !== undefined;

/**
 * Checks whether the current runtime environment satisfies the restriction.
 * Returns `true` if the logger should proceed.
 */
export const checkEnvironmentRestriction = (
  restriction: EnvironmentRestriction
): boolean => {
  if (restriction === "all") return true;
  if (restriction === "server") return isServerEnvironment();
  if (restriction === "device") return isBrowserEnvironment();
  return true;
};

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
