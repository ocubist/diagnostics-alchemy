import { describe, it, expect } from "vitest";
import { z } from "zod";
import { parse, ParseFailedError } from "../../../src/errors/validation/parsers/parse";
import { asyncParse, AsyncParseFailedError } from "../../../src/errors/validation/parsers/asyncParse";

const userSchema = z.object({
  name: z.string(),
  age: z.number().int().min(0),
});

describe("parse", () => {
  it("returns the parsed value for a valid input", () => {
    const result = parse({ name: "Alice", age: 30 }, userSchema);
    expect(result).toEqual({ name: "Alice", age: 30 });
  });

  it("throws ParseFailedError for an invalid input", () => {
    expect(() => parse({ name: 123, age: "not a number" }, userSchema)).toThrow(ParseFailedError);
  });

  it("ParseFailedError message contains validation details", () => {
    try {
      parse({ name: 123 }, userSchema);
    } catch (e) {
      expect(e).toBeInstanceOf(ParseFailedError);
      if (e instanceof ParseFailedError) {
        expect(e.message.length).toBeGreaterThan(0);
        expect(e.payload).toHaveProperty("validationErrorDetails");
      }
    }
  });

  it("does not throw ParseFailedError for non-Zod errors — re-throws as-is", () => {
    const throwingSchema = z.string().transform(() => {
      throw new RangeError("custom non-zod error");
    });
    expect(() => parse("input", throwingSchema)).toThrow(RangeError);
  });

  it("ParseFailedError has VALIDATION_ERROR code", () => {
    try {
      parse(null, userSchema);
    } catch (e) {
      if (e instanceof ParseFailedError) {
        expect(e.errorCode).toBe("VALIDATION_ERROR");
      }
    }
  });
});

describe("asyncParse", () => {
  it("resolves the parsed value for a valid input", async () => {
    const result = await asyncParse({ name: "Bob", age: 25 }, userSchema);
    expect(result).toEqual({ name: "Bob", age: 25 });
  });

  it("rejects with AsyncParseFailedError for an invalid input", async () => {
    await expect(
      asyncParse({ name: 42, age: "bad" }, userSchema)
    ).rejects.toThrow(AsyncParseFailedError);
  });

  it("AsyncParseFailedError contains validation details", async () => {
    try {
      await asyncParse({ age: -1 }, userSchema);
    } catch (e) {
      expect(e).toBeInstanceOf(AsyncParseFailedError);
      if (e instanceof AsyncParseFailedError) {
        expect(e.payload).toHaveProperty("validationErrorDetails");
        expect(e.errorCode).toBe("VALIDATION_ERROR");
      }
    }
  });

  it("works with async Zod refinements", async () => {
    const asyncSchema = z
      .string()
      .refine(async (val) => val.length > 2, { message: "too short" });

    await expect(asyncParse("hi", asyncSchema)).rejects.toThrow(AsyncParseFailedError);
    await expect(asyncParse("hello", asyncSchema)).resolves.toBe("hello");
  });
});
