import { z } from "zod";
import { Severity } from "../../severity/types";
import { ErrorCode } from "../../error-code/types";
import { Payload } from "../../transmuted-errors/types";

/** Props provided at class-definition time (static metadata). */
export const CraftErrorProps = z.object({
  name: z.string(),
  severity: Severity.optional(),
  reason: z.string().optional(),
  module: z.string().optional(),
  context: z.string().optional(),
  errorCode: ErrorCode.optional(),
});
export type CraftErrorProps = z.infer<typeof CraftErrorProps>;

/** Props provided at instantiation time (runtime data). */
export const CraftedErrorProps = z.object({
  message: z.string(),
  origin: z.unknown().optional(),
  payload: Payload.optional(),
});
export type CraftedErrorProps = z.infer<typeof CraftedErrorProps>;
