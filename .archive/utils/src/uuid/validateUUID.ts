import { validate } from "uuid";

/**
 * Validates a given UUID string.
 *
 * @param {string} uuid - The UUID string to validate.
 * @returns {boolean} True if the UUID is valid, otherwise false.
 */
export const validateUUID = (uuid: string): boolean => {
  return validate(uuid);
};
