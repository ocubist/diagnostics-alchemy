import { z } from "zod";
import { RequestBodyParsingError } from "../../errors/request";
import { parseRequestBody } from "./parseRequestBody";

describe("Test function parseRequestBody", () => {
  const requestBody: any = {
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
    const parsedWithoutSchema = parseRequestBody(requestBody) as any;
    const parsedWithUndefined = parseRequestBody(undefined);

    expect(parsedWithoutSchema.str).toBe("A");
    expect(parsedWithoutSchema.arr[2]).toBe(5);
    expect(parsedWithoutSchema.bool).toBe(true);
    expect(parsedWithUndefined).toBeUndefined();
  });

  test("with schema", () => {
    const parsedWithSchema = parseRequestBody(requestBody, schema) as any;

    expect(parsedWithSchema.str).toBe("A");
    expect(parsedWithSchema.arr[2]).toBe(5);
    expect(parsedWithSchema.bool).toBe(true);
  });

  test("to provoke errors", () => {
    try {
      parseRequestBody(undefined, schema);
    } catch (error) {
      expect(error).toBeInstanceOf(RequestBodyParsingError);
    }

    try {
      parseRequestBody(requestBody, wrongSchema);
    } catch (error) {
      expect(error).toBeInstanceOf(RequestBodyParsingError);
    }
  });
});
