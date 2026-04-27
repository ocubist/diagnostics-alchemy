import { HttpResponse } from "./HttpResponse";
import { PathParams } from "./PathParams";
import { QueryParams } from "./QueryParams";
import {
  FactoryFunctionProps,
  FactoryFunctionPropsWithoutRequestBody,
} from "./UseHttpRequestHandlerProps";

/**
 * Type representing the parameters for requests with a request body.
 *
 * @template TPathParams - Type of the path parameters.
 * @template TQueryParams - Type of the query parameters.
 * @template TRequestBody - Type of the request body.
 */
type RequestParamsWithRequestBody<
  TPathParams = PathParams,
  TQueryParams = QueryParams,
  TRequestBody = any
> = {
  pathParams: TPathParams;
  queryParams: TQueryParams;
  requestBody: TRequestBody;
};

/**
 * Type representing the parameters for requests without a request body.
 *
 * @template TPathParams - Type of the path parameters.
 * @template TQueryParams - Type of the query parameters.
 */
type RequestParamsWithoutRequestBody<
  TPathParams = PathParams,
  TQueryParams = QueryParams
> = {
  pathParams: TPathParams;
  queryParams: TQueryParams;
};

/**
 * Type representing a function to make HTTP requests with a request body.
 *
 * @template TPathParams - Type of the path parameters.
 * @template TQueryParams - Type of the query parameters.
 * @template TRequestBody - Type of the request body.
 * @template TResponseBody - Type of the response body.
 */
type RequestFunctionWithRequestBody<
  TPathParams = PathParams,
  TQueryParams = QueryParams,
  TRequestBody = any,
  TResponseBody = any
> = (
  params: RequestParamsWithRequestBody<TPathParams, TQueryParams, TRequestBody>
) => Promise<
  HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>
>;

/**
 * Type representing a function to make HTTP requests without a request body.
 *
 * @template TPathParams - Type of the path parameters.
 * @template TQueryParams - Type of the query parameters.
 * @template TResponseBody - Type of the response body.
 */
type RequestFunctionWithoutRequestBody<
  TPathParams = PathParams,
  TQueryParams = QueryParams,
  TResponseBody = any
> = (
  params: RequestParamsWithoutRequestBody<TPathParams, TQueryParams>
) => Promise<HttpResponse<TPathParams, TQueryParams, never, TResponseBody>>;

/**
 * Interface representing the return type of the useHttpRequestHandler hook.
 */
export interface UseHttpRequestHandlerReturn {
  /**
   * Function to craft a GET request.
   *
   * @template TPathParams - Type of the path parameters.
   * @template TQueryParams - Type of the query parameters.
   * @template TResponseBody - Type of the response body.
   */
  craftGetRequest: <
    TPathParams = PathParams,
    TQueryParams = QueryParams,
    TResponseBody = any
  >(
    factoryProps: FactoryFunctionPropsWithoutRequestBody<
      TPathParams,
      TQueryParams,
      TResponseBody
    >
  ) => RequestFunctionWithoutRequestBody<
    TPathParams,
    TQueryParams,
    TResponseBody
  >;

  /**
   * Function to craft a POST request.
   *
   * @template TPathParams - Type of the path parameters.
   * @template TQueryParams - Type of the query parameters.
   * @template TRequestBody - Type of the request body.
   * @template TResponseBody - Type of the response body.
   */
  craftPostRequest: <
    TPathParams = PathParams,
    TQueryParams = QueryParams,
    TRequestBody = any,
    TResponseBody = any
  >(
    factoryProps: FactoryFunctionProps<
      TPathParams,
      TQueryParams,
      TRequestBody,
      TResponseBody
    >
  ) => RequestFunctionWithRequestBody<
    TPathParams,
    TQueryParams,
    TRequestBody,
    TResponseBody
  >;

  /**
   * Function to craft a PUT request.
   *
   * @template TPathParams - Type of the path parameters.
   * @template TQueryParams - Type of the query parameters.
   * @template TRequestBody - Type of the request body.
   * @template TResponseBody - Type of the response body.
   */
  craftPutRequest: <
    TPathParams = PathParams,
    TQueryParams = QueryParams,
    TRequestBody = any,
    TResponseBody = any
  >(
    factoryProps: FactoryFunctionProps<
      TPathParams,
      TQueryParams,
      TRequestBody,
      TResponseBody
    >
  ) => RequestFunctionWithRequestBody<
    TPathParams,
    TQueryParams,
    TRequestBody,
    TResponseBody
  >;

  /**
   * Function to craft a DELETE request.
   *
   * @template TPathParams - Type of the path parameters.
   * @template TQueryParams - Type of the query parameters.
   * @template TResponseBody - Type of the response body.
   */
  craftDeleteRequest: <
    TPathParams = PathParams,
    TQueryParams = QueryParams,
    TResponseBody = any
  >(
    factoryProps: FactoryFunctionPropsWithoutRequestBody<
      TPathParams,
      TQueryParams,
      TResponseBody
    >
  ) => RequestFunctionWithoutRequestBody<
    TPathParams,
    TQueryParams,
    TResponseBody
  >;

  /**
   * Function to craft a PATCH request.
   *
   * @template TPathParams - Type of the path parameters.
   * @template TQueryParams - Type of the query parameters.
   * @template TRequestBody - Type of the request body.
   * @template TResponseBody - Type of the response body.
   */
  craftPatchRequest: <
    TPathParams = PathParams,
    TQueryParams = QueryParams,
    TRequestBody = any,
    TResponseBody = any
  >(
    factoryProps: FactoryFunctionProps<
      TPathParams,
      TQueryParams,
      TRequestBody,
      TResponseBody
    >
  ) => RequestFunctionWithRequestBody<
    TPathParams,
    TQueryParams,
    TRequestBody,
    TResponseBody
  >;

  /**
   * Function to craft an OPTIONS request.
   *
   * @template TPathParams - Type of the path parameters.
   * @template TQueryParams - Type of the query parameters.
   * @template TResponseBody - Type of the response body.
   */
  craftOptionsRequest: <
    TPathParams = PathParams,
    TQueryParams = QueryParams,
    TResponseBody = any
  >(
    factoryProps: FactoryFunctionPropsWithoutRequestBody<
      TPathParams,
      TQueryParams,
      TResponseBody
    >
  ) => RequestFunctionWithoutRequestBody<
    TPathParams,
    TQueryParams,
    TResponseBody
  >;

  /**
   * Function to craft a HEAD request.
   */
  craftHeadRequest: () => () => Promise<HttpResponse<{}, {}, never, never>>;

  /**
   * Function to craft a PURGE request.
   *
   * @template TPathParams - Type of the path parameters.
   * @template TQueryParams - Type of the query parameters.
   * @template TRequestBody - Type of the request body.
   * @template TResponseBody - Type of the response body.
   */
  craftPurgeRequest: <
    TPathParams = PathParams,
    TQueryParams = QueryParams,
    TRequestBody = any,
    TResponseBody = any
  >(
    factoryProps: FactoryFunctionProps<
      TPathParams,
      TQueryParams,
      TRequestBody,
      TResponseBody
    >
  ) => RequestFunctionWithRequestBody<
    TPathParams,
    TQueryParams,
    TRequestBody,
    TResponseBody
  >;

  /**
   * Function to craft a LINK request.
   *
   * @template TPathParams - Type of the path parameters.
   * @template TQueryParams - Type of the query parameters.
   * @template TRequestBody - Type of the request body.
   * @template TResponseBody - Type of the response body.
   */
  craftLinkRequest: <
    TPathParams = PathParams,
    TQueryParams = QueryParams,
    TRequestBody = any,
    TResponseBody = any
  >(
    factoryProps: FactoryFunctionProps<
      TPathParams,
      TQueryParams,
      TRequestBody,
      TResponseBody
    >
  ) => RequestFunctionWithRequestBody<
    TPathParams,
    TQueryParams,
    TRequestBody,
    TResponseBody
  >;

  /**
   * Function to craft an UNLINK request.
   *
   * @template TPathParams - Type of the path parameters.
   * @template TQueryParams - Type of the query parameters.
   * @template TRequestBody - Type of the request body.
   * @template TResponseBody - Type of the response body.
   */
  craftUnlinkRequest: <
    TPathParams = PathParams,
    TQueryParams = QueryParams,
    TRequestBody = any,
    TResponseBody = any
  >(
    factoryProps: FactoryFunctionProps<
      TPathParams,
      TQueryParams,
      TRequestBody,
      TResponseBody
    >
  ) => RequestFunctionWithRequestBody<
    TPathParams,
    TQueryParams,
    TRequestBody,
    TResponseBody
  >;
}
