import { makeHttpRequest } from "../requests/makeHttpRequest";
import { useHttpRequestHandler } from "../requests/useHttpRequestHandler";
import { z } from "zod";
import { MakeHttpRequestProps } from "../types/MakeHttpRequestProps";

const baseURL = "http://localhost:3000";

// Define the logger mock
const loggerMock = jest.fn();

describe("Logger Test", () => {
  const pathParamsSchema = z.object({ id: z.string() });
  const queryParamsSchema = z.object({ q: z.string() });
  const requestBodySchema = z.object({ data: z.string() });
  const responseBodySchema = z.object({
    method: z.string(),
    headers: z.record(z.string()),
    query: z.any(),
    body: z.any(),
  });

  const baseRequestProps: MakeHttpRequestProps = {
    method: "POST",
    urlTemplate: `${baseURL}/{id}`,
    pathParams: { val: { id: "123" }, schema: pathParamsSchema },
    queryParams: { val: { q: "test" }, schema: queryParamsSchema },
    requestBody: { val: { data: "some data" }, schema: requestBodySchema },
    responseBodySchema,
    logger: loggerMock,
  };

  test("logger is called on successful request with makeHttpRequest", async () => {
    const response = await makeHttpRequest(baseRequestProps);

    expect(response.data.body.data).toBe("some data");

    // Verify that the logger was called
    expect(loggerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        success: true,
        urlTemplate: `${baseURL}/{id}`,
        headers: expect.any(Object),
        requestBody: { data: "some data" },
        responseBody: expect.any(Object),
        status: 200,
        url: `${baseURL}/123`,
        duration: expect.any(Number),
        attempts: 1,
      })
    );

    expect(loggerMock).not.toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        success: true,
        urlTemplate: `${baseURL}/{id}`,
        headers: expect.any(Object),
        requestBody: { data: "some data" },
        responseBody: expect.any(Object),
        status: 200,
        url: `${baseURL}/123`,
        duration: expect.any(Number),
        attempts: 1,
      })
    );
  });

  test("logger is called on successful request with useHttpRequestHandler", async () => {
    const requestHandler = useHttpRequestHandler({
      baseUrl: baseURL,
      headers: { "Content-Type": "application/json" },
      responseType: "json",
      logger: loggerMock,
    });

    const postRequest = requestHandler.craftPostRequest({
      pathParamsSchema: z.object({ id: z.string() }),
      queryParamsSchema: z.object({ q: z.string() }),
      requestBodySchema: z.object({ data: z.string() }),
      responseBodySchema: z.object({
        method: z.string(),
        headers: z.record(z.string()),
        query: z.any(),
        body: z.any(),
      }),
    });

    const response = await postRequest({
      pathParams: { id: "123" },
      queryParams: { q: "test" },
      requestBody: { data: "some data" },
    });

    expect(response.data.body.data).toBe("some data");

    // Verify that the logger was called
    expect(loggerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        success: true,
        urlTemplate: `${baseURL}/{id}`,
        headers: expect.any(Object),
        requestBody: { data: "some data" },
        responseBody: expect.any(Object),
        status: 200,
        url: `${baseURL}/123`,
        duration: expect.any(Number),
        attempts: 1,
      })
    );

    expect(loggerMock).not.toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        success: true,
        urlTemplate: `${baseURL}/{id}`,
        headers: expect.any(Object),
        requestBody: { data: "some data" },
        responseBody: expect.any(Object),
        status: 200,
        url: `${baseURL}/123`,
        duration: expect.any(Number),
        attempts: 1,
      })
    );
  });
});
