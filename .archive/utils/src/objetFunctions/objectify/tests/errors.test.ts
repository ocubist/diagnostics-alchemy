// errors.test.ts: Tests for simplifyData function - Errors

import { simplifyData } from "../simplifyData";

describe("simplifyData - Errors", () => {
  it("should handle error objects and extract properties", () => {
    const error = new Error("Test error");

    const result = simplifyData(error);

    expect(result).toEqual(
      expect.objectContaining({
        message: "Test error",
        name: "Error",
        stack: expect.any(Array), // Stack should be parsed into an array
      })
    );
  });

  it("should filter compiler stack trace lines", () => {
    const stack = `Error: Test error\n    at Module._compile (internal/modules/cjs/loader.js)\n    at userFunction (/user/code/index.js:10:5)\n    at node:internal/something.js`;

    const error = new Error("Test error");
    error.stack = stack;

    const result = simplifyData(error);
    const filteredStack = result.stack as any[];

    expect(filteredStack).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          text: "at userFunction (/user/code/index.js:10:5)",
          filePath: "/user/code/index.js",
          line: 10,
          location: 5,
        }),
      ])
    );
  });

  it("should stop filtering stack trace after the first clean line", () => {
    const stack = `Error: Test error\n    at node:internal/somethingElse.js\n    at Module._compile (internal/modules/cjs/loader.js)\n    at userFunction (/user/code/index.js:10:5)\n    at anotherFunction (/user/code/index.js:20:5)\n    at node:internal/something.js`;

    const error = new Error("Test error");
    error.stack = stack;

    const result = simplifyData(error);
    const filteredStack = result.stack as any[];

    expect(filteredStack).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          text: "at userFunction (/user/code/index.js:10:5)",
          filePath: "/user/code/index.js",
          line: 10,
          location: 5,
        }),
        expect.objectContaining({
          text: "at anotherFunction (/user/code/index.js:20:5)",
          filePath: "/user/code/index.js",
          line: 20,
          location: 5,
        }),
      ])
    );
  });

  it("should handle nested errors up to the depth limit", () => {
    const nestedError = new Error("Nested error");
    const mainError = new Error("Main error");
    (mainError as any).nested = nestedError;

    const result = simplifyData(mainError, 1);

    expect(result).toEqual(
      expect.objectContaining({
        message: "Main error",
        nested: expect.objectContaining({
          summary: "[Error]", // Summarized due to depth limit
        }),
      })
    );
  });
});
