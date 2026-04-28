import chalk from "chalk";
import type { LogEntry } from "../types";
import { levelChalkStyles } from "./levelColors";

const PAD = 5; // "fatal".length === 5

/**
 * Formats a `LogEntry` into a single human-readable line for Node.js stdout.
 *
 * Example output:
 * ```
 * 2024-06-01T12:00:00.000Z INFO  [app.auth] (user-login) User logged in
 *   {"userId":"abc123"}
 * ```
 */
export const formatNodeEntry = (entry: LogEntry): string => {
  const time = chalk.dim(new Date(entry.time).toISOString());
  const level = levelChalkStyles[entry.level](entry.level.toUpperCase().padEnd(PAD));

  const wherePart = entry.where ? chalk.cyan(`[${entry.where}]`) : "";
  const whyPart = entry.why ? chalk.magenta(`(${entry.why})`) : "";
  const context = [wherePart, whyPart].filter(Boolean).join(" ");
  const contextStr = context ? ` ${context}` : "";

  const payloadStr =
    entry.payload && Object.keys(entry.payload).length > 0
      ? "\n" + chalk.dim(JSON.stringify(entry.payload, null, 2))
      : "";

  return `${time} ${level}${contextStr} ${entry.message}${payloadStr}`;
};
