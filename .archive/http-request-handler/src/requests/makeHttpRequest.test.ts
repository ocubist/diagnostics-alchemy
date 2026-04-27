import { z } from "zod";
import { baseURL } from "../tests/globalSetup";
import { makeHttpRequest } from "./makeHttpRequest";
import { response } from "express";

describe("More complex tests for makeHttpRequest.ts", () => {
  test("ResponseBody with Schema", async () => {
    const response = await makeHttpRequest({
      urlTemplate: baseURL,
      method: "post",
      responseBodySchema: z.object({ body: z.object({ a: z.string() }) }),
      requestBody: { val: { a: "A", b: "B" } },
    });

    expect(response.data.body.a).toBe("A");
    // @ts-ignore
    expect(response.data.body.b).toBeUndefined();
  });

  test("RequestBody with Schema", async () => {
    const response = await makeHttpRequest({
      urlTemplate: baseURL,
      method: "post",
      requestBody: {
        // @ts-ignore
        val: { a: "A", b: "B" },
        schema: z.object({ a: z.string() }),
      },
    });

    expect(response.data?.body?.a).toBe("A");
    expect(response.data?.body?.b).toBeUndefined();
  });

  test("PathParams with Schema", async () => {
    const response = await makeHttpRequest({
      urlTemplate: `${baseURL}/{id}`,
      method: "post",
      pathParams: { val: { id: `111` }, schema: z.object({ id: z.string() }) },
    });

    expect(response.url).toBe(`${baseURL}/111`);
  });

  test("QueryParams with Schema", async () => {
    const response = await makeHttpRequest({
      urlTemplate: `${baseURL}/{id}`,
      method: "post",
      queryParams: {
        val: {
          str: "string",
          arr: [true, 222, false, "awesome"],
          num: 111,
        },
        schema: z.object({
          arr: z.array(
            z.union([z.boolean(), z.number(), z.boolean(), z.string()])
          ),
          str: z.string(),
          num: z.number(),
        }),
      },
    });

    // console.log(response.data.query.arr);

    expect(response.data.query.str).toBe("string");
    expect(response.data.query.num).toBe("111");
    expect(response.data.query.arr).toContain("true");
    expect(response.data.query.arr).toContain("false");
    expect(response.data.query.arr).toContain("awesome");
    expect(response.data.query.arr).toContain("222");
  });
});
