import { useApiHandlerErrorAlchemy } from "../useApiHandlerErrorAlchemy";

const unknownErrorsAlchemy = useApiHandlerErrorAlchemy("UnknownErrors");

/**
 * Error representing an unexpected error where the cause is unknown.
 */
export const UnexpectedError = unknownErrorsAlchemy.craftMysticError({
  name: "UnexpectedError",
  cause: "The cause is unknown and might need attention",
  severity: "unexpected",
  errorCode: "UNKNOWN_ERROR",
});
