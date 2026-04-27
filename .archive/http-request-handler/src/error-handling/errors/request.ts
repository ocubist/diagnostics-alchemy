import { useApiHandlerErrorAlchemy } from "../useApiHandlerErrorAlchemy";

const requestErrorsAlchemy = useApiHandlerErrorAlchemy("RequestErrors");

/**
 * Error representing an issue parsing query parameters.
 */
export const QueryParsingError = requestErrorsAlchemy.craftMysticError({
  name: "QueryParsingError",
  cause: "Error parsing query parameters",
  severity: "unexpected",
  errorCode: "VALIDATION_INVALID_FORMAT",
});

/**
 * Error representing an issue parsing the request body.
 */
export const RequestBodyParsingError = requestErrorsAlchemy.craftMysticError({
  name: "RequestBodyParsingError",
  cause: "Error parsing request body",
  severity: "critical",
  errorCode: "VALIDATION_INVALID_FORMAT",
});

/**
 * Error representing an issue parsing path parameters.
 */
export const PathParameterParsingError = requestErrorsAlchemy.craftMysticError({
  name: "PathParameterParsingError",
  cause: "Error parsing path parameters",
  severity: "critical",
  errorCode: "VALIDATION_INVALID_FORMAT",
});

/**
 * Error representing an invalid URL.
 */
export const UrlValidationError = requestErrorsAlchemy.craftMysticError({
  name: "UrlValidationError",
  cause: "The provided URL is invalid",
  severity: "critical",
  errorCode: "VALIDATION_INVALID_FORMAT",
});

/**
 * Error representing an invalid timeout value.
 */
export const InvalidTimeoutError = requestErrorsAlchemy.craftMysticError({
  name: "InvalidTimeoutError",
  cause: "Invalid timeout provided",
  severity: "critical",
  errorCode: "CONFIG_INVALID",
});

/**
 * Error representing invalid retry options.
 */
export const RetryOptionsParsingError = requestErrorsAlchemy.craftMysticError({
  name: "RetryOptionsParsingError",
  cause: "The provided RetryOptions are invalid",
  severity: "critical",
  errorCode: "CONFIG_INVALID",
});
