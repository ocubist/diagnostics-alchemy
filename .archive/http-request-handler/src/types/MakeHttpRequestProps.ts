import { ZodSchema } from "zod";
import { Method } from "./Method";
import { PathParams } from "./PathParams";
import { QueryParams } from "./QueryParams";
import { ResponseType } from "axios";
import { OptionalRetryOptions, RetryOptions } from "./RetryOptions";
import { Headers } from "./Headers";
import { Timeout } from "./Timeout";
import { ParamWithOptionalSchema } from "@ocubist/utils";
import { Logger } from "./Logger";

/**
 * Interface representing the properties for making an HTTP request.
 *
 * @template TPathParams - Type of the path parameters.
 * @template TQueryParams - Type of the query parameters.
 * @template TRequestBody - Type of the request body.
 * @template TResponseBody - Type of the response body.
 */
export interface MakeHttpRequestProps<
  TPathParams = PathParams,
  TQueryParams = QueryParams,
  TRequestBody = any,
  TResponseBody = any
> {
  /** The URL template for the request. */
  urlTemplate: string;

  /** The HTTP method for the request (e.g., GET, POST, PUT). */
  method: Method;

  /** Optional headers to include in the request. */
  headers?: Headers;

  /** Optional timeout for the request in milliseconds. */
  timeout?: Timeout;

  /** Optional retry options for the request. */
  retryOptions?: OptionalRetryOptions;

  /** Optional response type for the request (e.g., json, blob). */
  responseType?: ResponseType;

  /** Optional path parameters for the request. */
  pathParams?: ParamWithOptionalSchema<TPathParams>;

  /** Optional query parameters for the request. */
  queryParams?: ParamWithOptionalSchema<TQueryParams>;

  /** Optional request body for the request. */
  requestBody?: ParamWithOptionalSchema<TRequestBody>;

  /** Optional schema to validate the response body. */
  responseBodySchema?: ZodSchema<TResponseBody>;

  /** Optional logger function to log request details. */
  logger?: Logger;
}

/**
 * Interface representing the refined properties for making an HTTP request.
 *
 * @template TPathParams - Type of the path parameters.
 * @template TQueryParams - Type of the query parameters.
 * @template TRequestBody - Type of the request body.
 */
export interface RefinedRequestProps<
  TPathParams = PathParams,
  TQueryParams = QueryParams,
  TRequestBody = any
> {
  /** The full URL for the request. */
  url: string;

  /** The HTTP method for the request. */
  method: Method;

  /** The headers to include in the request. */
  headers: Headers;

  /** The timeout for the request in milliseconds. */
  timeout: number;

  /** The retry options for the request. */
  retryOptions: RetryOptions;

  /** The response type for the request. */
  responseType: ResponseType;

  /** The path parameters for the request (optional). */
  pathParams?: TPathParams;

  /** The query parameters for the request (optional). */
  queryParams?: TQueryParams;

  /** The request body for the request (optional). */
  requestBody?: TRequestBody;
}
