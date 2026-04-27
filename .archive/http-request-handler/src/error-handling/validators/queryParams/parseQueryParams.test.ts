import { z } from "zod";
import { QueryParams } from "../../../types/QueryParams";
import { QueryParsingError } from "../../errors/request";
import { parseQueryParams } from "./parseQueryParams";

describe("Test function parseQueryParams", () => {
  const queryParams: QueryParams = {
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
    const parsedWithoutSchema = parseQueryParams(queryParams) as any;
    const parsedWithUndefined = parseQueryParams(undefined);

    expect(parsedWithoutSchema.str).toBe("A");
    expect(parsedWithoutSchema.arr[2]).toBe(5);
    expect(parsedWithoutSchema.bool).toBe(true);
    expect(parsedWithUndefined).toBeUndefined();
  });

  test("with schema", () => {
    const parsedWithSchema = parseQueryParams(queryParams, schema) as any;

    expect(parsedWithSchema.str).toBe("A");
    expect(parsedWithSchema.arr[2]).toBe(5);
    expect(parsedWithSchema.bool).toBe(true);
  });

  test("to provoke errors", () => {
    try {
      parseQueryParams(undefined, schema);
    } catch (error) {
      expect(error).toBeInstanceOf(QueryParsingError);
    }

    try {
      parseQueryParams(queryParams, wrongSchema);
    } catch (error) {
      expect(error).toBeInstanceOf(QueryParsingError);
    }
  });
});
