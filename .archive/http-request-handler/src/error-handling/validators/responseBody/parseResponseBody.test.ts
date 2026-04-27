import { z } from "zod";
import { ResponseParsingError } from "../../errors/response";
import { parseResponseBody } from "./parseResponseBody";

describe("Test function parseResponseBody", () => {
  const responseBody: any = {
    str: "A",
    bool: true,
    arr: ["B", false, 5],
  };
  const schema = z.object({
    str: z.string(),
    bool: z.boolean(),
    arr: z.array(z.union([z.string(), z.boolean(), z.number()])),
  });
  const wrongSchema = z.object({ b: z.string() });

  test("without schema", () => {
    const parsedWithoutSchema = parseResponseBody(responseBody) as any;
    const parsedWithUndefined = parseResponseBody(undefined);

    expect(parsedWithoutSchema.str).toBe("A");
    expect(parsedWithoutSchema.arr[2]).toBe(5);
    expect(parsedWithoutSchema.bool).toBe(true);
    expect(parsedWithUndefined).toBeUndefined();
  });

  test("with schema", () => {
    const parsedWithSchema = parseResponseBody(responseBody, schema) as any;

    expect(parsedWithSchema.str).toBe("A");
    expect(parsedWithSchema.arr[2]).toBe(5);
    expect(parsedWithSchema.bool).toBe(true);
  });

  test("to provoke errors", () => {
    try {
      parseResponseBody(undefined, schema);
    } catch (error) {
      expect(error).toBeInstanceOf(ResponseParsingError);
    }

    try {
      parseResponseBody(responseBody, wrongSchema);
    } catch (error) {
      expect(error).toBeInstanceOf(ResponseParsingError);
    }
  });
});
