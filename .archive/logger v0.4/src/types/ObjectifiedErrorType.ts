import { z } from "zod";
import { Payload } from "./PayloadType";

export const ObjectifiedError = z.object({
  name: z.string().optional(),
  message: z.string().optional(),
  stack: z.array(z.string()).optional(),
  payload: Payload.optional(),
  origin: z.any().optional(),
  errType: z.string().optional(),
  errAsString: z.string().optional(),
  type: z.string().optional(),
});

export type ObjectifiedError = z.infer<typeof ObjectifiedError>;
