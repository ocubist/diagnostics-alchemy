import { MysticError, assert, parse } from "@ocubist/error-alchemy";
import { z } from "zod";
import { PathParams } from "../../../types/PathParams";
import { PathParameterParsingError } from "../../errors/request";

/**
 * Parses and validates path parameters using a provided schema.
 *
 * @template TPathParams - The type of the path parameters.
 * @param {TPathParams} [pathParams] - The path parameters to be validated.
 * @param {z.ZodSchema} [pathParamsSchema] - The Zod schema to validate the path parameters.
 * @returns {TPathParams | undefined} - The validated path parameters or undefined if not provided.
 * @throws {PathParameterParsingError} - If the validation fails or if the schema is provided without path parameters.
 */
export const parsePathParams = <TPathParams = PathParams>(
  pathParams?: TPathParams,
  pathParamsSchema?: z.ZodSchema
): TPathParams | undefined => {
  if (pathParams === undefined && pathParamsSchema !== undefined) {
    throw new PathParameterParsingError({
      message: "If a schema is present, the pathParams must be present, too",
    });
  }

  let _pathParams = pathParams;

  if (pathParamsSchema) {
    try {
      _pathParams = parse(pathParams, pathParamsSchema);
    } catch (error) {
      assert(error, z.instanceof(MysticError));
      throw new PathParameterParsingError({
        message: "Custom path parameters validation failed",
        origin: error,
        payload: { ...error.payload, pathParams },
      });
    }
  }

  return _pathParams;
};
