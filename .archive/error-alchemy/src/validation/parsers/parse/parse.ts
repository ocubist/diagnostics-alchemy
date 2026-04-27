import { ZodError, ZodSchema } from "zod";
import { useErrorAlchemy } from "../../../crafting/useErrorAlchemy/useErrorAlchemy";
import { extractZodErrorValidationDetails } from "../../../utility/PropsValidationError";

const { craftMysticError, craftErrorTransmuter } = useErrorAlchemy(
  "ErrorAlchemy",
  "parse-function"
);

/**
 * Type for ParseFailedError.
 */
export type ParseFailedError = InstanceType<
  ReturnType<typeof craftMysticError>
>;

export const ParseFailedError = craftMysticError({
  name: "ParseFailedError",
  errorCode: "VALIDATION_ERROR",
  severity: "unexpected",
});

const parseFailedTransmuter = craftErrorTransmuter(
  (err) => err instanceof ZodError,
  (err: ZodError) => {
    const details = extractZodErrorValidationDetails(err);
    return new ParseFailedError({
      message: details.map((d) => d.msg).join(" | "),
      payload: {
        validationErrorDetails: details,
      },
      origin: err,
    });
  }
);

/**
 * Synchronously parses a value against a Zod schema.
 *
 * @template T
 * @param {T} value - The value to parse.
 * @param {ZodSchema<T>} schema - The Zod schema to parse against.
 * @returns {T} The parsed value.
 * @throws {ParseFailedError} If parsing fails.
 */
export const parse: <T>(value: T, schema: ZodSchema<T>) => T = (
  value,
  schema
) => {
  try {
    return schema.parse(value);
  } catch (err) {
    throw parseFailedTransmuter.execute(err);
  }
};
