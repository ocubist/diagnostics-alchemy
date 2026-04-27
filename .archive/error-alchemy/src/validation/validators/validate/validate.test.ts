import { ZodSchema, ZodString, z } from "zod";
import { validate } from "./validate";

describe("validate", () => {
  const stringSchema: ZodSchema<string> = z.string();

  it("should return true for valid data", () => {
    const result = validate("valid string", stringSchema);
    expect(result).toBe(true);
  });

  it("should return false for invalid data", () => {
    // @ts-ignore
    const result = validate(123, stringSchema);
    expect(result).toBe(false);
  });
});
