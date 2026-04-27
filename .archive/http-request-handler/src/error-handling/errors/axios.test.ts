import { baseURL } from "../../tests/globalSetup";
import { makeHttpRequest } from "../../requests/makeHttpRequest";
import { z } from "zod";
import { HttpResponseError, NetworkError, TimeoutError } from "./axios";

describe("Provoking invalid response to throw the correct axios-errors", () => {
  test("HttpResponseError", async () => {
    try {
      await makeHttpRequest({
        urlTemplate: baseURL,
        method: "post",
        queryParams: { val: { err500: true } },
        retryOptions: {
          retries: 0,
        },
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpResponseError);
    }
  });

  test("NetworkError", async () => {
    try {
      await makeHttpRequest({
        method: "get",
        urlTemplate: "http://localhost:666/",
        retryOptions: {
          retries: 0,
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(NetworkError);
    }
  });

  test("TimeoutError", async () => {
    try {
      await makeHttpRequest({
        method: "get",
        urlTemplate: baseURL,
        queryParams: {
          val: {
            delay: 600,
          },
        },
        timeout: 500,
        retryOptions: {
          retries: 0,
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(TimeoutError);
    }
  });

  test("Retry mechanism should work correctly", async () => {
    const attemptTestValue = 3; // This should be one less than retries to ensure it hits the correct attempt
    const retryOptions = {
      retries: 3,
      initialDelay: 100,
      backoffMultiplier: 1,
    };

    const response = await makeHttpRequest({
      urlTemplate: `${baseURL}/`,
      method: "get",
      queryParams: { val: { attemptTest: attemptTestValue } },
      retryOptions,
      timeout: 1000,
    });

    expect(response.attempts).toBe(3);
  }, 15000);
});
