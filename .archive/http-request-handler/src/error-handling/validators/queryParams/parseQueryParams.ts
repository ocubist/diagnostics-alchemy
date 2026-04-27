import { z } from "zod";
import { QueryParams } from "../../../types/QueryParams";
import { MysticError, assert, parse } from "@ocubist/error-alchemy";
import { QueryParsingError } from "../../errors/request";

/**
 * Parses and validates query parameters using a provided schema.
 *
 * @template TQueryParams - The type of the query parameters.
 * @param {TQueryParams} [queryParams] - The query parameters to be validated.
 * @param {z.ZodSchema} [queryParamsSchema] - The Zod schema to validate the query parameters.
 * @returns {TQueryParams | undefined} - The validated query parameters or undefined if not provided.
 * @throws {QueryParsingError} - If the validation fails or if the schema is provided without query parameters.
 */
export const parseQueryParams = <TQueryParams = QueryParams>(
  queryParams?: TQueryParams,
  queryParamsSchema?: z.ZodSchema
): TQueryParams | undefined => {
  if (queryParams === undefined && queryParamsSchema !== undefined) {
    throw new QueryParsingError({
      message: "If a schema is present, the queryParams must be present, too",
    });
  }

  let _queryParams = queryParams;

  if (queryParamsSchema) {
    try {
      _queryParams = parse(queryParams, queryParamsSchema);
    } catch (error) {
      assert(error, z.instanceof(MysticError));
      throw new QueryParsingError({
        message: "Query parameters parsing failed",
        origin: error,
        payload: { ...error.payload },
      });
    }
  }

  return _queryParams;
};
