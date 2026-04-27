import { z } from "zod";

export const LoggerLevelType = z.enum([
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
]);

export type LoggerLevelType = z.infer<typeof LoggerLevelType>;
