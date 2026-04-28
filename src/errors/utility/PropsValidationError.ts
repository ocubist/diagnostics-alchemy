import { ZodError } from "zod";

export interface ZodErrorValidationDetail {
  path: string;
  msg: string;
}

export const extractZodErrorValidationDetails = (
  zod: ZodError
): ZodErrorValidationDetail[] =>
  zod.errors.map((e) => ({ path: e.path.join("."), msg: e.message }));

export const stringifyZodErrorValidationDetails = (
  details: ZodErrorValidationDetail[]
): string => details.map((d) => `${d.path}: ${d.msg}`).join(" | ");

/** Thrown when the props passed to a crafted error constructor fail Zod validation. */
export class AlchemyPropsValidationError extends Error {
  readonly zodError: ZodError;

  constructor(zodError: ZodError) {
    super(
      `Props validation failed: '${stringifyZodErrorValidationDetails(
        extractZodErrorValidationDetails(zodError)
      )}'`
    );
    this.name = "AlchemyPropsValidationError";
    this.zodError = zodError;
    Object.setPrototypeOf(this, AlchemyPropsValidationError.prototype);
  }
}
