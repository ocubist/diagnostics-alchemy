import { describe, it, expect, vi, afterEach } from "vitest";
import {
  isServerEnvironment,
  isBrowserEnvironment,
  checkEnvironmentRestriction,
  checkRuntimeRestriction,
  isLevelEnabled,
} from "../../src/logger/restrictions";

describe("isServerEnvironment / isBrowserEnvironment", () => {
  it("returns true for server in Node (no window in test env)", () => {
    // vitest runs in Node — globalThis.window is undefined
    expect(isServerEnvironment()).toBe(true);
    expect(isBrowserEnvironment()).toBe(false);
  });
});

describe("checkEnvironmentRestriction", () => {
  it('"all" always passes', () => {
    expect(checkEnvironmentRestriction("all")).toBe(true);
  });

  it('"server" passes in Node (no window)', () => {
    expect(checkEnvironmentRestriction("server")).toBe(true);
  });

  it('"device" fails in Node (no window)', () => {
    expect(checkEnvironmentRestriction("device")).toBe(false);
  });
});

describe("checkRuntimeRestriction", () => {
  const originalEnv = process.env["NODE_ENV"];
  afterEach(() => {
    process.env["NODE_ENV"] = originalEnv;
  });

  it('"all" always passes', () => {
    expect(checkRuntimeRestriction("all")).toBe(true);
  });

  it('"development" passes when NODE_ENV is "development"', () => {
    process.env["NODE_ENV"] = "development";
    expect(checkRuntimeRestriction("development")).toBe(true);
  });

  it('"development" fails when NODE_ENV is "production"', () => {
    process.env["NODE_ENV"] = "production";
    expect(checkRuntimeRestriction("development")).toBe(false);
  });

  it('"production" passes when NODE_ENV is "production"', () => {
    process.env["NODE_ENV"] = "production";
    expect(checkRuntimeRestriction("production")).toBe(true);
  });

  it('"production" fails when NODE_ENV is "development"', () => {
    process.env["NODE_ENV"] = "development";
    expect(checkRuntimeRestriction("production")).toBe(false);
  });
});

describe("isLevelEnabled", () => {
  it("allows equal level", () => {
    expect(isLevelEnabled("warn", "warn")).toBe(true);
  });

  it("allows higher level", () => {
    expect(isLevelEnabled("error", "warn")).toBe(true);
    expect(isLevelEnabled("fatal", "debug")).toBe(true);
  });

  it("blocks lower level", () => {
    expect(isLevelEnabled("debug", "info")).toBe(false);
    expect(isLevelEnabled("info", "error")).toBe(false);
  });
});
