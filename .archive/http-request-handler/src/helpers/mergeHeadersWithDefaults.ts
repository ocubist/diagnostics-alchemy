import { Headers, defaultHeaders } from "../types/Headers";

/**
 * Merges the provided headers with the default headers.
 *
 * @param {Headers} headers - The headers to merge with the default headers.
 * @returns {Headers} - The merged headers.
 */
export const mergeHeadersWithDefaults = (headers: Headers): Headers => {
  return { ...defaultHeaders, ...headers };
};
