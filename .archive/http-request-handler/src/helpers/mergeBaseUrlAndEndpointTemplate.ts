/**
 * Merges the base URL and endpoint template into a single URL.
 *
 * @param {string} baseUrl - The base URL.
 * @param {string} endpointTemplate - The endpoint template.
 * @returns {string} - The merged URL.
 */
export const mergeBaseUrlAndEndpointTemplate = (
  baseUrl: string,
  endpointTemplate: string
) => {
  const theBaseUrl = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
  const theEndpoint = endpointTemplate.startsWith("/")
    ? endpointTemplate.slice(1)
    : endpointTemplate;

  return theBaseUrl + theEndpoint;
};
