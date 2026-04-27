import { objectify } from "./simplifyData";
import { StackLine } from "./types/StackLine";

describe("objectify", () => {
  test("should handle primitive values", () => {
    expect(objectify(42)).toEqual({ val: 42 });
    expect(objectify("test")).toEqual({ val: "test" });
    expect(objectify(true)).toEqual({ val: true });
    expect(objectify(null)).toEqual({ val: null });
    expect(objectify(undefined)).toEqual({ val: undefined });
  });

  test("should handle simple objects", () => {
    const input = { key1: "value1", key2: 2 };
    const expected = { key1: "value1", key2: 2 };
    expect(objectify(input)).toEqual(expected);
  });

  test("should handle nested objects up to the depth limit", () => {
    const input = { nested: { key: "value" } };
    const expected = { nested: { summary: "[Object]" } };
    expect(objectify(input, 1)).toEqual(expected);
    expect(objectify(input, 2)).not.toEqual(expected);
  });

  test("should handle errors and extract properties", () => {
    const error = new Error("Test error");
    const result = objectify(error);

    expect(result).toHaveProperty("message", "Test error");
    expect(result).toHaveProperty("name", "Error");
    expect(result).toHaveProperty("stack"); // Stack should exist
    expect(Array.isArray(result.stack)).toBe(true); // Ensure it's an array

    const resultStack = result.stack as StackLine[];
    expect(resultStack[0]).toHaveProperty("text"); // Ensure parsed objects
    expect(resultStack[0]).toHaveProperty("filePath");
    expect(resultStack[0]).toHaveProperty("line");
    expect(resultStack[0]).toHaveProperty("location");
  });

  test("should filter compiler stack trace lines", () => {
    const stack = `Error: Test error
    at Module._compile (internal/modules/cjs/loader.js)
    at someOtherFunction (/user/code/index.js:10:5)
    at node:internal/something.js`;

    const error = new Error("Test error");
    error.stack = stack;

    const result = objectify(error) as Record<string, unknown>;
    const filteredStack = result.stack as any[];

    const expectedArray = [
      {
        text: "Error: Test error",
        filePath: undefined,
        line: undefined,
        location: undefined,
      },
      {
        text: "at Module._compile (internal/modules/cjs/loader.js)",
        filePath: "internal/modules/cjs/loader.js",
        line: undefined,
        location: undefined,
      },
      {
        text: "at someOtherFunction (/user/code/index.js:10:5)",
        filePath: "/user/code/index.js",
        line: 10,
        location: 5,
      },
    ];

    expect(filteredStack).toEqual(expectedArray);
  });

  test("should stop filtering stack trace after the first clean line", () => {
    const stack = `Error: Test error
    at node:internal/somethingElse.js
    at Module._compile (internal/modules/cjs/loader.js)
    at someOtherFunction (/user/code/index.js:10:5)
    at anotherFunction (/user/code/index.js:20:5)
    at node:internal/something.js`;

    const error = new Error("Test error");
    error.stack = stack;

    const result = objectify(error) as Record<string, unknown>;
    const filteredStack = result.stack as any[];

    const expectedArray = [
      {
        text: "Error: Test error",
        filePath: undefined,
        line: undefined,
        location: undefined,
      },
      {
        text: "at node:internal/somethingElse.js",
        filePath: "node:internal/somethingElse.js",
        line: undefined,
        location: undefined,
      },
      {
        text: "at Module._compile (internal/modules/cjs/loader.js)",
        filePath: "internal/modules/cjs/loader.js",
        line: undefined,
        location: undefined,
      },
      {
        text: "at someOtherFunction (/user/code/index.js:10:5)",
        filePath: "/user/code/index.js",
        line: 10,
        location: 5,
      },
      {
        text: "at anotherFunction (/user/code/index.js:20:5)",
        filePath: "/user/code/index.js",
        line: 20,
        location: 5,
      },
    ];

    expect(filteredStack).toEqual(expectedArray);
  });

  test("should handle unexpected inputs gracefully", () => {
    const invalidInput = Object.create(null); // Object with no prototype
    const result = objectify(invalidInput);
    expect(result).toEqual({});
  });

  test("should handle nested errors up to the depth limit", () => {
    const nestedError = new Error("Nested error");
    const mainError = new Error("Main error");
    (mainError as any).nested = nestedError;

    const result = objectify(mainError, 1);
    expect(result).toHaveProperty("nested");
    expect(result.nested).toEqual({ summary: "[Error]" });
  });
});
