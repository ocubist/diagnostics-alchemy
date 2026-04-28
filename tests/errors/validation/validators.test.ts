import { describe, it, expect } from "vitest";
import { z } from "zod";
import { validate } from "../../../src/errors/validation/validators/validate";
import { asyncValidate } from "../../../src/errors/validation/validators/asyncValidate";

const numSchema = z.number().int().positive();
const emailSchema = z.string().email();

describe("validate", () => {
  it("returns true for a valid value", () => {
    expect(validate(42, numSchema)).toBe(true);
  });

  it("returns false for an invalid value", () => {
    expect(validate(-1, numSchema)).toBe(false);
    expect(validate("not a number", numSchema)).toBe(false);
  });

  it("acts as a type guard", () => {
    const value: unknown = "test@example.com";
    if (validate(value, emailSchema)) {
      // TypeScript should narrow value to string here
      const _upper = value.toUpperCase();
      expect(typeof _upper).toBe("string");
    } else {
      throw new Error("Expected validation to pass");
    }
  });

  it("does not throw — returns false instead", () => {
    expect(() => validate(null, numSchema)).not.toThrow();
    expect(validate(null, numSchema)).toBe(false);
  });

  it("handles complex schemas", () => {
    const schema = z.object({ x: z.number(), y: z.number() });
    expect(validate({ x: 1, y: 2 }, schema)).toBe(true);
    expect(validate({ x: 1 }, schema)).toBe(false);
    expect(validate(null, schema)).toBe(false);
  });
});

describe("asyncValidate", () => {
  it("resolves true for a valid value", async () => {
    expect(await asyncValidate(5, numSchema)).toBe(true);
  });

  it("resolves false for an invalid value", async () => {
    expect(await asyncValidate(-3, numSchema)).toBe(false);
    expect(await asyncValidate("foo", numSchema)).toBe(false);
  });

  it("does not reject — resolves false on invalid input", async () => {
    await expect(asyncValidate(null, numSchema)).resolves.toBe(false);
  });

  it("works with async refinements", async () => {
    const asyncSchema = z
      .string()
      .refine(async (val) => val.startsWith("ok"), { message: "must start with ok" });

    expect(await asyncValidate("ok-here", asyncSchema)).toBe(true);
    expect(await asyncValidate("not-ok", asyncSchema)).toBe(false);
  });
});
