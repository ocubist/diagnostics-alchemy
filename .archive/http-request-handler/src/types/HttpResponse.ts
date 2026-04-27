import { AxiosRequestConfig } from "axios";
import { Headers } from "./Headers";
import {
  MakeHttpRequestProps,
  RefinedRequestProps,
} from "./MakeHttpRequestProps";
import { PathParams } from "./PathParams";
import { QueryParams } from "./QueryParams";

/**
 * HTTP response structure.
 *
 * @template TPathParams - Type of the path parameters.
 * @template TQueryParams - Type of the query parameters.
 * @template TRequestBody - Type of the request body.
 * @template TResponseBody - Type of the response body.
 */
export interface HttpResponse<
  TPathParams = PathParams,
  TQueryParams = QueryParams,
  TRequestBody = any,
  TResponseBody = any
> {
  /**
   * Indicates whether the request was successful.
   */
  success: boolean;

  /**
   * The response body data.
   */
  data: TResponseBody;

  /**
   * The HTTP status code of the response.
   */
  status: number;

  /**
   * The headers included in the response.
   */
  headers: Headers;

  /**
   * The Axios configuration used for the request.
   */
  axiosConfig: AxiosRequestConfig;

  /**
   * The refined request properties, including resolved path and query parameters.
   */
  requestProps: RefinedRequestProps<TPathParams, TQueryParams, TRequestBody>;

  /**
   * The original request properties before any refinement.
   */
  originalRequestProps: MakeHttpRequestProps<
    TPathParams,
    TQueryParams,
    TRequestBody,
    TResponseBody
  >;

  /**
   * The status text corresponding to the HTTP status code.
   */
  statusText: string;

  /**
   * The URL of the request.
   */
  url: string;

  /**
   * The number of retry attempts made.
   * Optional.
   */
  attempts?: number;

  /**
   * The duration of the request in milliseconds.
   */
  duration: number;
}
