import z from "zod";
import { LoggerRestrictions } from "./LoggerRestrictionsType";
import { SpecializationsArray } from "./SpecializationType";
import { LoggerLevelType } from "./LoggerLevelType";
import { PinoLogObject } from "./PinoLogObjType";

export const LoggerClassConfig = z.object({
  callbackFunctions: z.array(z.function(z.tuple([PinoLogObject], z.void()))),
  filePaths: z.array(z.string()),
  restrictions: LoggerRestrictions,
  specializations: SpecializationsArray,
  redactList: z.array(z.string()),
  level: LoggerLevelType,
  colorize: z.enum(["trueIfColorSupportDetected", "force", "off"]),
});

export type LoggerClassConfig = z.infer<typeof LoggerClassConfig>;
