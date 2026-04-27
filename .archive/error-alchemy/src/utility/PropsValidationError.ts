import { ZodError, z } from "zod";

/**
 * ZodErrorValidationDetails schema.
 */
export const ZodErrorValidationDetails = z.object({
  path: z.string(),
  msg: z.string(),
});
export type ZodErrorValidationDetails = z.infer<
  typeof ZodErrorValidationDetails
>;

/**
 * Extracts validation details from a ZodError.
 *
 * @param {ZodError} zod - The ZodError to extract details from.
 * @returns {ZodErrorValidationDetails[]} An array of validation details.
 */
export const extractZodErrorValidationDetails = (
  zod: ZodError
): ZodErrorValidationDetails[] => {
  return zod.errors.map((e) => {
    return {
      path: e.path.join("."),
      msg: e.message,
    };
  });
};

/**
 * Converts an array of ZodErrorValidationDetails to a string.
 *
 * @param {ZodErrorValidationDetails[]} validationDetails - The validation details to stringify.
 * @returns {string} The stringified validation details.
 */
export const stringifyZodErrorValidationDetails = (
  validationDetails: ZodErrorValidationDetails[]
): string => {
  return validationDetails
    .map((vd) => {
      return `${vd.path}: ${vd.msg}`;
    })
    .join(" | ");
};

/**
 * Error class for property validation errors using Zod.
 */
export class AlchemyPropsValidationError extends Error {
  zodError: ZodError;

  /**
   * Constructs a new AlchemyPropsValidationError.
   *
   * @param {ZodError} zodError - The ZodError that caused the validation error.
   */
  constructor(zodError: ZodError) {
    super(
      `Props failed to validate: '${stringifyZodErrorValidationDetails(
        extractZodErrorValidationDetails(zodError)
      )}'`
    );
    this.zodError = zodError;
  }
}
