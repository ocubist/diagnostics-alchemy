import { NotNodeEnvironmentError } from "./errors";
import { isNodeEnvironment } from "./isNodeEnvironment";

/**
 * Checks if the current environment is a server (Node.js without window object).
 * Logs an error if the function is called outside of a Node.js environment.
 *
 * @returns {boolean} True if the current environment is a server, otherwise false.
 */
export const isServer = (): boolean => {
  if (!isNodeEnvironment()) {
    console.error(
      new NotNodeEnvironmentError({
        message:
          "This function is made for a node-environment. Unexpected behavior might occur.",
      })
    );
  }

  return typeof window === "undefined";
};
