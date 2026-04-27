import { useErrorAlchemy } from "@ocubist/error-alchemy";

/**
 * Hook to use the error alchemy for the HTTP request handler.
 *
 * @param {string} context - The context for the error alchemy.
 * @returns {ReturnType<typeof useErrorAlchemy>} - The error alchemy instance for the given context.
 */
export const useApiHandlerErrorAlchemy = (context: string) =>
  useErrorAlchemy("http-request-handler", context);
