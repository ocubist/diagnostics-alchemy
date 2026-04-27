import z, { ZodError, ZodSchema } from "zod";
import { useErrorAlchemy } from "../../../crafting/useErrorAlchemy/useErrorAlchemy";
import { extractZodErrorValidationDetails } from "../../../utility/PropsValidationError";

const { craftMysticError, craftErrorTransmuter } = useErrorAlchemy(
  "ErrorAlchemy",
  "assert-function"
);

/**
 * Type for AssertFailedError.
 */
export type AssertFailedError = InstanceType<
  ReturnType<typeof craftMysticError>
>;

export const AssertFailedError = craftMysticError({
  name: "AssertFailedError",
  errorCode: "DATA_INTEGRITY_VIOLATION",
  severity: "critical",
  reason: "Zod validation failed",
});

const assertFailedTransmuter = craftErrorTransmuter(
  (err) => err instanceof ZodError,
  (err: ZodError) => {
    const details = extractZodErrorValidationDetails(err);
    return new AssertFailedError({
      message: details.map((d) => d.msg).join(" | "),
      payload: {
        validationErrorDetails: details,
      },
      origin: err,
    });
  }
);

/**
 * Asserts that a value matches a given Zod schema.
 *
 * @template T
 * @param {unknown} value - The value to assert.
 * @param {ZodSchema<T>} [schema] - The Zod schema to validate against.
 * @throws {AssertFailedError} If the assertion fails.
 */
export function assert<T>(
  value: unknown,
  schema?: ZodSchema<T>
): asserts value is T {
  if (schema !== undefined) {
    try {
      schema.parse(value);
    } catch (err) {
      throw assertFailedTransmuter.execute(err);
    }
  }
}
