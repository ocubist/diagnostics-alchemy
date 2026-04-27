import { ErrorCode } from "./types";

/**
 * Checks if a given string is a valid error code.
 *
 * @param {string} errorCode - The error code to check.
 * @returns {boolean} True if the error code is valid, false otherwise.
 */
export const isErrorCode = (errorCode: string): boolean => {
  return ErrorCode.safeParse(errorCode).success;
};
