import { TransmutedError } from "@ocubist/error-alchemy";
import { objectifyError } from "./objectifyError";

describe("objectifyError", () => {
  test("should handle simple Error objects", () => {
    const error = new Error("Simple error");
    const result = objectifyError(error);

    expect(result.name).toBe("Error");
    expect(result.message).toBe("Simple error");
    expect(result.stack).toBeDefined();
  });

  test("should handle TransmutedError with custom properties", () => {
    const transmutedError = new TransmutedError({
      name: "MyError",
      message: "Custom error",
      severity: "catastrophic",
    });

    const result = objectifyError(transmutedError);

    expect(result.name).toBe("MyError");
    expect(result.message).toBe("Custom error");
    expect(result.severity).toBe("catastrophic");
    expect(result.stack).toBeDefined();
  });

  test("should ignore stack trace if ignoreStack option is true", () => {
    const error = new Error("Error with stack");
    const result = objectifyError(error, { ignoreStack: true });

    expect(result.stack).toBe("[omitted]");
  });

  test("should handle circular references gracefully", () => {
    const error1 = new Error("First error");
    const error2 = new Error("Second error");
    // @ts-ignore
    error1.cause = error2;
    // @ts-ignore
    error2.cause = error1; // Circular reference

    const result = objectifyError(error1);

    expect(result.cause.cause).toBe("[Circular]");
  });

  test("should handle maxDepth option correctly", () => {
    const error1 = new Error("First error");
    const error2 = new Error("Second error");
    const error3 = new Error("Third error");
    // @ts-ignore
    error1.cause = error2;
    // @ts-ignore
    error2.cause = error3;

    const result = objectifyError(error1, { maxDepth: 2 });

    expect(result.cause.cause).toBe("[MaxDepthExceeded]");
  });

  test("should ignore functions if ignoreFunctions option is true", () => {
    const error = new TransmutedError({
      name: "FunctionError",
      message: "Error with function",
    });
    // @ts-ignore
    error.someFunction = () => "I am a function";

    const result = objectifyError(error, { ignoreFunctions: true });

    expect(result.someFunction).toBeUndefined();
  });

  test("should remove undefined values if ignoreUndefined option is true", () => {
    const error = new Error("Error with undefined values");
    // @ts-ignore
    error.someUndefined = undefined;

    const result = objectifyError(error, { ignoreUndefined: true });

    expect(result.someUndefined).toBeUndefined();
  });

  test("should correctly calculate and include computed properties (getters)", () => {
    class CustomError extends Error {
      private severity: string;

      constructor(message: string, severity: string) {
        super(message);
        this.severity = severity;
      }

      get severityDescription() {
        return `Severity is ${this.severity}`;
      }
    }

    const error = new CustomError("An error occurred", "high");
    const result = objectifyError(error);

    console.log(result); // Log the result to verify inclusion of computed properties

    // Check that the computed property from the getter is included
    expect(result.severityDescription).toBe("Severity is high");
  });
});
