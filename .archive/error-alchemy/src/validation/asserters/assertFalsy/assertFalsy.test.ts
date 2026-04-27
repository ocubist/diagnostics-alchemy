import { assertFalsy, AssertFalsyFailedError } from "./assertFalsy";

describe("assertFalsy", () => {
  // Test cases where assertFalsy should succeed
  it("should not throw for false", () => {
    expect(() => assertFalsy(false)).not.toThrow();
  });

  it("should not throw for null", () => {
    expect(() => assertFalsy(null)).not.toThrow();
  });

  it("should not throw for undefined", () => {
    expect(() => assertFalsy(undefined)).not.toThrow();
  });

  it("should not throw for 0", () => {
    expect(() => assertFalsy(0)).not.toThrow();
  });

  it("should not throw for an empty string", () => {
    expect(() => assertFalsy("")).not.toThrow();
  });

  it("should not throw for NaN", () => {
    expect(() => assertFalsy(NaN)).not.toThrow();
  });

  // Test cases where assertFalsy should fail
  it("should throw AssertFalsyFailedError for true", () => {
    expect(() => assertFalsy(true)).toThrow(AssertFalsyFailedError);
  });

  it("should throw AssertFalsyFailedError for a non-empty string", () => {
    expect(() => assertFalsy("non-empty")).toThrow(AssertFalsyFailedError);
  });

  it("should throw AssertFalsyFailedError for a non-zero number", () => {
    expect(() => assertFalsy(1)).toThrow(AssertFalsyFailedError);
  });

  it("should throw AssertFalsyFailedError for an object", () => {
    expect(() => assertFalsy({})).toThrow(AssertFalsyFailedError);
  });

  it("should throw AssertFalsyFailedError for an array", () => {
    expect(() => assertFalsy([])).toThrow(AssertFalsyFailedError);
  });
});
