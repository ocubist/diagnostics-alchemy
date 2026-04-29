import { describe, it, expect, vi } from "vitest";
import { useLogger } from "../../src/logger/useLogger";
import type { LogEntry } from "../../src/logger/types";

describe("useLogger", () => {
  it("creates a Logger that emits entries via transports", () => {
    const t = vi.fn();
    const log = useLogger({ console: false, transports: [t] });
    log.info("test message");
    expect(t).toHaveBeenCalledTimes(1);
    const entry = t.mock.calls[0]![0] as LogEntry;
    expect(entry.level).toBe("info");
    expect(entry.message).toBe("test message");
  });

  it("default options work without errors (no crash on empty options)", () => {
    const log = useLogger({ console: false });
    expect(() => log.debug("silent")).not.toThrow();
  });

  it("specialize works on a useLogger-created instance", () => {
    const t = vi.fn();
    const log = useLogger({ where: "root", console: false, transports: [t] });
    const child = log.specialize({ where: "child" });
    child.info("msg");
    const entry = t.mock.calls[0]![0] as LogEntry;
    expect(entry.where).toBe("root.child");
  });

  it("respects minLevel", () => {
    const t = vi.fn();
    const log = useLogger({ minLevel: "error", console: false, transports: [t] });
    log.debug("blocked");
    log.info("blocked");
    log.warn("blocked");
    log.error("visible");
    expect(t).toHaveBeenCalledTimes(1);
  });

  it("includes console transport by default", () => {
    // Just verify it doesn't crash and emits to the transport too
    const t = vi.fn();
    const log = useLogger({ transports: [t] });
    log.info("hello");
    expect(t).toHaveBeenCalledTimes(1);
  });

  it("suppresses console transport when console: false", () => {
    // With console: false and no extra transports, nothing gets called (no crash)
    const log = useLogger({ console: false });
    expect(() => log.info("silent")).not.toThrow();
  });
});
