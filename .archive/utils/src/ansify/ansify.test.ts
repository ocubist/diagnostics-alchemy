// ansify.test.ts
import { ansiInitializationPromise, ansify } from "./ansify";

// Mock supports-color module
jest.mock(
  "supports-color",
  () => ({
    stdout: {
      level: 2,
    },
  }),
  { virtual: true }
);

// Mock the isDevelopment function to always return false
jest.mock("../nodeDetector/isDevelopment", () => ({
  isDevelopment: () => false,
}));

describe("ansify", () => {
  beforeEach(async () => {
    jest.resetModules();
    await ansiInitializationPromise; // Ensure the async initialization is complete
  });

  it("should add ansi-color-coding", async () => {
    // Assume supports-color is available and colors are enabled
    ansify.enabled = true;
    const str = "test";
    expect(ansify.bgBlack(str)).not.toBe(str);
  });

  it("should not use ansi-color-codes, when coloring is not enabled", async () => {
    // Manually disable ansi colors for this test
    ansify.enabled = false;
    const str = "test";
    expect(ansify.bgBlack(str)).toBe(str);
  });
});
