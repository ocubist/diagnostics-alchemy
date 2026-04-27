// delay.test.ts

import { delay } from "./delay";

describe("delay function", () => {
  it("should resolve after the specified time", async () => {
    const start = Date.now();
    const duration = 1000; // 1 second

    await delay(duration);

    const end = Date.now();
    const elapsed = end - start;

    // Allow a small margin of error due to the nature of timing in tests
    expect(elapsed).toBeGreaterThanOrEqual(duration);
    expect(elapsed).toBeLessThan(duration + 50);
  });

  it("should return a promise", () => {
    const result = delay(1000);
    expect(result).toBeInstanceOf(Promise);
  });

  it("should handle zero delay", async () => {
    const start = Date.now();
    await delay(0);
    const end = Date.now();

    expect(end - start).toBeLessThan(50); // Allow a small margin for execution time
  });

  it("should handle negative delay", async () => {
    const start = Date.now();
    await delay(-100);
    const end = Date.now();

    expect(end - start).toBeLessThan(50); // Allow a small margin for execution time
  });
});
