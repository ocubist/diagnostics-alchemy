import {
  AssertNotEmptyFailedError,
  AssertNotEmptyMaxSmallerThanMinError,
  assertNotEmpty,
} from "./assertNotEmpty";

describe("assertNotEmpty - without min/max condition", () => {
  // Strings
  it("should not throw for non-empty strings", () => {
    expect(() => assertNotEmpty("Hello")).not.toThrow();
  });

  it("should throw for empty strings", () => {
    expect(() => assertNotEmpty("")).toThrow(AssertNotEmptyFailedError);
  });

  // Arrays
  it("should not throw for non-empty arrays", () => {
    expect(() => assertNotEmpty([1, 2, 3])).not.toThrow();
  });

  it("should throw for empty arrays", () => {
    expect(() => assertNotEmpty([])).toThrow(AssertNotEmptyFailedError);
  });

  // Objects
  it("should not throw for non-empty objects", () => {
    expect(() => assertNotEmpty({ key: "value" })).not.toThrow();
  });

  it("should throw for empty objects", () => {
    expect(() => assertNotEmpty({})).toThrow(AssertNotEmptyFailedError);
  });

  // Sets
  it("should not throw for non-empty sets", () => {
    expect(() => assertNotEmpty(new Set([1]))).not.toThrow();
  });

  it("should throw for empty sets", () => {
    expect(() => assertNotEmpty(new Set())).toThrow(AssertNotEmptyFailedError);
  });

  // Maps
  it("should not throw for non-empty maps", () => {
    expect(() => assertNotEmpty(new Map([["key", "value"]]))).not.toThrow();
  });

  it("should throw for empty maps", () => {
    expect(() => assertNotEmpty(new Map())).toThrow(AssertNotEmptyFailedError);
  });

  // Typed Arrays
  it("should not throw for non-empty typed arrays", () => {
    expect(() => assertNotEmpty(new Uint8Array([1, 2]))).not.toThrow();
  });

  it("should throw for empty typed arrays", () => {
    expect(() => assertNotEmpty(new Uint8Array())).toThrow(
      AssertNotEmptyFailedError
    );
  });

  // Buffers
  it("should not throw for non-empty buffers", () => {
    expect(() => assertNotEmpty(Buffer.from([1, 2]))).not.toThrow();
  });

  it("should throw for empty buffers", () => {
    expect(() => assertNotEmpty(Buffer.from([]))).toThrow(
      AssertNotEmptyFailedError
    );
  });
});

describe("assertNotEmpty - Boundary Conditions", () => {
  // Min Length/Size Tests
  it("should throw if string length is less than min", () => {
    expect(() => assertNotEmpty("ab", 3)).toThrow(AssertNotEmptyFailedError);
  });

  it("should throw if array size is less than min", () => {
    expect(() => assertNotEmpty([1, 2], 3)).toThrow(AssertNotEmptyFailedError);
  });

  it("should throw if object property count is less than min", () => {
    expect(() => assertNotEmpty({ a: 1, b: 2 }, 3)).toThrow(
      AssertNotEmptyFailedError
    );
  });

  it("should throw if set size is less than min", () => {
    expect(() => assertNotEmpty(new Set([1, 2]), 3)).toThrow(
      AssertNotEmptyFailedError
    );
  });

  it("should throw if map size is less than min", () => {
    expect(() =>
      assertNotEmpty(
        new Map([
          ["a", 1],
          ["b", 2],
        ]),
        3
      )
    ).toThrow(AssertNotEmptyFailedError);
  });

  it("should throw if typed array length is less than min", () => {
    expect(() => assertNotEmpty(new Uint8Array([1, 2]), 3)).toThrow(
      AssertNotEmptyFailedError
    );
  });

  it("should throw if buffer length is less than min", () => {
    expect(() => assertNotEmpty(Buffer.from([1, 2]), 3)).toThrow(
      AssertNotEmptyFailedError
    );
  });

  // Max Length/Size Tests
  it("should throw if string length exceeds max", () => {
    expect(() => assertNotEmpty("abcd", 1, 3)).toThrow(
      AssertNotEmptyFailedError
    );
  });

  it("should throw if array size exceeds max", () => {
    expect(() => assertNotEmpty([1, 2, 3, 4], 1, 3)).toThrow(
      AssertNotEmptyFailedError
    );
  });

  it("should throw if object property count exceeds max", () => {
    expect(() => assertNotEmpty({ a: 1, b: 2, c: 3, d: 4 }, 1, 3)).toThrow(
      AssertNotEmptyFailedError
    );
  });

  it("should throw if set size exceeds max", () => {
    expect(() => assertNotEmpty(new Set([1, 2, 3, 4]), 1, 3)).toThrow(
      AssertNotEmptyFailedError
    );
  });

  it("should throw if map size exceeds max", () => {
    expect(() =>
      assertNotEmpty(
        new Map([
          ["a", 1],
          ["b", 2],
          ["c", 3],
          ["d", 4],
        ]),
        1,
        3
      )
    ).toThrow(AssertNotEmptyFailedError);
  });

  it("should throw if typed array length exceeds max", () => {
    expect(() => assertNotEmpty(new Uint8Array([1, 2, 3, 4]), 1, 3)).toThrow(
      AssertNotEmptyFailedError
    );
  });

  it("should throw if buffer length exceeds max", () => {
    expect(() => assertNotEmpty(Buffer.from([1, 2, 3, 4]), 1, 3)).toThrow(
      AssertNotEmptyFailedError
    );
  });

  // Max Smaller Than Min
  it("should throw an error if max is smaller than min", () => {
    expect(() => assertNotEmpty([1, 2, 3], 4, 3)).toThrow(
      AssertNotEmptyMaxSmallerThanMinError
    );
  });
});
