// import { z } from "zod";
// import {
//   executeFactoryFunctionsRequest,
//   executeFactoryFunctionsRequestWithoutRequestBody,
// } from "../helpers/executeFactoryFunctionsRequest";
// import { HttpResponse } from "../types/HttpResponse";
// import { PathParams } from "../types/PathParams";
// import { QueryParams } from "../types/QueryParams";
// import {
//   UseHttpRequestHandlerProps,
//   FactoryFunctionPropsWithoutRequestBody,
//   FactoryFunctionProps,
// } from "../types/UseHttpRequestHandlerProps";

// /**
//  * Custom hook to handle HTTP requests with various methods.
//  *
//  * @param {UseHttpRequestHandlerProps} props - The properties required to set up the HTTP request handler.
//  * @returns {Object} - The crafted HTTP request functions.
//  */
// export const useHttpRequestHandler = (props: UseHttpRequestHandlerProps) => {
//   const mainProps = props;

//   /**
//    * Craft a GET request function.
//    *
//    * @template TPathParams
//    * @template TQueryParams
//    * @template TResponseBody
//    * @param {FactoryFunctionPropsWithoutRequestBody<TPathParams, TQueryParams, TResponseBody>} factoryProps - The properties required to craft the GET request.
//    * @returns {Function} - The crafted GET request function.
//    */
//   const craftGetRequest = <
//     TPathParams = PathParams,
//     TQueryParams = QueryParams,
//     TResponseBody = any
//   >(
//     factoryProps: FactoryFunctionPropsWithoutRequestBody<
//       TPathParams,
//       TQueryParams,
//       TResponseBody
//     >
//   ): Function => {
//     /**
//      * Executes a GET request.
//      *
//      * @param {Object} params - The parameters for the GET request.
//      * @param {TPathParams} params.pathParams - The path parameters for the GET request.
//      * @param {TQueryParams} params.queryParams - The query parameters for the GET request.
//      * @returns {Promise<HttpResponse<TPathParams, TQueryParams, never, TResponseBody>>} - The HTTP response.
//      * @throws {PathParameterParsingError} - If the path parameters are invalid.
//      * @throws {QueryParsingError} - If the query parameters are invalid.
//      * @throws {HttpResponseError} - If the server responds with an error status code.
//      * @throws {NetworkError} - If there is a network connectivity issue.
//      * @throws {TimeoutError} - If the request times out.
//      * @throws {UnexpectedAxiosError} - If an unexpected Axios error occurs.
//      * @throws {UnexpectedError} - If an unexpected error occurs.
//      */
//     return async (params: {
//       pathParams: TPathParams;
//       queryParams: TQueryParams;
//     }): Promise<
//       HttpResponse<TPathParams, TQueryParams, never, TResponseBody>
//     > => {
//       return executeFactoryFunctionsRequestWithoutRequestBody({
//         mainProps,
//         factoryProps,
//         params,
//         method: "get",
//       });
//     };
//   };

//   /**
//    * Craft a POST request function.
//    *
//    * @template TPathParams
//    * @template TQueryParams
//    * @template TRequestBody
//    * @template TResponseBody
//    * @param {FactoryFunctionProps<TPathParams, TQueryParams, TRequestBody, TResponseBody>} factoryProps - The properties required to craft the POST request.
//    * @returns {Function} - The crafted POST request function.
//    */
//   const craftPostRequest = <
//     TPathParams = PathParams,
//     TQueryParams = QueryParams,
//     TRequestBody = any,
//     TResponseBody = any
//   >(
//     factoryProps: FactoryFunctionProps<
//       TPathParams,
//       TQueryParams,
//       TRequestBody,
//       TResponseBody
//     >
//   ): Function => {
//     /**
//      * Executes a POST request.
//      *
//      * @param {Object} params - The parameters for the POST request.
//      * @param {TPathParams} params.pathParams - The path parameters for the POST request.
//      * @param {TQueryParams} params.queryParams - The query parameters for the POST request.
//      * @param {TRequestBody} params.requestBody - The request body for the POST request.
//      * @returns {Promise<HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>>} - The HTTP response.
//      * @throws {PathParameterParsingError} - If the path parameters are invalid.
//      * @throws {QueryParsingError} - If the query parameters are invalid.
//      * @throws {RequestBodyParsingError} - If the request body is invalid.
//      * @throws {HttpResponseError} - If the server responds with an error status code.
//      * @throws {NetworkError} - If there is a network connectivity issue.
//      * @throws {TimeoutError} - If the request times out.
//      * @throws {UnexpectedAxiosError} - If an unexpected Axios error occurs.
//      * @throws {UnexpectedError} - If an unexpected error occurs.
//      */
//     return async (params: {
//       pathParams: TPathParams;
//       queryParams: TQueryParams;
//       requestBody: TRequestBody;
//     }): Promise<
//       HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>
//     > => {
//       return executeFactoryFunctionsRequest({
//         mainProps,
//         factoryProps,
//         params,
//         method: "post",
//       });
//     };
//   };

//   /**
//    * Craft a PUT request function.
//    *
//    * @template TPathParams
//    * @template TQueryParams
//    * @template TRequestBody
//    * @template TResponseBody
//    * @param {FactoryFunctionProps<TPathParams, TQueryParams, TRequestBody, TResponseBody>} factoryProps - The properties required to craft the PUT request.
//    * @returns {Function} - The crafted PUT request function.
//    */
//   const craftPutRequest = <
//     TPathParams = PathParams,
//     TQueryParams = QueryParams,
//     TRequestBody = any,
//     TResponseBody = any
//   >(
//     factoryProps: FactoryFunctionProps<
//       TPathParams,
//       TQueryParams,
//       TRequestBody,
//       TResponseBody
//     >
//   ): Function => {
//     /**
//      * Executes a PUT request.
//      *
//      * @param {Object} params - The parameters for the PUT request.
//      * @param {TPathParams} params.pathParams - The path parameters for the PUT request.
//      * @param {TQueryParams} params.queryParams - The query parameters for the PUT request.
//      * @param {TRequestBody} params.requestBody - The request body for the PUT request.
//      * @returns {Promise<HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>>} - The HTTP response.
//      * @throws {PathParameterParsingError} - If the path parameters are invalid.
//      * @throws {QueryParsingError} - If the query parameters are invalid.
//      * @throws {RequestBodyParsingError} - If the request body is invalid.
//      * @throws {HttpResponseError} - If the server responds with an error status code.
//      * @throws {NetworkError} - If there is a network connectivity issue.
//      * @throws {TimeoutError} - If the request times out.
//      * @throws {UnexpectedAxiosError} - If an unexpected Axios error occurs.
//      * @throws {UnexpectedError} - If an unexpected error occurs.
//      */
//     return async (params: {
//       pathParams: TPathParams;
//       queryParams: TQueryParams;
//       requestBody: TRequestBody;
//     }): Promise<
//       HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>
//     > => {
//       return executeFactoryFunctionsRequest({
//         mainProps,
//         factoryProps,
//         params,
//         method: "put",
//       });
//     };
//   };

//   /**
//    * Craft a DELETE request function.
//    *
//    * @template TPathParams
//    * @template TQueryParams
//    * @template TResponseBody
//    * @param {FactoryFunctionPropsWithoutRequestBody<TPathParams, TQueryParams, TResponseBody>} factoryProps - The properties required to craft the DELETE request.
//    * @returns {Function} - The crafted DELETE request function.
//    */
//   const craftDeleteRequest = <
//     TPathParams = PathParams,
//     TQueryParams = QueryParams,
//     TResponseBody = any
//   >(
//     factoryProps: FactoryFunctionPropsWithoutRequestBody<
//       TPathParams,
//       TQueryParams,
//       TResponseBody
//     >
//   ): Function => {
//     /**
//      * Executes a DELETE request.
//      *
//      * @param {Object} params - The parameters for the DELETE request.
//      * @param {TPathParams} params.pathParams - The path parameters for the DELETE request.
//      * @param {TQueryParams} params.queryParams - The query parameters for the DELETE request.
//      * @returns {Promise<HttpResponse<TPathParams, TQueryParams, never, TResponseBody>>} - The HTTP response.
//      * @throws {PathParameterParsingError} - If the path parameters are invalid.
//      * @throws {QueryParsingError} - If the query parameters are invalid.
//      * @throws {HttpResponseError} - If the server responds with an error status code.
//      * @throws {NetworkError} - If there is a network connectivity issue.
//      * @throws {TimeoutError} - If the request times out.
//      * @throws {UnexpectedAxiosError} - If an unexpected Axios error occurs.
//      * @throws {UnexpectedError} - If an unexpected error occurs.
//      */
//     return async (params: {
//       pathParams: TPathParams;
//       queryParams: TQueryParams;
//     }): Promise<
//       HttpResponse<TPathParams, TQueryParams, never, TResponseBody>
//     > => {
//       return executeFactoryFunctionsRequestWithoutRequestBody({
//         mainProps,
//         factoryProps,
//         params,
//         method: "delete",
//       });
//     };
//   };

//   /**
//    * Craft a PATCH request function.
//    *
//    * @template TPathParams
//    * @template TQueryParams
//    * @template TRequestBody
//    * @template TResponseBody
//    * @param {FactoryFunctionProps<TPathParams, TQueryParams, TRequestBody, TResponseBody>} factoryProps - The properties required to craft the PATCH request.
//    * @returns {Function} - The crafted PATCH request function.
//    */
//   const craftPatchRequest = <
//     TPathParams = PathParams,
//     TQueryParams = QueryParams,
//     TRequestBody = any,
//     TResponseBody = any
//   >(
//     factoryProps: FactoryFunctionProps<
//       TPathParams,
//       TQueryParams,
//       TRequestBody,
//       TResponseBody
//     >
//   ): Function => {
//     return async (params: {
//       pathParams: TPathParams;
//       queryParams: TQueryParams;
//       requestBody: TRequestBody;
//     }): Promise<
//       HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>
//     > => {
//       /**
//        * Executes a PATCH request.
//        *
//        * @param {Object} params - The parameters for the PATCH request.
//        * @param {TPathParams} params.pathParams - The path parameters for the PATCH request.
//        * @param {TQueryParams} params.queryParams - The query parameters for the PATCH request.
//        * @param {TRequestBody} params.requestBody - The request body for the PATCH request.
//        * @returns {Promise<HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>>} - The HTTP response.
//        * @throws {PathParameterParsingError} - If the path parameters are invalid.
//        * @throws {QueryParsingError} - If the query parameters are invalid.
//        * @throws {RequestBodyParsingError} - If the request body is invalid.
//        * @throws {HttpResponseError} - If the server responds with an error status code.
//        * @throws {NetworkError} - If there is a network connectivity issue.
//        * @throws {TimeoutError} - If the request times out.
//        * @throws {UnexpectedAxiosError} - If an unexpected Axios error occurs.
//        * @throws {UnexpectedError} - If an unexpected error occurs.
//        */
//       return executeFactoryFunctionsRequest({
//         mainProps,
//         factoryProps,
//         params,
//         method: "patch",
//       });
//     };
//   };

//   /**
//    * Craft an OPTIONS request function.
//    *
//    * @template TPathParams
//    * @template TQueryParams
//    * @template TResponseBody
//    * @param {FactoryFunctionPropsWithoutRequestBody<TPathParams, TQueryParams, TResponseBody>} factoryProps - The properties required to craft the OPTIONS request.
//    * @returns {Function} - The crafted OPTIONS request function.
//    */
//   const craftOptionsRequest = <
//     TPathParams = PathParams,
//     TQueryParams = QueryParams,
//     TResponseBody = any
//   >(
//     factoryProps: FactoryFunctionPropsWithoutRequestBody<
//       TPathParams,
//       TQueryParams,
//       TResponseBody
//     >
//   ): Function => {
//     /**
//      * Executes a OPTIONS request.
//      *
//      * @param {Object} params - The parameters for the OPTIONS request.
//      * @param {TPathParams} params.pathParams - The path parameters for the OPTIONS request.
//      * @param {TQueryParams} params.queryParams - The query parameters for the OPTIONS request.
//      * @returns {Promise<HttpResponse<TPathParams, TQueryParams, never, TResponseBody>>} - The HTTP response.
//      * @throws {PathParameterParsingError} - If the path parameters are invalid.
//      * @throws {QueryParsingError} - If the query parameters are invalid.
//      * @throws {HttpResponseError} - If the server responds with an error status code.
//      * @throws {NetworkError} - If there is a network connectivity issue.
//      * @throws {TimeoutError} - If the request times out.
//      * @throws {UnexpectedAxiosError} - If an unexpected Axios error occurs.
//      * @throws {UnexpectedError} - If an unexpected error occurs.
//      */
//     return async (params: {
//       pathParams: TPathParams;
//       queryParams: TQueryParams;
//     }): Promise<
//       HttpResponse<TPathParams, TQueryParams, never, TResponseBody>
//     > => {
//       return executeFactoryFunctionsRequestWithoutRequestBody({
//         mainProps,
//         factoryProps,
//         params,
//         method: "options",
//       });
//     };
//   };

//   /**
//    * Craft a HEAD request function.
//    *
//    * @returns {Function} - The crafted HEAD request function.
//    */
//   const craftHeadRequest = (): Function => {
//     /**
//      * Executes a HEAD request.
//      *
//      * @returns {Promise<HttpResponse<TPathParams, TQueryParams, never, TResponseBody>>} - The HTTP response.
//      * @throws {PathParameterParsingError} - If the path parameters are invalid.
//      * @throws {QueryParsingError} - If the query parameters are invalid.
//      * @throws {HttpResponseError} - If the server responds with an error status code.
//      * @throws {NetworkError} - If there is a network connectivity issue.
//      * @throws {TimeoutError} - If the request times out.
//      * @throws {UnexpectedAxiosError} - If an unexpected Axios error occurs.
//      * @throws {UnexpectedError} - If an unexpected error occurs.
//      */
//     return async (): Promise<HttpResponse> => {
//       return executeFactoryFunctionsRequestWithoutRequestBody({
//         mainProps,
//         method: "head",
//         factoryProps: {
//           pathParamsSchema: z.object({}),
//           queryParamsSchema: z.object({}),
//         },
//         params: { pathParams: {}, queryParams: {} },
//       });
//     };
//   };

//   /**
//    * Craft a PURGE request function.
//    *
//    * @template TPathParams
//    * @template TQueryParams
//    * @template TRequestBody
//    * @template TResponseBody
//    * @param {FactoryFunctionProps<TPathParams, TQueryParams, TRequestBody, TResponseBody>} factoryProps - The properties required to craft the PURGE request.
//    * @returns {Function} - The crafted PURGE request function.
//    */
//   const craftPurgeRequest = <
//     TPathParams = PathParams,
//     TQueryParams = QueryParams,
//     TRequestBody = any,
//     TResponseBody = any
//   >(
//     factoryProps: FactoryFunctionProps<
//       TPathParams,
//       TQueryParams,
//       TRequestBody,
//       TResponseBody
//     >
//   ): Function => {
//     /**
//      * Executes a PURGE request.
//      *
//      * @param {Object} params - The parameters for the PURGE request.
//      * @param {TPathParams} params.pathParams - The path parameters for the PURGE request.
//      * @param {TQueryParams} params.queryParams - The query parameters for the PURGE request.
//      * @param {TRequestBody} params.requestBody - The request body for the PURGE request.
//      * @returns {Promise<HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>>} - The HTTP response.
//      * @throws {PathParameterParsingError} - If the path parameters are invalid.
//      * @throws {QueryParsingError} - If the query parameters are invalid.
//      * @throws {RequestBodyParsingError} - If the request body is invalid.
//      * @throws {HttpResponseError} - If the server responds with an error status code.
//      * @throws {NetworkError} - If there is a network connectivity issue.
//      * @throws {TimeoutError} - If the request times out.
//      * @throws {UnexpectedAxiosError} - If an unexpected Axios error occurs.
//      * @throws {UnexpectedError} - If an unexpected error occurs.
//      */
//     return async (params: {
//       pathParams: TPathParams;
//       queryParams: TQueryParams;
//       requestBody: TRequestBody;
//     }): Promise<
//       HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>
//     > => {
//       return executeFactoryFunctionsRequest({
//         mainProps,
//         factoryProps,
//         params,
//         method: "purge",
//       });
//     };
//   };

//   /**
//    * Craft a LINK request function.
//    *
//    * @template TPathParams
//    * @template TQueryParams
//    * @template TRequestBody
//    * @template TResponseBody
//    * @param {FactoryFunctionProps<TPathParams, TQueryParams, TRequestBody, TResponseBody>} factoryProps - The properties required to craft the LINK request.
//    * @returns {Function} - The crafted LINK request function.
//    */
//   const craftLinkRequest = <
//     TPathParams = PathParams,
//     TQueryParams = QueryParams,
//     TRequestBody = any,
//     TResponseBody = any
//   >(
//     factoryProps: FactoryFunctionProps<
//       TPathParams,
//       TQueryParams,
//       TRequestBody,
//       TResponseBody
//     >
//   ): Function => {
//     /**
//      * Executes a LINK request.
//      *
//      * @param {Object} params - The parameters for the LINK request.
//      * @param {TPathParams} params.pathParams - The path parameters for the LINK request.
//      * @param {TQueryParams} params.queryParams - The query parameters for the LINK request.
//      * @param {TRequestBody} params.requestBody - The request body for the LINK request.
//      * @returns {Promise<HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>>} - The HTTP response.
//      * @throws {PathParameterParsingError} - If the path parameters are invalid.
//      * @throws {QueryParsingError} - If the query parameters are invalid.
//      * @throws {RequestBodyParsingError} - If the request body is invalid.
//      * @throws {HttpResponseError} - If the server responds with an error status code.
//      * @throws {NetworkError} - If there is a network connectivity issue.
//      * @throws {TimeoutError} - If the request times out.
//      * @throws {UnexpectedAxiosError} - If an unexpected Axios error occurs.
//      * @throws {UnexpectedError} - If an unexpected error occurs.
//      */
//     return async (params: {
//       pathParams: TPathParams;
//       queryParams: TQueryParams;
//       requestBody: TRequestBody;
//     }): Promise<
//       HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>
//     > => {
//       return executeFactoryFunctionsRequest({
//         mainProps,
//         factoryProps,
//         params,
//         method: "link",
//       });
//     };
//   };

//   /**
//    * Craft an UNLINK request function.
//    *
//    * @template TPathParams
//    * @template TQueryParams
//    * @template TRequestBody
//    * @template TResponseBody
//    * @param {FactoryFunctionProps<TPathParams, TQueryParams, TRequestBody, TResponseBody>} factoryProps - The properties required to craft the UNLINK request.
//    * @returns {Function} - The crafted UNLINK request function.
//    */
//   const craftUnlinkRequest = <
//     TPathParams = PathParams,
//     TQueryParams = QueryParams,
//     TRequestBody = any,
//     TResponseBody = any
//   >(
//     factoryProps: FactoryFunctionProps<
//       TPathParams,
//       TQueryParams,
//       TRequestBody,
//       TResponseBody
//     >
//   ): Function => {
//     /**
//      * Executes a UNLINK request.
//      *
//      * @param {Object} params - The parameters for the UNLINK request.
//      * @param {TPathParams} params.pathParams - The path parameters for the UNLINK request.
//      * @param {TQueryParams} params.queryParams - The query parameters for the UNLINK request.
//      * @param {TRequestBody} params.requestBody - The request body for the UNLINK request.
//      * @returns {Promise<HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>>} - The HTTP response.
//      * @throws {PathParameterParsingError} - If the path parameters are invalid.
//      * @throws {QueryParsingError} - If the query parameters are invalid.
//      * @throws {RequestBodyParsingError} - If the request body is invalid.
//      * @throws {HttpResponseError} - If the server responds with an error status code.
//      * @throws {NetworkError} - If there is a network connectivity issue.
//      * @throws {TimeoutError} - If the request times out.
//      * @throws {UnexpectedAxiosError} - If an unexpected Axios error occurs.
//      * @throws {UnexpectedError} - If an unexpected error occurs.
//      */
//     return async (params: {
//       pathParams: TPathParams;
//       queryParams: TQueryParams;
//       requestBody: TRequestBody;
//     }): Promise<
//       HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>
//     > => {
//       return executeFactoryFunctionsRequest({
//         mainProps,
//         factoryProps,
//         params,
//         method: "unlink",
//       });
//     };
//   };

//   return {
//     craftGetRequest,
//     craftPostRequest,
//     craftPutRequest,
//     craftDeleteRequest,
//     craftPatchRequest,
//     craftOptionsRequest,
//     craftHeadRequest,
//     craftPurgeRequest,
//     craftLinkRequest,
//     craftUnlinkRequest,
//   };
// };

import { z } from "zod";
import {
  executeFactoryFunctionsRequest,
  executeFactoryFunctionsRequestWithoutRequestBody,
} from "../helpers/executeFactoryFunctionsRequest";
import { HttpResponse } from "../types/HttpResponse";
import { PathParams } from "../types/PathParams";
import { QueryParams } from "../types/QueryParams";
import {
  UseHttpRequestHandlerProps,
  FactoryFunctionPropsWithoutRequestBody,
  FactoryFunctionProps,
} from "../types/UseHttpRequestHandlerProps";
import { UseHttpRequestHandlerReturn } from "../types/UseHttpRequestHandlerReturn";

/**
 * Custom hook to handle HTTP requests with various methods.
 *
 * @param {UseHttpRequestHandlerProps} props - The properties required to set up the HTTP request handler.
 * @returns {Object} - The crafted HTTP request functions.
 */
export const useHttpRequestHandler = (
  props: UseHttpRequestHandlerProps
): UseHttpRequestHandlerReturn => {
  const mainProps = props;

  /**
   * Craft a GET request function.
   *
   * @template TPathParams
   * @template TQueryParams
   * @template TResponseBody
   * @param {FactoryFunctionPropsWithoutRequestBody<TPathParams, TQueryParams, TResponseBody>} factoryProps - The properties required to craft the GET request.
   * @returns {Function} - The crafted GET request function.
   */
  const craftGetRequest = <
    TPathParams = PathParams,
    TQueryParams = QueryParams,
    TResponseBody = any
  >(
    factoryProps: FactoryFunctionPropsWithoutRequestBody<
      TPathParams,
      TQueryParams,
      TResponseBody
    >
  ) => {
    /**
     * Executes a GET request.
     *
     * @param {Object} params - The parameters for the GET request.
     * @param {TPathParams} params.pathParams - The path parameters for the GET request.
     * @param {TQueryParams} params.queryParams - The query parameters for the GET request.
     * @returns {Promise<HttpResponse<TPathParams, TQueryParams, never, TResponseBody>>} - The HTTP response.
     * @throws {PathParameterParsingError} - If the path parameters are invalid.
     * @throws {QueryParsingError} - If the query parameters are invalid.
     * @throws {HttpResponseError} - If the server responds with an error status code.
     * @throws {NetworkError} - If there is a network connectivity issue.
     * @throws {TimeoutError} - If the request times out.
     * @throws {UnexpectedAxiosError} - If an unexpected Axios error occurs.
     * @throws {UnexpectedError} - If an unexpected error occurs.
     */
    return async (params: {
      pathParams: TPathParams;
      queryParams: TQueryParams;
    }): Promise<
      HttpResponse<TPathParams, TQueryParams, never, TResponseBody>
    > => {
      return executeFactoryFunctionsRequestWithoutRequestBody({
        mainProps,
        factoryProps,
        params,
        method: "get",
      });
    };
  };

  /**
   * Craft a POST request function.
   *
   * @template TPathParams
   * @template TQueryParams
   * @template TRequestBody
   * @template TResponseBody
   * @param {FactoryFunctionProps<TPathParams, TQueryParams, TRequestBody, TResponseBody>} factoryProps - The properties required to craft the POST request.
   * @returns {Function} - The crafted POST request function.
   */
  const craftPostRequest = <
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
  ) => {
    /**
     * Executes a POST request.
     *
     * @param {Object} params - The parameters for the POST request.
     * @param {TPathParams} params.pathParams - The path parameters for the POST request.
     * @param {TQueryParams} params.queryParams - The query parameters for the POST request.
     * @param {TRequestBody} params.requestBody - The request body for the POST request.
     * @returns {Promise<HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>>} - The HTTP response.
     * @throws {PathParameterParsingError} - If the path parameters are invalid.
     * @throws {QueryParsingError} - If the query parameters are invalid.
     * @throws {RequestBodyParsingError} - If the request body is invalid.
     * @throws {HttpResponseError} - If the server responds with an error status code.
     * @throws {NetworkError} - If there is a network connectivity issue.
     * @throws {TimeoutError} - If the request times out.
     * @throws {UnexpectedAxiosError} - If an unexpected Axios error occurs.
     * @throws {UnexpectedError} - If an unexpected error occurs.
     */
    return async (params: {
      pathParams: TPathParams;
      queryParams: TQueryParams;
      requestBody: TRequestBody;
    }): Promise<
      HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>
    > => {
      return executeFactoryFunctionsRequest({
        mainProps,
        factoryProps,
        params,
        method: "post",
      });
    };
  };

  /**
   * Craft a PUT request function.
   *
   * @template TPathParams
   * @template TQueryParams
   * @template TRequestBody
   * @template TResponseBody
   * @param {FactoryFunctionProps<TPathParams, TQueryParams, TRequestBody, TResponseBody>} factoryProps - The properties required to craft the PUT request.
   * @returns {Function} - The crafted PUT request function.
   */
  const craftPutRequest = <
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
  ) => {
    /**
     * Executes a PUT request.
     *
     * @param {Object} params - The parameters for the PUT request.
     * @param {TPathParams} params.pathParams - The path parameters for the PUT request.
     * @param {TQueryParams} params.queryParams - The query parameters for the PUT request.
     * @param {TRequestBody} params.requestBody - The request body for the PUT request.
     * @returns {Promise<HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>>} - The HTTP response.
     * @throws {PathParameterParsingError} - If the path parameters are invalid.
     * @throws {QueryParsingError} - If the query parameters are invalid.
     * @throws {RequestBodyParsingError} - If the request body is invalid.
     * @throws {HttpResponseError} - If the server responds with an error status code.
     * @throws {NetworkError} - If there is a network connectivity issue.
     * @throws {TimeoutError} - If the request times out.
     * @throws {UnexpectedAxiosError} - If an unexpected Axios error occurs.
     * @throws {UnexpectedError} - If an unexpected error occurs.
     */
    return async (params: {
      pathParams: TPathParams;
      queryParams: TQueryParams;
      requestBody: TRequestBody;
    }): Promise<
      HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>
    > => {
      return executeFactoryFunctionsRequest({
        mainProps,
        factoryProps,
        params,
        method: "put",
      });
    };
  };

  /**
   * Craft a DELETE request function.
   *
   * @template TPathParams
   * @template TQueryParams
   * @template TResponseBody
   * @param {FactoryFunctionPropsWithoutRequestBody<TPathParams, TQueryParams, TResponseBody>} factoryProps - The properties required to craft the DELETE request.
   * @returns {Function} - The crafted DELETE request function.
   */
  const craftDeleteRequest = <
    TPathParams = PathParams,
    TQueryParams = QueryParams,
    TResponseBody = any
  >(
    factoryProps: FactoryFunctionPropsWithoutRequestBody<
      TPathParams,
      TQueryParams,
      TResponseBody
    >
  ) => {
    /**
     * Executes a DELETE request.
     *
     * @param {Object} params - The parameters for the DELETE request.
     * @param {TPathParams} params.pathParams - The path parameters for the DELETE request.
     * @param {TQueryParams} params.queryParams - The query parameters for the DELETE request.
     * @returns {Promise<HttpResponse<TPathParams, TQueryParams, never, TResponseBody>>} - The HTTP response.
     * @throws {PathParameterParsingError} - If the path parameters are invalid.
     * @throws {QueryParsingError} - If the query parameters are invalid.
     * @throws {HttpResponseError} - If the server responds with an error status code.
     * @throws {NetworkError} - If there is a network connectivity issue.
     * @throws {TimeoutError} - If the request times out.
     * @throws {UnexpectedAxiosError} - If an unexpected Axios error occurs.
     * @throws {UnexpectedError} - If an unexpected error occurs.
     */
    return async (params: {
      pathParams: TPathParams;
      queryParams: TQueryParams;
    }): Promise<
      HttpResponse<TPathParams, TQueryParams, never, TResponseBody>
    > => {
      return executeFactoryFunctionsRequestWithoutRequestBody({
        mainProps,
        factoryProps,
        params,
        method: "delete",
      });
    };
  };

  /**
   * Craft a PATCH request function.
   *
   * @template TPathParams
   * @template TQueryParams
   * @template TRequestBody
   * @template TResponseBody
   * @param {FactoryFunctionProps<TPathParams, TQueryParams, TRequestBody, TResponseBody>} factoryProps - The properties required to craft the PATCH request.
   * @returns {Function} - The crafted PATCH request function.
   */
  const craftPatchRequest = <
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
  ) => {
    return async (params: {
      pathParams: TPathParams;
      queryParams: TQueryParams;
      requestBody: TRequestBody;
    }): Promise<
      HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>
    > => {
      /**
       * Executes a PATCH request.
       *
       * @param {Object} params - The parameters for the PATCH request.
       * @param {TPathParams} params.pathParams - The path parameters for the PATCH request.
       * @param {TQueryParams} params.queryParams - The query parameters for the PATCH request.
       * @param {TRequestBody} params.requestBody - The request body for the PATCH request.
       * @returns {Promise<HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>>} - The HTTP response.
       * @throws {PathParameterParsingError} - If the path parameters are invalid.
       * @throws {QueryParsingError} - If the query parameters are invalid.
       * @throws {RequestBodyParsingError} - If the request body is invalid.
       * @throws {HttpResponseError} - If the server responds with an error status code.
       * @throws {NetworkError} - If there is a network connectivity issue.
       * @throws {TimeoutError} - If the request times out.
       * @throws {UnexpectedAxiosError} - If an unexpected Axios error occurs.
       * @throws {UnexpectedError} - If an unexpected error occurs.
       */
      return executeFactoryFunctionsRequest({
        mainProps,
        factoryProps,
        params,
        method: "patch",
      });
    };
  };

  /**
   * Craft an OPTIONS request function.
   *
   * @template TPathParams
   * @template TQueryParams
   * @template TResponseBody
   * @param {FactoryFunctionPropsWithoutRequestBody<TPathParams, TQueryParams, TResponseBody>} factoryProps - The properties required to craft the OPTIONS request.
   * @returns {Function} - The crafted OPTIONS request function.
   */
  const craftOptionsRequest = <
    TPathParams = PathParams,
    TQueryParams = QueryParams,
    TResponseBody = any
  >(
    factoryProps: FactoryFunctionPropsWithoutRequestBody<
      TPathParams,
      TQueryParams,
      TResponseBody
    >
  ) => {
    /**
     * Executes an OPTIONS request.
     *
     * @param {Object} params - The parameters for the OPTIONS request.
     * @param {TPathParams} params.pathParams - The path parameters for the OPTIONS request.
     * @param {TQueryParams} params.queryParams - The query parameters for the OPTIONS request.
     * @returns {Promise<HttpResponse<TPathParams, TQueryParams, never, TResponseBody>>} - The HTTP response.
     * @throws {PathParameterParsingError} - If the path parameters are invalid.
     * @throws {QueryParsingError} - If the query parameters are invalid.
     * @throws {HttpResponseError} - If the server responds with an error status code.
     * @throws {NetworkError} - If there is a network connectivity issue.
     * @throws {TimeoutError} - If the request times out.
     * @throws {UnexpectedAxiosError} - If an unexpected Axios error occurs.
     * @throws {UnexpectedError} - If an unexpected error occurs.
     */
    return async (params: {
      pathParams: TPathParams;
      queryParams: TQueryParams;
    }): Promise<
      HttpResponse<TPathParams, TQueryParams, never, TResponseBody>
    > => {
      return executeFactoryFunctionsRequestWithoutRequestBody({
        mainProps,
        factoryProps,
        params,
        method: "options",
      });
    };
  };

  /**
   * Craft a HEAD request function.
   *
   * @returns {Function} - The crafted HEAD request function.
   */
  const craftHeadRequest = (): (() => Promise<
    HttpResponse<{}, {}, never, never>
  >) => {
    /**
     * Executes a HEAD request.
     *
     * @returns {Promise<HttpResponse<{}, {}, never, never>>} - The HTTP response.
     * @throws {PathParameterParsingError} - If the path parameters are invalid.
     * @throws {QueryParsingError} - If the query parameters are invalid.
     * @throws {HttpResponseError} - If the server responds with an error status code.
     * @throws {NetworkError} - If there is a network connectivity issue.
     * @throws {TimeoutError} - If the request times out.
     * @throws {UnexpectedAxiosError} - If an unexpected Axios error occurs.
     * @throws {UnexpectedError} - If an unexpected error occurs.
     */
    return async (): Promise<HttpResponse<{}, {}, never, never>> => {
      return executeFactoryFunctionsRequestWithoutRequestBody({
        mainProps,
        method: "head",
        factoryProps: {
          pathParamsSchema: z.object({}),
          queryParamsSchema: z.object({}),
        },
        params: { pathParams: {}, queryParams: {} },
      });
    };
  };

  /**
   * Craft a PURGE request function.
   *
   * @template TPathParams
   * @template TQueryParams
   * @template TRequestBody
   * @template TResponseBody
   * @param {FactoryFunctionProps<TPathParams, TQueryParams, TRequestBody, TResponseBody>} factoryProps - The properties required to craft the PURGE request.
   * @returns {Function} - The crafted PURGE request function.
   */
  const craftPurgeRequest = <
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
  ) => {
    /**
     * Executes a PURGE request.
     *
     * @param {Object} params - The parameters for the PURGE request.
     * @param {TPathParams} params.pathParams - The path parameters for the PURGE request.
     * @param {TQueryParams} params.queryParams - The query parameters for the PURGE request.
     * @param {TRequestBody} params.requestBody - The request body for the PURGE request.
     * @returns {Promise<HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>>} - The HTTP response.
     * @throws {PathParameterParsingError} - If the path parameters are invalid.
     * @throws {QueryParsingError} - If the query parameters are invalid.
     * @throws {RequestBodyParsingError} - If the request body is invalid.
     * @throws {HttpResponseError} - If the server responds with an error status code.
     * @throws {NetworkError} - If there is a network connectivity issue.
     * @throws {TimeoutError} - If the request times out.
     * @throws {UnexpectedAxiosError} - If an unexpected Axios error occurs.
     * @throws {UnexpectedError} - If an unexpected error occurs.
     */
    return async (params: {
      pathParams: TPathParams;
      queryParams: TQueryParams;
      requestBody: TRequestBody;
    }): Promise<
      HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>
    > => {
      return executeFactoryFunctionsRequest({
        mainProps,
        factoryProps,
        params,
        method: "purge",
      });
    };
  };

  /**
   * Craft a LINK request function.
   *
   * @template TPathParams
   * @template TQueryParams
   * @template TRequestBody
   * @template TResponseBody
   * @param {FactoryFunctionProps<TPathParams, TQueryParams, TRequestBody, TResponseBody>} factoryProps - The properties required to craft the LINK request.
   * @returns {Function} - The crafted LINK request function.
   */
  const craftLinkRequest = <
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
  ) => {
    /**
     * Executes a LINK request.
     *
     * @param {Object} params - The parameters for the LINK request.
     * @param {TPathParams} params.pathParams - The path parameters for the LINK request.
     * @param {TQueryParams} params.queryParams - The query parameters for the LINK request.
     * @param {TRequestBody} params.requestBody - The request body for the LINK request.
     * @returns {Promise<HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>>} - The HTTP response.
     * @throws {PathParameterParsingError} - If the path parameters are invalid.
     * @throws {QueryParsingError} - If the query parameters are invalid.
     * @throws {RequestBodyParsingError} - If the request body is invalid.
     * @throws {HttpResponseError} - If the server responds with an error status code.
     * @throws {NetworkError} - If there is a network connectivity issue.
     * @throws {TimeoutError} - If the request times out.
     * @throws {UnexpectedAxiosError} - If an unexpected Axios error occurs.
     * @throws {UnexpectedError} - If an unexpected error occurs.
     */
    return async (params: {
      pathParams: TPathParams;
      queryParams: TQueryParams;
      requestBody: TRequestBody;
    }): Promise<
      HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>
    > => {
      return executeFactoryFunctionsRequest({
        mainProps,
        factoryProps,
        params,
        method: "link",
      });
    };
  };

  /**
   * Craft an UNLINK request function.
   *
   * @template TPathParams
   * @template TQueryParams
   * @template TRequestBody
   * @template TResponseBody
   * @param {FactoryFunctionProps<TPathParams, TQueryParams, TRequestBody, TResponseBody>} factoryProps - The properties required to craft the UNLINK request.
   * @returns {Function} - The crafted UNLINK request function.
   */
  const craftUnlinkRequest = <
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
  ) => {
    /**
     * Executes an UNLINK request.
     *
     * @param {Object} params - The parameters for the UNLINK request.
     * @param {TPathParams} params.pathParams - The path parameters for the UNLINK request.
     * @param {TQueryParams} params.queryParams - The query parameters for the UNLINK request.
     * @param {TRequestBody} params.requestBody - The request body for the UNLINK request.
     * @returns {Promise<HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>>} - The HTTP response.
     * @throws {PathParameterParsingError} - If the path parameters are invalid.
     * @throws {QueryParsingError} - If the query parameters are invalid.
     * @throws {RequestBodyParsingError} - If the request body is invalid.
     * @throws {HttpResponseError} - If the server responds with an error status code.
     * @throws {NetworkError} - If there is a network connectivity issue.
     * @throws {TimeoutError} - If the request times out.
     * @throws {UnexpectedAxiosError} - If an unexpected Axios error occurs.
     * @throws {UnexpectedError} - If an unexpected error occurs.
     */
    return async (params: {
      pathParams: TPathParams;
      queryParams: TQueryParams;
      requestBody: TRequestBody;
    }): Promise<
      HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>
    > => {
      return executeFactoryFunctionsRequest({
        mainProps,
        factoryProps,
        params,
        method: "unlink",
      });
    };
  };

  const returnType: UseHttpRequestHandlerReturn = {
    craftGetRequest,
    craftPostRequest,
    craftPutRequest,
    craftDeleteRequest,
    craftPatchRequest,
    craftOptionsRequest,
    craftHeadRequest,
    craftPurgeRequest,
    craftLinkRequest,
    craftUnlinkRequest,
  };

  return returnType;
};
