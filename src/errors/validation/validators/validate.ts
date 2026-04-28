import type { ZodSchema } from "zod";

/** Synchronously validates `value` against `schema`. Returns true if valid. */
export const validate = <T>(value: unknown, schema: ZodSchema<T>): value is T =>
  schema.safeParse(value).success;
