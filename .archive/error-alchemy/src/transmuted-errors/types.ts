import { z } from "zod";
import { Severity } from "../severity/types";
import { ErrorCode } from "../error-code/types";

/**
 * Zod schema for the payload of an error.
 */
export const Payload = z.record(z.unknown());

/**
 * Type for the payload of an error.
 *
 * @typedef {Object} Payload
 */
export type Payload = z.infer<typeof Payload>;

/**
 * Zod schema for the properties of a TransmutedError.
 */
export const TransmutedErrorProps = z.object({
  message: z.string(),
  name: z.string(),
  severity: Severity.optional(),
  origin: z.unknown().optional(),
  cause: z.string().optional(),
  payload: Payload.optional(),
  module: z.string().optional(),
  context: z.string().optional(),
  errorCode: ErrorCode.optional(),
});

/**
 * Type for the properties of a TransmutedError.
 *
 * @typedef {Object} TransmutedErrorProps
 * @property {string} message - The error message.
 * @property {string} name - The name of the error.
 * @property {Severity} [severity] - The severity of the error.
 * @property {unknown} [origin] - The origin of the error.
 * @property {string} [cause] - The cause of the error.
 * @property {Payload} [payload] - The payload of the error.
 * @property {string} [module] - The module where the error originated.
 * @property {string} [context] - The context of the error.
 * @property {ErrorCode} [errorCode] - The error code.
 */
export type TransmutedErrorProps = z.infer<typeof TransmutedErrorProps>;
