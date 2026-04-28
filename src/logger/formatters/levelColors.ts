import chalk from "chalk";
import type { LogLevel } from "../types";

/**
 * ANSI chalk formatters for each log level — used in Node.js stdout output.
 */
export const levelChalkStyles: Readonly<Record<LogLevel, (s: string) => string>> = {
  debug: chalk.gray,
  info: chalk.cyan,
  warn: chalk.yellow,
  error: chalk.red,
  fatal: (s: string) => chalk.bgRed.white(s),
};

/**
 * CSS style strings for each log level — used in browser console %c formatting.
 */
export const levelCssStyles: Readonly<Record<LogLevel, string>> = {
  debug: "color: #888; font-weight: normal",
  info: "color: #0af; font-weight: bold",
  warn: "color: #fa0; font-weight: bold",
  error: "color: #f44; font-weight: bold",
  fatal: "color: #fff; background: #f00; font-weight: bold; padding: 2px 4px; border-radius: 3px",
};
