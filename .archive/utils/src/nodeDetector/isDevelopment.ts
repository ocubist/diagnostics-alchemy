import { NotNodeEnvironmentError } from "./errors";
import { isNodeEnvironment } from "./isNodeEnvironment";

/**
 * Checks if the current environment is a Node.js development environment.
 * Logs an error if the function is called outside of a Node.js environment.
 *
 * @returns {boolean} True if the current environment is development, otherwise false.
 */
export const isDevelopment = (): boolean => {
  if (!isNodeEnvironment()) {
    console.error(
      new NotNodeEnvironmentError({
        message:
          "This function is made for a node-environment. Unexpected behavior might occur.",
      })
    );
    return false;
  }

  return process.env.NODE_ENV === "development";
};
