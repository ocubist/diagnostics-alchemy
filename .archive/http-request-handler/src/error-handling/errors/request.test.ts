import { z } from "zod";
import { makeHttpRequest } from "../../requests/makeHttpRequest";
import { baseURL } from "../../tests/globalSetup";
import {
  InvalidTimeoutError,
  PathParameterParsingError,
  QueryParsingError,
  RequestBodyParsingError,
  RetryOptionsParsingError,
  UrlValidationError,
} from "./request";

describe("Provoking invalid request to throw the correct errors", () => {
  test("QueryParsingError", async () => {
    await expect(async () => {
      await makeHttpRequest({
        urlTemplate: baseURL,
        method: "post",
        queryParams: {
          // @ts-ignore
          val: { a: "A" },
          schema: z.object({ a: z.number() }),
        },
      });
    }).rejects.toThrow(QueryParsingError);
  });

  test("RequestBodyParsingError", async () => {
    await expect(async () => {
      await makeHttpRequest({
        urlTemplate: baseURL,
        method: "post",
        requestBody: {
          // @ts-ignore
          val: { a: "A" },
          schema: z.object({ a: z.number() }),
        },
      });
    }).rejects.toThrow(RequestBodyParsingError);
  });

  test("PathParameterParsingError", async () => {
    await expect(async () => {
      await makeHttpRequest({
        urlTemplate: baseURL,
        method: "post",
        pathParams: {
          // @ts-ignore
          val: { a: "A" },
          schema: z.object({ b: z.string() }),
        },
      });
    }).rejects.toThrow(PathParameterParsingError);
  });

  test("UrlValidationError", async () => {
    await expect(async () => {
      await makeHttpRequest({
        urlTemplate: "12324245",
        method: "post",
      });
    }).rejects.toThrow(UrlValidationError);
  });

  test("InvalidTimeoutError", async () => {
    await expect(async () => {
      await makeHttpRequest({
        urlTemplate: baseURL,
        method: "post",
        timeout: 99999999,
      });
    }).rejects.toThrow(InvalidTimeoutError);
  });

  test("RetryOptionsParsingError", async () => {
    await expect(async () => {
      await makeHttpRequest({
        urlTemplate: baseURL,
        method: "post",
        // @ts-ignore
        retryOptions: 2,
      });
    }).rejects.toThrow(RetryOptionsParsingError);
  });
});
