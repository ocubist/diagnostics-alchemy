import { MysticError } from "@ocubist/error-alchemy";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { UnexpectedError } from "../error-handling/errors/unknown";
import { axiosErrorTransmuter } from "../error-handling/transmuters/axios";
import { parsePathParams } from "../error-handling/validators/pathParams/parsePathParams";
import { parseQueryParams } from "../error-handling/validators/queryParams/parseQueryParams";
import { parseRequestBody } from "../error-handling/validators/requestBody/parseRequestBody";
import { parseResponseBody } from "../error-handling/validators/responseBody/parseResponseBody";
import { parseRetryOptions } from "../error-handling/validators/retryOptions/parseRetryOptions";
import { parseTimeout } from "../error-handling/validators/timeout/parseTimeout";
import {
  checkResponseFor2xx,
  checkResponseFor5xx,
} from "../helpers/checkResponse";
import { mergeHeadersWithDefaults } from "../helpers/mergeHeadersWithDefaults";
import { replacePathParams } from "../helpers/replacePathParams";
import { HttpResponse } from "../types/HttpResponse";
import {
  MakeHttpRequestProps,
  RefinedRequestProps,
} from "../types/MakeHttpRequestProps";
import { PathParams } from "../types/PathParams";
import { QueryParams } from "../types/QueryParams";
import { parseUrl } from "../error-handling/validators/url/parseUrl";
import { Headers } from "../types/Headers";

/**
 * Makes an HTTP request based on the provided parameters.
 *
 * @template TPathParams
 * @template TQueryParams
 * @template TRequestBody
 * @template TResponseBody
 * @param {MakeHttpRequestProps<TPathParams, TQueryParams, TRequestBody, TResponseBody>} params - The properties required to make the HTTP request.
 * @returns {Promise<HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>>} - The HTTP response.
 * @throws {QueryParsingError} - Error parsing query parameters.
 * @throws {RequestBodyParsingError} - Error parsing request body.
 * @throws {PathParameterParsingError} - Error parsing path parameters.
 * @throws {UrlValidationError} - The provided URL is invalid.
 * @throws {InvalidTimeoutError} - Invalid timeout provided.
 * @throws {RetryOptionsParsingError} - The provided RetryOptions are invalid.
 * @throws {HttpResponseError} - Server responded with an error status code.
 * @throws {NetworkError} - Network connectivity issue.
 * @throws {UnexpectedAxiosError} - An unexpected Axios error occurred.
 * @throws {TimeoutError} - The server took too long to send a response.
 * @throws {ResponseParsingError} - Error parsing server response.
 * @throws {UnexpectedError} - An unexpected error occurred.
 */
export const makeHttpRequest = async <
  TPathParams = PathParams,
  TQueryParams = QueryParams,
  TRequestBody = any,
  TResponseBody = any
>(
  params: MakeHttpRequestProps<
    TPathParams,
    TQueryParams,
    TRequestBody,
    TResponseBody
  >
): Promise<
  HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>
> => {
  const startTime = performance.now();

  const { method, urlTemplate, logger } = params;

  let requestBody: TRequestBody | undefined;
  let url: string | undefined;
  let status: number | undefined;
  let responseBody: TResponseBody | undefined;
  let success: boolean = false;
  let headers: Headers | undefined;
  let attempts: number | undefined;
  let duration: number | undefined;

  try {
    // * Timeout
    const timeout: number = parseTimeout(params.timeout);

    // * RetryOptions
    const retryOptions = parseRetryOptions(params.retryOptions);

    // * ResponseType
    const responseType = params.responseType ?? "json";

    // * PathParams-Validation
    const pathParams = parsePathParams(
      params.pathParams?.val,
      params.pathParams?.schema
    );

    // * URL
    url = parseUrl(replacePathParams(urlTemplate, pathParams ?? {}));

    // * QueryParams
    const queryParams = parseQueryParams(
      params.queryParams?.val,
      params.queryParams?.schema
    );

    // * RequestBody

    requestBody = parseRequestBody<TRequestBody>(
      params.requestBody?.val,
      params.requestBody?.schema
    );

    // * Headers
    headers = mergeHeadersWithDefaults(params.headers ?? {});

    // * Set up axios configuration
    const axiosConfig: AxiosRequestConfig = {
      method,
      url,
      params: queryParams,
      data: requestBody,
      headers,
      timeout,
      responseType,
    };

    let firstError: any = undefined;

    // * Make the actual request
    for (
      attempts = 1;
      attempts - 1 <= retryOptions.retries;
      (attempts as number)++
    ) {
      try {
        const response = await axios(axiosConfig);
        status = response.status;
        responseBody = parseResponseBody<TResponseBody>(
          response.data,
          params.responseBodySchema
        );
        success = checkResponseFor2xx(response);

        const endTime = performance.now(); // End time
        duration = endTime - startTime;

        const httpResponse: HttpResponse<
          TPathParams,
          TQueryParams,
          TRequestBody,
          TResponseBody
        > = {
          success,
          data: responseBody,
          status,
          // @ts-ignore
          headers: response.headers as Record<string, string>,
          axiosConfig,
          requestProps: {
            url,
            headers,
            method,
            responseType,
            retryOptions,
            timeout,
            pathParams,
            queryParams,
            requestBody,
          } as RefinedRequestProps<TPathParams, TQueryParams, TRequestBody>,
          originalRequestProps: params as MakeHttpRequestProps<
            TPathParams,
            TQueryParams,
            TRequestBody,
            TResponseBody
          >,
          statusText: response.statusText,
          url,
          duration,
          attempts,
        };

        if (attempts > 1) {
          httpResponse.attempts = attempts;
        }

        if (logger) {
          logger({
            attempts,
            method,
            success,
            urlTemplate,
            headers,
            requestBody,
            responseBody,
            status,
            url,
            duration,
          });
        }

        return httpResponse;
      } catch (errInRequest) {
        if (errInRequest instanceof AxiosError) {
          if (firstError === undefined) {
            firstError = errInRequest;
          }

          const isRetriable =
            !errInRequest.response || // Network-Error
            (errInRequest.response &&
              checkResponseFor5xx(errInRequest.response)); // Server-Error

          if (isRetriable) {
            const delay =
              retryOptions.initialDelay *
              Math.pow(retryOptions.backoffMultiplier, attempts - 1);
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          } else {
            throw axiosErrorTransmuter.transmute(errInRequest);
          }
        }

        throw errInRequest;
      }
    }

    // If all retries are exhausted, throw the first captured error
    if (firstError) {
      throw axiosErrorTransmuter.transmute(firstError);
    }

    // As a last resort, if no error was captured, throw an UnexpectedError
    throw new UnexpectedError({
      message:
        "This error should not have happened. It occurred because all retries were exhausted and no error got thrown. Something went seriously wrong inside the makeHttpRequest-Function...",
    });
  } catch (err) {
    const endTime = performance.now();
    duration = endTime - startTime;
    if (logger) {
      logger({
        attempts,
        method,
        success,
        urlTemplate,
        headers,
        requestBody,
        responseBody,
        status,
        url,
        duration,
      });
    }

    if (err instanceof MysticError) {
      // Inject params into payload
      err.payload = { ...err.payload, params, duration: endTime - startTime };

      throw err;
    } else {
      throw new UnexpectedError({
        message: "An unexpected error occurred",
        origin: err,
        payload: { params, duration: endTime - startTime },
      }); // Inject params into payload
    }
  }
};
