import { V4Options, v4 as uuidV4 } from "uuid";

/**
 * Creates a new UUID (version 4).
 *
 * @param {V4Options} [options] - Optional configuration options for generating the UUID.
 * @returns {string} A new UUID string.
 */
export const createUUID = (options?: V4Options): string => {
  return uuidV4(options);
};
