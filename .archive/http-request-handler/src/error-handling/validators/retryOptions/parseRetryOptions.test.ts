import { RetryOptions, defaultRetryOptions } from "../../../types/RetryOptions";
import { RetryOptionsParsingError } from "../../errors/request";
import { parseRetryOptions } from "./parseRetryOptions";

describe("Test function parseRetryOptions", () => {
  const retryOptions: RetryOptions = {
    retries: 4,
    initialDelay: 3000,
    backoffMultiplier: 2,
  };
  const invalidRetries: RetryOptions = { ...retryOptions, retries: 2000 };
  const invalidInitialDelay: RetryOptions = {
    ...retryOptions,
    initialDelay: 200000,
  };
  const invalidBackoffMultiplayer: RetryOptions = {
    ...retryOptions,
    backoffMultiplier: 200,
  };

  test("valid retryOptions", () => {
    const res = parseRetryOptions(retryOptions);
    expect(res.retries).toBe(4);
  });

  test("undefined retryOptions", () => {
    const res = parseRetryOptions(undefined);
    expect(res.retries).toBe(defaultRetryOptions.retries);
  });

  test("provoke errors", () => {
    try {
      parseRetryOptions(invalidRetries);
    } catch (error) {
      expect(error).toBeInstanceOf(RetryOptionsParsingError);
    }

    try {
      parseRetryOptions(invalidInitialDelay);
    } catch (error) {
      expect(error).toBeInstanceOf(RetryOptionsParsingError);
    }

    try {
      parseRetryOptions(invalidBackoffMultiplayer);
    } catch (error) {
      expect(error).toBeInstanceOf(RetryOptionsParsingError);
    }
  });
});
