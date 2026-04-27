import { z } from "zod";

export const LoggerRestrictions = z.object({
  environment: z.enum(["server", "device", "all"]),
  runtimeEnvironment: z.enum(["development", "production", "all"]),
  logOutput: z.enum(["api", "file", "stdOut", "all"]),
});

export type LoggerRestrictions = z.infer<typeof LoggerRestrictions>;
