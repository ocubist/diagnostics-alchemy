import { Method } from "./Method";
import { PathParams } from "./PathParams";
import { QueryParams } from "./QueryParams";
import {
  FactoryFunctionProps,
  UseHttpRequestHandlerProps,
} from "./UseHttpRequestHandlerProps";

/**
 * Props for executing factory functions for HTTP requests.
 *
 * @template TPathParams - Type of the path parameters.
 * @template TQueryParams - Type of the query parameters.
 * @template TRequestBody - Type of the request body.
 * @template TResponseBody - Type of the response body.
 */
export interface ExecuteFactoryFunctionsRequestProps<
  TPathParams = PathParams,
  TQueryParams = QueryParams,
  TRequestBody = any,
  TResponseBody = any
> {
  mainProps: UseHttpRequestHandlerProps;
  factoryProps: FactoryFunctionProps<
    TPathParams,
    TQueryParams,
    TRequestBody,
    TResponseBody
  >;
  params: {
    pathParams: TPathParams;
    queryParams: TQueryParams;
    requestBody?: TRequestBody;
  };
  method: Method;
}
