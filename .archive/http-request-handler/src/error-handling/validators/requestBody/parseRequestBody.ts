import { z } from "zod";
import { RequestBodyParsingError } from "../../errors/request";
import { parse, assert, MysticError } from "@ocubist/error-alchemy";

/**
 * Parses and validates the request body using a provided schema.
 *
 * @template TRequestBody - The type of the request body.
 * @param {TRequestBody} [requestBody] - The request body to be validated.
 * @param {z.ZodSchema<TRequestBody>} [requestBodySchema] - The Zod schema to validate the request body.
 * @returns {TRequestBody | undefined} - The validated request body or undefined if not provided.
 * @throws {RequestBodyParsingError} - If the validation fails or if the schema is provided without a request body.
 */
export const parseRequestBody = <TRequestBody = any>(
  requestBody?: TRequestBody,
  requestBodySchema?: z.ZodSchema<TRequestBody>
): TRequestBody | undefined => {
  if (requestBody === undefined && requestBodySchema !== undefined) {
    throw new RequestBodyParsingError({
      message: "If a schema is present, the requestBody must be present, too",
    });
  }

  let _requestBody = requestBody;

  if (requestBodySchema) {
    try {
      _requestBody = parse(requestBody, requestBodySchema);
    } catch (error) {
      assert(error, z.instanceof(MysticError));
      throw new RequestBodyParsingError({
        message: "Request body parsing failed",
        origin: error,
        payload: { ...error.payload },
      });
    }
  }

  return _requestBody;
};
