/**
 * Headers for HTTP requests.
 */
export type Headers = Record<string, string>;

/**
 * Default headers for HTTP requests.
 */
export const defaultHeaders: Headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};
