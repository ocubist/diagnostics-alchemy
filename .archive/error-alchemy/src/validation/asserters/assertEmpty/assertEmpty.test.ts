import { AssertEmptyFailedError, assertEmpty } from "./assertEmpty";

describe("assertEmpty", () => {
  // Test for strings
  it("should not throw for an empty string", () => {
    expect(() => assertEmpty("")).not.toThrow();
  });

  it("should throw AssertEmptyFailedError for a non-empty string", () => {
    expect(() => assertEmpty("non-empty")).toThrow(AssertEmptyFailedError);
  });

  // Test for arrays
  it("should not throw for an empty array", () => {
    expect(() => assertEmpty([])).not.toThrow();
  });

  it("should throw AssertEmptyFailedError for a non-empty array", () => {
    expect(() => assertEmpty([1, 2, 3])).toThrow(AssertEmptyFailedError);
  });

  // Test for objects
  it("should not throw for an empty object", () => {
    expect(() => assertEmpty({})).not.toThrow();
  });

  it("should throw AssertEmptyFailedError for a non-empty object", () => {
    expect(() => assertEmpty({ key: "value" })).toThrow(AssertEmptyFailedError);
  });

  // Test for Sets
  it("should not throw for an empty Set", () => {
    expect(() => assertEmpty(new Set())).not.toThrow();
  });

  it("should throw AssertEmptyFailedError for a non-empty Set", () => {
    expect(() => assertEmpty(new Set([1, 2, 3]))).toThrow(
      AssertEmptyFailedError
    );
  });

  // Test for Maps
  it("should not throw for an empty Map", () => {
    expect(() => assertEmpty(new Map())).not.toThrow();
  });

  it("should throw AssertEmptyFailedError for a non-empty Map", () => {
    expect(() => assertEmpty(new Map([["key", "value"]]))).toThrow(
      AssertEmptyFailedError
    );
  });

  // Test for Typed Arrays (e.g., Uint8Array)
  it("should not throw for an empty Typed Array", () => {
    expect(() => assertEmpty(new Uint8Array())).not.toThrow();
  });

  it("should throw AssertEmptyFailedError for a non-empty Typed Array", () => {
    expect(() => assertEmpty(new Uint8Array([1, 2, 3]))).toThrow(
      AssertEmptyFailedError
    );
  });

  // Test for Buffer
  it("should not throw for an empty Buffer", () => {
    expect(() => assertEmpty(Buffer.alloc(0))).not.toThrow();
  });

  it("should throw AssertEmptyFailedError for a non-empty Buffer", () => {
    expect(() => assertEmpty(Buffer.from("non-empty"))).toThrow(
      AssertEmptyFailedError
    );
  });
});
