import { z } from "zod";
import { ObjectifiedError } from "./ObjectifiedErrorType";
import { Payload } from "./Payload";
import { Specialization } from "./Specialization";

export const PinoLogObject = z.object({
  level: z.number(),
  time: z.number(),
  msg: z.string().optional(),
  pid: z.number(),
  hostname: z.string(),
  payload: Payload.optional(),
  specializations: z.array(Specialization).optional(),
  err: ObjectifiedError.optional(),
  trace: z.array(z.string()).optional(),
});

export type PinoLogObject = z.infer<typeof PinoLogObject>;
