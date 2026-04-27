import z from "zod";
import { LoggerRestrictionsSchema } from "../export/LoggerRestrictionsType";
import { SpecializationsArraySchema } from "../export/SpecializationType";
import { LoggerLevelTypeSchema } from "../export/LoggerLevelType";

export const LoggerClassConfigSchema = z.object({
  apiUrls: z.array(z.string()),
  filePaths: z.array(z.string()),
  restrictions: LoggerRestrictionsSchema,
  specializations: SpecializationsArraySchema,
  redactList: z.array(z.string()),
  level: LoggerLevelTypeSchema,
  colorize: z.enum(["trueIfColorSupportDetected", "force", "off"]),
});

export type LoggerClassConfig = z.infer<typeof LoggerClassConfigSchema>;
