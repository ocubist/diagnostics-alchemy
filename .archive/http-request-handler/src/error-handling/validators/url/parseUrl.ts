import { UrlValidationError } from "../../errors/request";

/**
 * Validates and parses a URL string.
 *
 * @param {string} url - The URL string to be validated.
 * @returns {string} - The validated URL string.
 * @throws {UrlValidationError} - If the URL is invalid.
 */
export const parseUrl = (url: string) => {
  try {
    return new URL(url).toString();
  } catch {
    throw new UrlValidationError({
      message: "The provided URL is invalid",
      origin: new Error("Invalid URL"),
      payload: { url },
    });
  }
};
