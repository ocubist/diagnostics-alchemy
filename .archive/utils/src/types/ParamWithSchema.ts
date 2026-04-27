import { ZodSchema } from "zod";

/**
 * Interface representing a parameter with an optional Zod schema.
 *
 * @template T - The type of the parameter value.
 * @property {T} val - The value of the parameter.
 * @property {ZodSchema<T>} [schema] - An optional Zod schema for validating the parameter value.
 */
export interface ParamWithOptionalSchema<T> {
  val: T;
  schema?: ZodSchema<T>;
}

/**
 * Interface representing a parameter with a required Zod schema.
 *
 * @template T - The type of the parameter value.
 * @property {T} val - The value of the parameter.
 * @property {ZodSchema<T>} schema - A required Zod schema for validating the parameter value.
 */
export interface ParamWithSchema<T> {
  val: T;
  schema: ZodSchema<T>;
}
