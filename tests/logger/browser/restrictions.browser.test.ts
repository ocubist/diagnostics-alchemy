// @vitest-environment happy-dom

import { describe, it, expect } from "vitest";
import {
  isServerEnvironment,
  isBrowserEnvironment,
  checkEnvironmentRestriction,
} from "../../../src/logger/restrictions";

/**
 * These tests run under happy-dom, which injects a real `window` global.
 * Verifies that the environment detection flips correctly in a browser context.
 */
describe("environment detection — browser (happy-dom)", () => {
  it("globalThis.window is defined", () => {
    expect(typeof (globalThis as Record<string, unknown>)["window"]).not.toBe("undefined");
  });

  it("isServerEnvironment() returns false", () => {
    expect(isServerEnvironment()).toBe(false);
  });

  it("isBrowserEnvironment() returns true", () => {
    expect(isBrowserEnvironment()).toBe(true);
  });
});

describe("checkEnvironmentRestriction — browser (happy-dom)", () => {
  it('"all" always passes', () => {
    expect(checkEnvironmentRestriction("all")).toBe(true);
  });

  it('"device" passes in browser', () => {
    expect(checkEnvironmentRestriction("device")).toBe(true);
  });

  it('"server" is blocked in browser', () => {
    expect(checkEnvironmentRestriction("server")).toBe(false);
  });
});
