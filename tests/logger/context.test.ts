import { describe, it, expect } from "vitest";
import { buildContextPath } from "../../src/logger/context";

describe("buildContextPath", () => {
  it("returns undefined when both parent and child are undefined", () => {
    expect(buildContextPath(undefined, undefined)).toBeUndefined();
  });

  it("returns child alone when parent is undefined", () => {
    expect(buildContextPath(undefined, "auth")).toBe("auth");
  });

  it("returns parent alone when child is undefined", () => {
    expect(buildContextPath("app", undefined)).toBe("app");
  });

  it("joins parent and child with a dot", () => {
    expect(buildContextPath("app", "auth")).toBe("app.auth");
  });

  it("appends to an existing dot path", () => {
    expect(buildContextPath("app.auth", "login")).toBe("app.auth.login");
  });

  it("sanitizes dots inside a child segment (replaces with underscore)", () => {
    // Dots are reserved as separators; any dot in a raw segment is converted to _
    expect(buildContextPath("app", "user.service")).toBe("app.user_service");
  });

  it("trims whitespace from child", () => {
    expect(buildContextPath("app", "  auth  ")).toBe("app.auth");
  });

  it("ignores whitespace-only child (treats as undefined)", () => {
    expect(buildContextPath("app", "   ")).toBe("app");
  });

  it("ignores whitespace-only parent (treats as undefined)", () => {
    expect(buildContextPath("   ", "auth")).toBe("auth");
  });

  it("three levels of nesting work correctly", () => {
    const l1 = buildContextPath(undefined, "app");
    const l2 = buildContextPath(l1, "auth");
    const l3 = buildContextPath(l2, "login");
    expect(l3).toBe("app.auth.login");
  });
});
