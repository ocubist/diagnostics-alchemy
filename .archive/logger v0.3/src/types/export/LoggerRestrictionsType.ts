import { z } from "zod";

export const LoggerRestrictionsSchema = z.object({
  environment: z.enum(["server", "device", "all"]),
  runtimeEnvironment: z.enum(["development", "production", "all"]),
  logOutput: z.enum(["api", "file", "stdOut", "all"]),
});

export type LoggerRestrictions = z.infer<typeof LoggerRestrictionsSchema>;
