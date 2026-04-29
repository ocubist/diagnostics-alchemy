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

