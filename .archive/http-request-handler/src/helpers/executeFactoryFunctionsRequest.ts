import { ZodSchema } from "zod";
import { mergeBaseUrlAndEndpointTemplate } from "../helpers/mergeBaseUrlAndEndpointTemplate";
import { makeHttpRequest } from "../requests/makeHttpRequest";
import { ExecuteFactoryFunctionsRequestProps } from "../types/ExecuteFactoryFunctionsRequestProps";
import { HttpResponse } from "../types/HttpResponse";
import { MakeHttpRequestProps } from "../types/MakeHttpRequestProps";
import { PathParams } from "../types/PathParams";
import { QueryParams } from "../types/QueryParams";
import { Headers } from "../types/Headers";
import {
  QueryParsingError,
  RequestBodyParsingError,
  PathParameterParsingError,
  UrlValidationError,
  InvalidTimeoutError,
  RetryOptionsParsingError,
} from "../error-handling/errors/request";
import {
  HttpResponseError,
  NetworkError,
  UnexpectedAxiosError,
  TimeoutError,
} from "../error-handling/errors/axios";
import { ResponseParsingError } from "../error-handling/errors/response";
import { UnexpectedError } from "../error-handling/errors/unknown";

/**
 * Executes an HTTP request using the provided factory function properties.
 *
 * @template TPathParams
 * @template TQueryParams
 * @template TRequestBody
 * @template TResponseBody
 * @param {ExecuteFactoryFunctionsRequestProps<TPathParams, TQueryParams, TRequestBody, TResponseBody>} props - The properties required to execute the request.
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
export const executeFactoryFunctionsRequest = async <
  TPathParams,
  TQueryParams,
  TRequestBody,
  TResponseBody
>(
  props: ExecuteFactoryFunctionsRequestProps<
    TPathParams,
    TQueryParams,
    TRequestBody,
    TResponseBody
  >
): Promise<
  HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>
> => {
  const {
    mainProps: {
      baseUrl,
      headers: mainHeaders,
      retryOptions: mainRetryOptions,
      timeout: mainTimeout,
      responseType: mainResponseType,
      logger: mainLogger,
    },
    factoryProps: {
      endpointTemplate,
      pathParamsSchema,
      queryParamsSchema,
      requestBodySchema,
      headers: subHeaders,
      retryOptions: specifiedRetryOptions,
      timeout: specifiedTimeout,
      responseType: specifiedResponseType,
      responseBodySchema,
      logger: specificLogger,
    },
    params: { pathParams, queryParams, requestBody },
    method,
  } = props;

  const urlTemplate = mergeBaseUrlAndEndpointTemplate(
    baseUrl,
    endpointTemplate || ""
  );

  const makeHttpRequestProps: MakeHttpRequestProps<
    TPathParams,
    TQueryParams,
    TRequestBody,
    TResponseBody
  > = {
    urlTemplate,
    method,
    headers: { ...mainHeaders, ...subHeaders } as Headers,
    timeout: specifiedTimeout ?? mainTimeout,
    retryOptions: {
      ...(mainRetryOptions ?? {}),
      ...(specifiedRetryOptions ?? {}),
    },
    responseType: specifiedResponseType ?? mainResponseType,
    responseBodySchema,
    pathParams: { val: pathParams, schema: pathParamsSchema },
    queryParams: { val: queryParams, schema: queryParamsSchema },
    requestBody: { val: requestBody!, schema: requestBodySchema },
    logger: specificLogger ?? mainLogger ?? undefined,
  };

  return makeHttpRequest(makeHttpRequestProps);
};

/**
 * Executes an HTTP request without a request body using the provided factory function properties.
 *
 * @template TPathParams
 * @template TQueryParams
 * @template TResponseBody
 * @param {Omit<ExecuteFactoryFunctionsRequestProps<TPathParams, TQueryParams, never, TResponseBody>, "factoryProps"> & { factoryProps: Omit<ExecuteFactoryFunctionsRequestProps<TPathParams, TQueryParams, never, TResponseBody>["factoryProps"], "requestBodySchema">; }} props - The properties required to execute the request.
 * @returns {Promise<HttpResponse<TPathParams, TQueryParams, never, TResponseBody>>} - The HTTP response.
 * @throws {QueryParsingError} - Error parsing query parameters.
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
export const executeFactoryFunctionsRequestWithoutRequestBody = async <
  TPathParams = PathParams,
  TQueryParams = QueryParams,
  TResponseBody = any
>(
  props: Omit<
    ExecuteFactoryFunctionsRequestProps<
      TPathParams,
      TQueryParams,
      never,
      TResponseBody
    >,
    "factoryProps"
  > & {
    factoryProps: Omit<
      ExecuteFactoryFunctionsRequestProps<
        TPathParams,
        TQueryParams,
        never,
        TResponseBody
      >["factoryProps"],
      "requestBodySchema"
    >;
  }
): Promise<HttpResponse<TPathParams, TQueryParams, never, TResponseBody>> => {
  return executeFactoryFunctionsRequest({
    ...props,
    factoryProps: {
      ...props.factoryProps,
      requestBodySchema: undefined as unknown as ZodSchema<never>,
    },
    params: {
      ...props.params,
      requestBody: undefined as unknown as never,
    },
  });
};
