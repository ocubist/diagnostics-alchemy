import { ZodError, type ZodSchema } from "zod";
import { useErrorAlchemy } from "../../crafting/useErrorAlchemy/useErrorAlchemy";
import { extractZodErrorValidationDetails } from "../../utility/PropsValidationError";

const { craftMysticError, craftErrorTransmuter } = useErrorAlchemy(
  "diagnostics-alchemy",
  "assert"
);

export const AssertFailedError = craftMysticError({
  name: "AssertFailedError",
  errorCode: "DATA_INTEGRITY_VIOLATION",
  severity: "critical",
  reason: "Zod schema assertion failed",
});

export type AssertFailedError = InstanceType<typeof AssertFailedError>;

const transmuter = craftErrorTransmuter(
  (err) => err instanceof ZodError,
  (err: ZodError) => {
    const details = extractZodErrorValidationDetails(err);
    return new AssertFailedError({
      message: details.map((d) => d.msg).join(" | "),
      payload: { validationErrorDetails: details },
      origin: err,
    });
  }
);

/** Asserts that `value` matches `schema`, throwing AssertFailedError on failure. */
export function assert<T>(value: unknown, schema?: ZodSchema<T>): asserts value is T {
  if (!schema) return;
  try {
    schema.parse(value);
  } catch (err) {
    throw transmuter.execute(err);
  }
}
