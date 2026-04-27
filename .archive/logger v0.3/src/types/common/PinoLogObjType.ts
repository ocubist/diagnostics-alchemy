import { z } from "zod";
import { SpecializationsArraySchema } from "../export/SpecializationType";
import { ObjectifiedErrorSchema } from "./ObjectifiedErrorType";
import { LoggerClassConfigSchema } from "./LoggerClassConfigType";
import { PayloadSchema } from "../export/PayloadType";

export const PinoLogObjectSchema = z.object({
  level: z.number(),
  time: z.number(),
  msg: z.string().optional(),
  pid: z.number(),
  hostname: z.string(),
  payload: PayloadSchema.optional(),
  specializations: SpecializationsArraySchema.optional(),
  err: ObjectifiedErrorSchema.optional(),
  trace: z.array(z.string()).optional(),
});

export type PinoLogObject = z.infer<typeof PinoLogObjectSchema>;

// export interface PinoLogObject {
//   level: number;
//   time: number;
//   msg: string;
//   pid: number;
//   hostname: string;
//   payload: LogPayload;
//   specializations?: Specialization[];
// }
