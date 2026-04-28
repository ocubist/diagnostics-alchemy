import { z } from "zod";
import { Severity } from "../severity/types";
import { ErrorCode } from "../error-code/types";

export const Payload = z.record(z.unknown());
export type Payload = z.infer<typeof Payload>;

export const TransmutedErrorProps = z.object({
  message: z.string(),
  name: z.string(),
  severity: Severity.optional(),
  origin: z.unknown().optional(),
  /** Human-readable description of WHY this error exists (distinct from the message). */
  reason: z.string().optional(),
  payload: Payload.optional(),
  module: z.string().optional(),
  context: z.string().optional(),
  errorCode: ErrorCode.optional(),
});

export type TransmutedErrorProps = z.infer<typeof TransmutedErrorProps>;
