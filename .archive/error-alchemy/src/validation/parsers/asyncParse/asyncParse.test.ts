import { ZodSchema, ZodString, ZodError, z } from "zod";
import { asyncParse, AsyncParseFailedError } from "./asyncParse";

describe("asyncParse", () => {
  const stringSchema: ZodSchema<string> = z.string();

  it("should resolve with valid data", async () => {
    await expect(asyncParse("valid string", stringSchema)).resolves.toBe(
      "valid string"
    );
  });

  it("should reject with AsyncParseFailedError for invalid data", async () => {
    // @ts-ignore
    await expect(asyncParse(123, stringSchema)).rejects.toThrow(
      AsyncParseFailedError
    );
  });
});
