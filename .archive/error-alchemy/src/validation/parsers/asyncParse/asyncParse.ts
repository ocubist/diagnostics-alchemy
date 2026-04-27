import { ZodError, ZodSchema } from "zod";
import { useErrorAlchemy } from "../../../crafting/useErrorAlchemy/useErrorAlchemy";
import { extractZodErrorValidationDetails } from "../../../utility/PropsValidationError";

const { craftMysticError, craftErrorTransmuter } = useErrorAlchemy(
  "ErrorAlchemy",
  "asyncParse-function"
);

/**
 * Type for AsyncParseFailedError.
 */
export type AsyncParseFailedError = InstanceType<
  ReturnType<typeof craftMysticError>
>;

export const AsyncParseFailedError = craftMysticError({
  name: "AsyncParseFailedError",
  errorCode: "VALIDATION_ERROR",
  severity: "unexpected",
});

const parseFailedTransmuter = craftErrorTransmuter(
  (err) => err instanceof ZodError,
  (err: ZodError) => {
    const details = extractZodErrorValidationDetails(err);
    return new AsyncParseFailedError({
      message: details.map((d) => d.msg).join(" | "),
      payload: {
        validationErrorDetails: details,
      },
      origin: err,
    });
  }
);

/**
 * Asynchronously parses a value against a Zod schema.
 *
 * @template T
 * @param {T} value - The value to parse.
 * @param {ZodSchema<T>} schema - The Zod schema to parse against.
 * @returns {Promise<T>} A promise that resolves to the parsed value.
 * @throws {AsyncParseFailedError} If parsing fails.
 */
export const asyncParse: <T>(
  value: T,
  schema: ZodSchema<T>
) => Promise<T> = async (value, schema) => {
  try {
    if (schema) return await schema.parse(value);
    else return value;
  } catch (err) {
    throw parseFailedTransmuter.execute(err);
  }
};
