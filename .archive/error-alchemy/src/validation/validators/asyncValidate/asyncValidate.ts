import { ZodSchema } from "zod";

/**
 * Asynchronously validates a value against a Zod schema.
 *
 * @template T
 * @param {T} value - The value to validate.
 * @param {ZodSchema<T>} schema - The Zod schema to validate against.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the value is valid.
 */
export const asyncValidate: <T>(
  value: T,
  schema: ZodSchema<T>
) => Promise<boolean> = async (value, schema) => {
  return schema.safeParse(value).success;
};
