import { NotNodeEnvironmentError } from "./errors";
import { isNodeEnvironment } from "./isNodeEnvironment";

/**
 * Checks if the current environment is a Node.js production environment.
 * Logs an error if the function is called outside of a Node.js environment.
 *
 * @returns {boolean} True if the current environment is production, otherwise false.
 */
export const isProduction = (): boolean => {
  if (!isNodeEnvironment()) {
    console.error(
      new NotNodeEnvironmentError({
        message:
          "This function is made for a node-environment. Unexpected behavior might occur.",
      })
    );
    return false;
  }

  return process.env.NODE_ENV === "production";
};
