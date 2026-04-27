import { useErrorAlchemy } from "@ocubist/error-alchemy";
import { validateUUID } from "./validateUUID";

const { craftMysticError } = useErrorAlchemy("utils-uuid", "assertUUID");

/**
 * Custom error for UUID validation failures.
 *
 * @typedef {Object} AssertUUIDFailedError
 * @property {string} name - The name of the error.
 * @property {string} cause - The cause of the error.
 * @property {string} errorCode - The error code associated with the error.
 */
export const AssertUUIDFailedError = craftMysticError({
  name: "AssertUUIDFailedError",
  cause: "UUID-Validation failed",
  errorCode: "DATA_INTEGRITY_VIOLATION",
});

/**
 * Asserts that a given string is a valid UUID. Throws an error if the validation fails.
 *
 * @param {string} uuid - The UUID string to validate.
 * @throws {AssertUUIDFailedError} If the provided string is not a valid UUID.
 */
export const assertUUID = (uuid: string): asserts uuid is string => {
  if (!validateUUID(uuid)) {
    throw new AssertUUIDFailedError({
      message: `The provided value is not a valid UUID: ${uuid}`,
      payload: { uuid },
    });
  }
};
