import { useApiHandlerErrorAlchemy } from "../useApiHandlerErrorAlchemy";

const axiosErrorsAlchemy = useApiHandlerErrorAlchemy("AxiosErrors");

/**
 * Error representing an HTTP response error with a status code from the server.
 */
export const HttpResponseError = axiosErrorsAlchemy.craftMysticError({
  name: "HttpResponseError",
  cause: "Server responded with an error status code",
  severity: "critical",
  errorCode: "HTTP_INTERNAL_SERVER_ERROR",
});

/**
 * Error representing a network connectivity issue.
 */
export const NetworkError = axiosErrorsAlchemy.craftMysticError({
  name: "NetworkError",
  cause: "Network connectivity issue",
  severity: "critical",
  errorCode: "NETWORK_CONNECTION_REFUSED",
});

/**
 * Error representing an unexpected Axios error.
 */
export const UnexpectedAxiosError = axiosErrorsAlchemy.craftMysticError({
  name: "UnexpectedAxiosError",
  cause: "The cause is unknown and might need attention",
  severity: "unexpected",
  errorCode: "UNKNOWN_ERROR",
});

/**
 * Error representing a timeout error when the server takes too long to respond.
 */
export const TimeoutError = axiosErrorsAlchemy.craftMysticError({
  name: "TimeoutError",
  cause: "The server took too long to send a response",
  severity: "critical",
  errorCode: "NETWORK_TIMEOUT",
});
