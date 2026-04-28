import type { ZodSchema } from "zod";

/** Asynchronously validates `value` against `schema`. Resolves to true if valid. */
export const asyncValidate = async <T>(
  value: unknown,
  schema: ZodSchema<T>
): Promise<boolean> => {
  const result = await schema.safeParseAsync(value);
  return result.success;
};
