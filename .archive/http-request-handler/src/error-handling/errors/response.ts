import { useApiHandlerErrorAlchemy } from "../useApiHandlerErrorAlchemy";

const responseErrorsAlchemy = useApiHandlerErrorAlchemy("ResponseErrors");

/**
 * Error representing an issue parsing the server response.
 */
export const ResponseParsingError = responseErrorsAlchemy.craftMysticError({
  name: "ResponseParsingError",
  cause: "Error parsing server response",
  severity: "unexpected",
  errorCode: "DATA_SERIALIZATION_ERROR",
});
