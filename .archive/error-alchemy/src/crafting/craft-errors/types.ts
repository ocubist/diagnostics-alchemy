import z from "zod";
import { Severity } from "../../severity/types";
import { ErrorCode } from "../../error-code/types";
import { Payload } from "../../transmuted-errors/types";

/**
 * Zod schema for the properties required to craft an error.
 */
export const CraftErrorProps = z.object({
  name: z.string(),
  severity: Severity.optional(),
  reason: z.string().optional(),
  module: z.string().optional(),
  context: z.string().optional(),
  errorCode: ErrorCode.optional(),
});

/**
 * Type for the properties required to craft an error.
 *
 * @typedef {Object} CraftErrorProps
 * @property {string} name - The name of the error.
 * @property {Severity} [severity] - The severity of the error.
 * @property {string} [cause] - The cause of the error.
 * @property {string} [module] - The module where the error originated.
 * @property {string} [context] - The context of the error.
 * @property {ErrorCode} [errorCode] - The error code.
 */
export type CraftErrorProps = z.infer<typeof CraftErrorProps>;

/**
 * Zod schema for the properties of a crafted error.
 */
export const CraftedErrorProps = z.object({
  message: z.string(),
  origin: z.unknown().optional(),
  payload: Payload.optional(),
});

/**
 * Type for the properties of a crafted error.
 *
 * @typedef {Object} CraftedErrorProps
 * @property {string} message - The error message.
 * @property {unknown} [origin] - The origin of the error.
 * @property {Payload} [payload] - The payload of the error.
 */
export type CraftedErrorProps = z.infer<typeof CraftedErrorProps>;
