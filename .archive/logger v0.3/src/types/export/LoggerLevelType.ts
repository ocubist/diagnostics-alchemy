import { z } from "zod";

export const LoggerLevelTypeSchema = z.enum([
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
]);

export type LoggerLevelType = z.infer<typeof LoggerLevelTypeSchema>;
