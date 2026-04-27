import { z } from "zod";
import { MysticError, assert, parse } from "@ocubist/error-alchemy";
import { ResponseParsingError } from "../../errors/response";

/**
 * Parses and validates the response body using a provided schema.
 *
 * @template TResponseBody - The type of the response body.
 * @param {TResponseBody} responseBody - The response body to be validated.
 * @param {z.ZodSchema<TResponseBody>} [responseBodySchema] - The Zod schema to validate the response body.
 * @returns {TResponseBody} - The validated response body.
 * @throws {ResponseParsingError} - If the validation fails.
 */
export const parseResponseBody = <TResponseBody = any>(
  responseBody: TResponseBody,
  responseBodySchema?: z.ZodSchema<TResponseBody>
): TResponseBody => {
  let _responseBody = responseBody;

  if (responseBodySchema !== undefined) {
    try {
      _responseBody = parse(responseBody, responseBodySchema);
    } catch (error) {
      assert(error, z.instanceof(MysticError));
      throw new ResponseParsingError({
        message: "Response body parsing failed",
        origin: error,
        payload: { ...error.payload, responseBody },
      });
    }
  }

  return _responseBody;
};
