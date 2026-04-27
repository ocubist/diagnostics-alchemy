import { objectify } from "./simplifyData";

describe("objectify - Basic Values", () => {
  it("should handle primitive values", () => {
    const primitives = [
      { input: "hello", expected: { val: "hello" } },
      { input: 42, expected: { val: 42 } },
      { input: true, expected: { val: true } },
      { input: null, expected: { val: null } },
      { input: undefined, expected: { val: undefined } },
      { input: BigInt(123456789), expected: { val: BigInt(123456789) } },
    ];

    primitives.forEach(({ input, expected }) => {
      expect(objectify(input)).toEqual(expected);
    });
  });

  it("should handle unexpected inputs gracefully", () => {
    const unexpectedInputs = [
      { input: Symbol("test"), expectedKey: "ERROR_OCCURRED" },
      { input: () => {}, expectedKey: "ERROR_OCCURRED" },
    ];

    unexpectedInputs.forEach(({ input, expectedKey }) => {
      const result = objectify(input);
      expect(result).not.toHaveProperty(expectedKey); // Now symbols/functions are ignored
    });
  });
});

describe("objectify - Nested Objects", () => {
  it("should handle nested objects up to the depth limit", () => {
    const nestedObject = { a: { b: { c: { d: "too deep" } } } };
    const result = objectify(nestedObject, 2);

    expect(result).toEqual({
      a: { b: { summary: "[Object]" } }, // Depth exceeded
    });
  });

  it("should handle deeply nested objects with circular references", () => {
    const circularObject: Record<string, any> = { a: { b: {} } };
    circularObject.a.b.c = circularObject; // Circular reference

    const result = objectify(circularObject);
    expect(result).toEqual({
      a: {
        b: {
          c: { summary: "[Circular Reference]" },
        },
      },
    });
  });
});

describe("objectify - Error Handling", () => {
  it("should handle error objects and extract properties", () => {
    const error = new Error("Test error");
    const result = objectify(error);

    expect(result).toEqual(
      expect.objectContaining({
        message: "Test error",
        name: "Error",
        stack: expect.any(Array), // Ensure stack is parsed into an array
      })
    );
  });

  it("should handle nested errors", () => {
    const error = new Error("Outer error");
    (error as any).inner = new Error("Inner error");

    const result = objectify(error, 2);
    expect(result).toEqual(
      expect.objectContaining({
        message: "Outer error",
        inner: expect.objectContaining({
          message: "Inner error",
        }),
      })
    );
  });
});

describe("objectify - Deterministic Key Order", () => {
  it("should produce consistent key order for objects", () => {
    const unsortedObject = { z: 1, a: 2, m: 3 };
    const result = objectify(unsortedObject);

    expect(Object.keys(result)).toEqual(["a", "m", "z"]);
  });

  it("should produce consistent key order for nested objects", () => {
    const nestedObject = { outer: { z: 1, a: 2, m: 3 } };
    const result = objectify(nestedObject);

    expect(
      Object.keys((result.outer as Record<string, unknown>) || {})
    ).toEqual(["a", "m", "z"]);
  });
});

describe("objectify - Arrays and Mixed Types", () => {
  it("should handle arrays and nested arrays correctly", () => {
    const arrayObject = { arr: [1, "two", { three: 3 }] };
    const result = objectify(arrayObject);

    expect(result).toEqual({
      arr: [1, "two", { three: 3 }],
    });
  });
});
