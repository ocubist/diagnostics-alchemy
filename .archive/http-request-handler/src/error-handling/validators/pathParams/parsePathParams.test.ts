import { z } from "zod";
import { baseURL } from "../../../tests/globalSetup";
import { PathParams } from "../../../types/PathParams";
import { PathParameterParsingError } from "../../errors/request";
import { parsePathParams } from "./parsePathParams";

describe("Test function parsePathParams", () => {
  test("without schema", () => {
    const pathParams: PathParams = { a: "A" };

    const parsedWithoutSchema = parsePathParams(pathParams) as any;
    const parsedWithUndefined = parsePathParams(undefined);

    expect(parsedWithoutSchema.a).toBe("A");
    expect(parsedWithUndefined).toBeUndefined();
  });

  test("with schema", () => {
    const pathParams: PathParams = { a: "A" };
    const schema = z.object({ a: z.string() });

    const parsedWithSchema = parsePathParams(pathParams, schema) as any;

    expect(parsedWithSchema.a).toBe("A");
  });

  test("to provoke errors", () => {
    const pathParams: PathParams = { a: "A" };
    const schema = z.object({ a: z.string() });
    const wrongSchema = z.object({ b: z.string() });

    try {
      parsePathParams(undefined, schema);
    } catch (error) {
      expect(error).toBeInstanceOf(PathParameterParsingError);
    }

    try {
      parsePathParams(pathParams, wrongSchema);
    } catch (error) {
      expect(error).toBeInstanceOf(PathParameterParsingError);
    }
  });
});
