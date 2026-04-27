import { ResponseType } from "axios";
import { ZodSchema } from "zod";
import { Headers } from "./Headers";
import { Logger } from "./Logger";
import { PathParams } from "./PathParams";
import { QueryParams } from "./QueryParams";
import { OptionalRetryOptions } from "./RetryOptions";
import { Timeout } from "./Timeout";

/**
 * Interface representing the properties for setting up the HTTP request handler.
 */
export interface UseHttpRequestHandlerProps {
  /** The base URL for the HTTP requests. */
  baseUrl: string;

  /** Optional headers to include in all requests. */
  headers?: Headers;

  /** Optional retry options for the requests. */
  retryOptions?: OptionalRetryOptions;

  /** Optional timeout for the requests in milliseconds. */
  timeout?: Timeout;

  /** Optional response type for the requests (e.g., json, blob). */
  responseType?: ResponseType;

  /** Optional logger function to log request details. */
  logger?: Logger;
}

/**
 * Interface representing the properties for a factory function to create HTTP requests.
 *
 * @template TPathParams - Type of the path parameters.
 * @template TQueryParams - Type of the query parameters.
 * @template TRequestBody - Type of the request body.
 * @template TResponseBody - Type of the response body.
 */
export interface FactoryFunctionProps<
  TPathParams = PathParams,
  TQueryParams = QueryParams,
  TRequestBody = any,
  TResponseBody = any
> {
  /** Optional template for the endpoint URL. */
  endpointTemplate?: string;

  /** Schema for validating the path parameters. */
  pathParamsSchema: ZodSchema<TPathParams>;

  /** Schema for validating the query parameters. */
  queryParamsSchema: ZodSchema<TQueryParams>;

  /** Schema for validating the request body. */
  requestBodySchema: ZodSchema<TRequestBody>;

  /** Optional headers to include in the request. */
  headers?: Headers;

  /** Optional retry options for the request. */
  retryOptions?: OptionalRetryOptions;

  /** Optional timeout for the request in milliseconds. */
  timeout?: Timeout;

  /** Optional response type for the request (e.g., json, blob). */
  responseType?: ResponseType;

  /** Optional schema to validate the response body. */
  responseBodySchema?: ZodSchema<TResponseBody>;

  /** Optional logger function to log request details. */
  logger?: Logger;
}

/**
 * Interface representing the properties for a factory function to create HTTP requests without a request body.
 *
 * @template TPathParams - Type of the path parameters.
 * @template TQueryParams - Type of the query parameters.
 * @template TResponseBody - Type of the response body.
 */
export interface FactoryFunctionPropsWithoutRequestBody<
  TPathParams = PathParams,
  TQueryParams = QueryParams,
  TResponseBody = any
> extends Omit<
    FactoryFunctionProps<TPathParams, TQueryParams, never, TResponseBody>,
    "requestBodySchema"
  > {}
