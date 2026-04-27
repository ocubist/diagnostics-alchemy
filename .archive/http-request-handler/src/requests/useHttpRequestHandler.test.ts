import { useHttpRequestHandler } from "./useHttpRequestHandler";
import { baseURL } from "../tests/globalSetup";
import { z } from "zod";
import { Headers } from "../types/Headers";

describe("Test useHttpRequestHandler", () => {
  const requestHandler = useHttpRequestHandler({
    baseUrl: baseURL,
    headers: { "Content-Type": "MyContentType" },
    responseType: "text",
    retryOptions: { initialDelay: 111, retries: 2 },
    timeout: 4999,
  });

  const ResponseBody = z.object({
    method: z.string(),
    headers: z.record(z.string()),
    query: z.any(),
    body: z.any(),
  });

  test("mainProps are correctly delivered to makeHttpRequest", async () => {
    const postRequest = requestHandler.craftPostRequest({
      pathParamsSchema: z.object({}),
      queryParamsSchema: z.object({}),
      requestBodySchema: z.object({}),
      // headers: { setAccept: "OverriddenMySetAccept" },
      // retryOptions: { retries: 1 },
      // timeout: 4998,
      // responseType: "json",
      responseBodySchema: z.string(),
    });

    const result = await postRequest({
      pathParams: {},
      queryParams: {},
      requestBody: {},
    });

    // console.log({ result });

    expect(result.requestProps.headers?.["Content-Type"]).toBe("MyContentType");
    expect(result.axiosConfig.responseType).toBe("text");
    expect(result.requestProps.retryOptions?.retries).toBe(2);
    expect(result.requestProps.retryOptions?.backoffMultiplier).toBe(2);
    expect(result.requestProps.retryOptions?.initialDelay).toBe(111);
    expect(result.requestProps.timeout).toBe(4999);
  });

  test("factoryProps are correctly overriding mainProps", async () => {
    const postRequest = requestHandler.craftPostRequest({
      pathParamsSchema: z.object({}),
      queryParamsSchema: z.object({}),
      requestBodySchema: z.object({}),
      headers: { "Content-Type": "MyOverriddenContentType" },
      retryOptions: { retries: 1 },
      timeout: 4998,
      responseType: "json",
      responseBodySchema: ResponseBody,
    });

    const result = await postRequest({
      pathParams: {},
      queryParams: {},
      requestBody: {},
    });

    // console.log({ result });

    expect(result.requestProps.headers?.["Content-Type"]).toBe(
      "MyOverriddenContentType"
    );
    expect(result.axiosConfig.responseType).toBe("json");
    expect(result.requestProps.retryOptions?.initialDelay).toBe(111);
    expect(result.requestProps.retryOptions?.retries).toBe(1);
    expect(result.requestProps.timeout).toBe(4998);
  });

  test("pathParams works as intended", async () => {
    const postRequest = requestHandler.craftPostRequest({
      pathParamsSchema: z.object({ id: z.number() }),
      queryParamsSchema: z.object({}),
      requestBodySchema: z.object({}),
      // headers: { setAccept: "OverriddenMySetAccept" },
      // retryOptions: { retries: 1 },
      // timeout: 4998,
      responseType: "json",
      responseBodySchema: ResponseBody,
      endpointTemplate: "{id}",
    });

    const response = await postRequest({
      pathParams: { id: 123 },
      queryParams: {},
      requestBody: {},
    });

    expect(response.url).toContain("123");
  });

  test("queryParams works as intended", async () => {
    const postRequest = requestHandler.craftPostRequest({
      pathParamsSchema: z.object({}),
      queryParamsSchema: z.object({ q: z.string() }),
      requestBodySchema: z.object({}),
      // headers: { setAccept: "OverriddenMySetAccept" },
      // retryOptions: { retries: 1 },
      // timeout: 4998,
      responseType: "json",
      responseBodySchema: ResponseBody,
      endpointTemplate: "{id}",
    });

    const response = await postRequest({
      pathParams: {},
      queryParams: { q: "Q" },
      requestBody: {},
    });

    expect(response.data.query.q).toBe("Q");
  });

  test("requestBody works as intended", async () => {
    const postRequest = requestHandler.craftPostRequest({
      pathParamsSchema: z.object({}),
      queryParamsSchema: z.object({}),
      requestBodySchema: z.object({ b: z.string() }),
      headers: { "Content-Type": "application/json" },
      // headers: { setAccept: "OverriddenMySetAccept" },
      // retryOptions: { retries: 1 },
      // timeout: 4998,
      responseType: "json",
      responseBodySchema: ResponseBody,
      endpointTemplate: "{id}",
    });

    const response = await postRequest({
      pathParams: {},
      queryParams: {},
      requestBody: { b: "B" },
    });

    expect(response.data.body.b).toBe("B");
  });

  test("responseBody works as intended", async () => {
    const postRequest = requestHandler.craftPostRequest({
      pathParamsSchema: z.object({}),
      queryParamsSchema: z.object({}),
      requestBodySchema: z.object({ a: z.string(), b: z.string() }),
      headers: { "Content-Type": "application/json" },
      // headers: { setAccept: "OverriddenMySetAccept" },
      // retryOptions: { retries: 1 },
      // timeout: 4998,
      responseType: "json",
      responseBodySchema: z.object({ body: z.object({ a: z.string() }) }),
      endpointTemplate: "{id}",
    });

    const response = await postRequest({
      pathParams: {},
      queryParams: {},
      requestBody: { a: "A", b: "B" },
    });

    // console.log(response);

    expect(response.data.body.a).toBe("A");
    // @ts-ignore
    expect(response.data.body.b).toBeUndefined();
  });

  test("craftGetRequest", async () => {
    const request = useHttpRequestHandler({ baseUrl: baseURL }).craftGetRequest(
      {
        pathParamsSchema: z.object({}),
        queryParamsSchema: z.object({ q: z.string() }),
      }
    );

    expect(
      (await request({ pathParams: {}, queryParams: { q: "Q" } })).data.query.q
    ).toBe("Q");
  });

  test("craftPostRequest", async () => {
    const request = useHttpRequestHandler({
      baseUrl: baseURL,
    }).craftPostRequest({
      pathParamsSchema: z.object({}),
      queryParamsSchema: z.object({}),
      requestBodySchema: z.object({ b: z.string() }),
    });

    expect(
      (
        await request({
          pathParams: {},
          queryParams: {},
          requestBody: { b: "B" },
        })
      ).data.body.b
    ).toBe("B");
  });

  test("craftPutRequest", async () => {
    const request = useHttpRequestHandler({
      baseUrl: baseURL,
    }).craftPutRequest({
      pathParamsSchema: z.object({}),
      queryParamsSchema: z.object({}),
      requestBodySchema: z.object({ b: z.string() }),
    });

    expect(
      (
        await request({
          pathParams: {},
          queryParams: {},
          requestBody: { b: "B" },
        })
      ).data.body.b
    ).toBe("B");
  });

  test("craftDeleteRequest", async () => {
    const request = useHttpRequestHandler({
      baseUrl: baseURL,
    }).craftDeleteRequest({
      pathParamsSchema: z.object({}),
      queryParamsSchema: z.object({ q: z.string() }),
    });

    expect(
      (await request({ pathParams: {}, queryParams: { q: "Q" } })).data.query.q
    ).toBe("Q");
  });

  test("craftPatchRequest", async () => {
    const request = useHttpRequestHandler({
      baseUrl: baseURL,
    }).craftPatchRequest({
      pathParamsSchema: z.object({}),
      queryParamsSchema: z.object({}),
      requestBodySchema: z.object({ b: z.string() }),
    });

    expect(
      (
        await request({
          pathParams: {},
          queryParams: {},
          requestBody: { b: "B" },
        })
      ).data.body.b
    ).toBe("B");
  });

  test("craftOptionsRequest", async () => {
    const request = useHttpRequestHandler({
      baseUrl: baseURL,
    }).craftOptionsRequest({
      pathParamsSchema: z.object({}),
      queryParamsSchema: z.object({ q: z.string() }),
    });

    expect(
      (await request({ pathParams: {}, queryParams: { q: "Q" } })).data.query.q
    ).toBe("Q");
  });

  test("craftHeadRequest", async () => {
    const request = useHttpRequestHandler({
      baseUrl: baseURL,
      headers: { someHeader: "SomeHeader" },
    }).craftHeadRequest();

    const result = await request();
    console.log(result);

    // expect(result.headers.someHeader).toBe("SomeHeader");
    expect(result.requestProps.headers?.someHeader).toBe("SomeHeader");
  });

  test("craftPurgeRequest", async () => {
    const request = useHttpRequestHandler({
      baseUrl: baseURL,
    }).craftPurgeRequest({
      pathParamsSchema: z.object({}),
      queryParamsSchema: z.object({}),
      requestBodySchema: z.object({ b: z.string() }),
    });

    expect(
      (
        await request({
          pathParams: {},
          queryParams: {},
          requestBody: { b: "B" },
        })
      ).data.body.b
    ).toBe("B");
  });

  test("craftLinkRequest", async () => {
    const request = useHttpRequestHandler({
      baseUrl: baseURL,
    }).craftLinkRequest({
      pathParamsSchema: z.object({}),
      queryParamsSchema: z.object({}),
      requestBodySchema: z.object({ b: z.string() }),
    });

    expect(
      (
        await request({
          pathParams: {},
          queryParams: {},
          requestBody: { b: "B" },
        })
      ).data.body.b
    ).toBe("B");
  });

  test("craftUnlinkRequest", async () => {
    const request = useHttpRequestHandler({
      baseUrl: baseURL,
    }).craftUnlinkRequest({
      pathParamsSchema: z.object({}),
      queryParamsSchema: z.object({}),
      requestBodySchema: z.object({ b: z.string() }),
    });

    expect(
      (
        await request({
          pathParams: {},
          queryParams: {},
          requestBody: { b: "B" },
        })
      ).data.body.b
    ).toBe("B");
  });
});
