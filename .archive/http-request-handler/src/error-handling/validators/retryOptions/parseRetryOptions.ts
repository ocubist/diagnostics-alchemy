import { MysticError, assert, parse } from "@ocubist/error-alchemy";
import {
  OptionalRetryOptions,
  RetryOptions,
  defaultRetryOptions,
} from "../../../types/RetryOptions";
import { z } from "zod";
import { RetryOptionsParsingError } from "../../errors/request";

/**
 * Parses and validates the retry options, merging them with default values.
 *
 * @param {OptionalRetryOptions} [retryOptions] - The retry options to be validated.
 * @returns {RetryOptions} - The validated and merged retry options.
 * @throws {RetryOptionsParsingError} - If the validation fails.
 */
export const parseRetryOptions = (
  retryOptions?: OptionalRetryOptions
): RetryOptions => {
  let _retryOptions = retryOptions;

  if (retryOptions !== undefined) {
    try {
      _retryOptions = parse(retryOptions, OptionalRetryOptions);
    } catch (error) {
      assert(error, z.instanceof(MysticError));
      throw new RetryOptionsParsingError({
        message: "Parsing of the RetryOptions failed.",
      });
    }
  }

  const mergedWithDefault = {
    ...defaultRetryOptions,
    ...(_retryOptions ?? {}),
  };

  return mergedWithDefault;
};
