import { z } from "zod";
import { PayloadSchema } from "../export/PayloadType";

export const ObjectifiedErrorSchema = z.object({
  name: z.string().optional(),
  message: z.string().optional(),
  stack: z.array(z.string()).optional(),
  payload: PayloadSchema.optional(),
  origin: z.any().optional(),
  errType: z.string().optional(),
  errAsString: z.string().optional(),
  type: z.string().optional(),
});

export type ObjectifiedError = z.infer<typeof ObjectifiedErrorSchema>;
