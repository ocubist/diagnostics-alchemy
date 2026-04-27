import { defaultTimeout } from "../../../types/Timeout";
import { InvalidTimeoutError } from "../../errors/request";

/**
 * Parses and validates the timeout value, ensuring it falls within the allowed range.
 *
 * @param {number} [timeout] - The timeout value to be validated.
 * @returns {number} - The validated timeout value or the default timeout if not provided.
 * @throws {InvalidTimeoutError} - If the timeout value is out of the allowed range.
 */
export const parseTimeout = (timeout?: number): number => {
  if (timeout !== undefined && (timeout < 500 || timeout > 30000)) {
    throw new InvalidTimeoutError({
      message: "Timeout must be at least 500 and at max 30000",
    });
  }

  return timeout ?? defaultTimeout;
};
