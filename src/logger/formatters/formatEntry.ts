import chalk from "chalk";
import type { LogEntry } from "../types";
import { levelChalkStyles } from "./levelColors";

const PAD = 5; // "fatal".length === 5

/**
 * Formats a Unix timestamp as `YYYY-MM-DD HH:mm:ss` in the given IANA timezone.
 * Defaults to UTC. Uses Intl.DateTimeFormat — no external dependency, works in
 * Node and browser.
 *
 * The sv-SE locale naturally produces ISO-style space-separated datetime:
 *   2026-04-29 23:58:08
 */
const formatTime = (time: number, timezone: string): string =>
  new Intl.DateTimeFormat("sv-SE", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(time));

/**
 * Formats a `LogEntry` into a single human-readable line.
 *
 * Uses chalk for level colours — chalk degrades gracefully to plain text
 * in environments without ANSI support (e.g. browser DevTools).
 *
 * Example output (timezone "Europe/Berlin"):
 * ```
 * 2026-04-29 23:58:08 INFO  [app.auth] (user-login) User logged in
 *   {"userId":"abc123"}
 * ```
 */
export const formatEntry = (entry: LogEntry, timezone = "UTC"): string => {
  const time = chalk.dim(formatTime(entry.time, timezone));
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
