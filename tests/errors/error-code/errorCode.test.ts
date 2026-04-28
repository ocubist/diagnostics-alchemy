import { describe, it, expect } from "vitest";
import { errorCodeSelector } from "../../../src/errors/error-code/errorCodeSelector";
import { ErrorCode } from "../../../src/errors/error-code/types";
import { isErrorCode } from "../../../src/errors/error-code/isErrorCode";

describe("errorCodeSelector", () => {
  it("exports a non-empty object of string values", () => {
    const values = Object.values(errorCodeSelector);
    expect(values.length).toBeGreaterThan(0);
    expect(values.every((v) => typeof v === "string")).toBe(true);
  });

  it("contains expected common codes", () => {
    expect(errorCodeSelector.UNKNOWN_ERROR).toBe("UNKNOWN_ERROR");
    expect(errorCodeSelector.VALIDATION_ERROR).toBe("VALIDATION_ERROR");
  });

  it("values are unique", () => {
    const values = Object.values(errorCodeSelector);
    expect(new Set(values).size).toBe(values.length);
  });
});

describe("ErrorCode zod enum", () => {
  it("accepts a known error code", () => {
    const result = ErrorCode.safeParse("UNKNOWN_ERROR");
    expect(result.success).toBe(true);
  });

  it("rejects an unknown string", () => {
    const result = ErrorCode.safeParse("MADE_UP_CODE");
    expect(result.success).toBe(false);
  });
});

describe("isErrorCode", () => {
  it("returns true for a known error code", () => {
    expect(isErrorCode("UNKNOWN_ERROR")).toBe(true);
    expect(isErrorCode("VALIDATION_ERROR")).toBe(true);
  });

  it("returns false for unknown strings", () => {
    expect(isErrorCode("NOT_A_CODE")).toBe(false);
    expect(isErrorCode("")).toBe(false);
  });
});
