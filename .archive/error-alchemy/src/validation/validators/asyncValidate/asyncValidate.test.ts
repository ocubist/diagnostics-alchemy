import { ZodSchema, z } from "zod";
import { asyncValidate } from "./asyncValidate";

describe("asyncValidate", () => {
  const stringSchema: ZodSchema<string> = z.string();

  it("should return true for valid data", async () => {
    const result = await asyncValidate("valid string", stringSchema);
    expect(result).toBe(true);
  });

  it("should return false for invalid data", async () => {
    // @ts-ignore
    const result = await asyncValidate(123, stringSchema);
    expect(result).toBe(false);
  });
});
