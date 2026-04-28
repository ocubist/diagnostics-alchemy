import { describe, it, expect } from "vitest";
import { escapeIdentifierPart } from "../../../src/errors/utility/escapeIdentifierPart";
import { popTraceStack } from "../../../src/errors/utility/popTraceStack";
import { createIdentifier } from "../../../src/errors/utility/createIdentifier";

describe("escapeIdentifierPart", () => {
  it("replaces forward-slashes with double underscore", () => {
    expect(escapeIdentifierPart("a/b/c")).toBe("a__b__c");
  });

  it("trims surrounding whitespace", () => {
    expect(escapeIdentifierPart("  hello  ")).toBe("hello");
  });

  it("handles strings with no slashes", () => {
    expect(escapeIdentifierPart("AuthService")).toBe("AuthService");
  });

  it("handles multiple consecutive slashes", () => {
    expect(escapeIdentifierPart("a//b")).toBe("a____b");
  });

  it("handles empty string (after trim)", () => {
    expect(escapeIdentifierPart("   ")).toBe("");
  });
});

describe("popTraceStack", () => {
  it("removes the specified number of stack frames", () => {
    const err = new Error("test");
    // Ensure stack has multiple frames
    if (err.stack) {
      const framesBefore = err.stack.split("\n").length;
      if (framesBefore > 2) {
        popTraceStack(err, 1);
        const framesAfter = err.stack.split("\n").length;
        expect(framesAfter).toBe(framesBefore - 1);
      }
    }
  });

  it("does nothing when stack is undefined", () => {
    const err = new Error("no stack");
    err.stack = undefined;
    expect(() => popTraceStack(err, 2)).not.toThrow();
  });

  it("leaves only the headline if popping more frames than exist", () => {
    const err = new Error("test");
    err.stack = "Error: test\n    at a\n    at b";
    popTraceStack(err, 100);
    expect(err.stack).toBe("Error: test");
  });
});

describe("createIdentifier", () => {
  it("builds full identifier with all parts", () => {
    const id = createIdentifier({
      name: "MyError",
      module: "auth",
      context: "login",
      errorCode: "VALIDATION_ERROR",
    });
    expect(id).toBe("MyError/auth/login/VALIDATION_ERROR");
  });

  it("uses defaults for missing module and context", () => {
    const id = createIdentifier({ name: "MyError" });
    expect(id).toBe("MyError/unknown_module/unknown_context/UNKNOWN_ERROR");
  });

  it("escapes slashes in parts", () => {
    const id = createIdentifier({
      name: "My/Error",
      module: "a/b",
      context: "x",
      errorCode: "UNKNOWN_ERROR",
    });
    expect(id).toBe("My__Error/a__b/x/UNKNOWN_ERROR");
  });
});
