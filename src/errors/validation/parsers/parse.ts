import { ZodError, type ZodSchema } from "zod";
import { useErrorAlchemy } from "../../crafting/useErrorAlchemy/useErrorAlchemy";
import { extractZodErrorValidationDetails } from "../../utility/PropsValidationError";

const { craftMysticError, craftErrorTransmuter } = useErrorAlchemy(
  "diagnostics-alchemy",
  "parse"
);

export const ParseFailedError = craftMysticError({
  name: "ParseFailedError",
  errorCode: "VALIDATION_ERROR",
  severity: "unexpected",
  reason: "Zod schema parsing failed",
});

export type ParseFailedError = InstanceType<typeof ParseFailedError>;

const transmuter = craftErrorTransmuter(
  (err) => err instanceof ZodError,
  (err: ZodError) => {
    const details = extractZodErrorValidationDetails(err);
    return new ParseFailedError({
      message: details.map((d) => d.msg).join(" | "),
      payload: { validationErrorDetails: details },
      origin: err,
    });
  }
);

/** Parses `value` against `schema`, throwing ParseFailedError on failure. */
export const parse = <T>(value: unknown, schema: ZodSchema<T>): T => {
  try {
    return schema.parse(value);
  } catch (err) {
    throw transmuter.execute(err);
  }
};
