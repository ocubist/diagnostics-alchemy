import { QueryParams } from "../../../src/types/QueryParams";

export const addQueryParamsToUrl = (
  baseUrl: string,
  queryParams?: QueryParams
): string => {
  // Create a new URL object from the base URL
  const url = new URL(baseUrl);

  if (queryParams !== undefined) {
    // Create URLSearchParams object from the queryParams
    const params = new URLSearchParams();

    // Append each query parameter to the URLSearchParams object
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((val) => params.append(key, val.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    // Append query parameters to the URL
    url.search = params.toString();
  }

  // Return the full URL string
  return url.toString();
};
