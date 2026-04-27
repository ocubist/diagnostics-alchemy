import { PathParams } from "../types/PathParams";

/**
 * Replaces the path parameters in the URL template with their corresponding values.
 *
 * @param {string} urlTemplate - The URL template containing path parameters.
 * @param {PathParams} pathParams - The path parameters to replace in the URL template.
 * @returns {string} - The URL with the path parameters replaced.
 */
export const replacePathParams = (
  urlTemplate: string,
  pathParams: PathParams
): string => {
  return Object.keys(pathParams).reduce((url, key) => {
    const value = pathParams[key];
    if (value !== undefined) {
      return url.replace(`{${key}}`, encodeURIComponent(value));
    }
    return url;
  }, urlTemplate);
};
