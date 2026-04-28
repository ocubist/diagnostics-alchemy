import { ZodError, type ZodSchema } from "zod";
import { useErrorAlchemy } from "../../crafting/useErrorAlchemy/useErrorAlchemy";
import { extractZodErrorValidationDetails } from "../../utility/PropsValidationError";

const { craftMysticError, craftErrorTransmuter } = useErrorAlchemy(
  "diagnostics-alchemy",
  "asyncParse"
);

export const AsyncParseFailedError = craftMysticError({
  name: "AsyncParseFailedError",
  errorCode: "VALIDATION_ERROR",
  severity: "unexpected",
  reason: "Async Zod schema parsing failed",
});

export type AsyncParseFailedError = InstanceType<typeof AsyncParseFailedError>;

const transmuter = craftErrorTransmuter(
  (err) => err instanceof ZodError,
  (err: ZodError) => {
    const details = extractZodErrorValidationDetails(err);
    return new AsyncParseFailedError({
      message: details.map((d) => d.msg).join(" | "),
      payload: { validationErrorDetails: details },
      origin: err,
    });
  }
);

/** Async version of `parse`. Throws AsyncParseFailedError on failure. */
export const asyncParse = async <T>(value: unknown, schema: ZodSchema<T>): Promise<T> => {
  try {
    return await schema.parseAsync(value);
  } catch (err) {
    throw transmuter.execute(err);
  }
};
