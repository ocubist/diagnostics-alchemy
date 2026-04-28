import { describe, it, expect, vi } from "vitest";
import { useLogger } from "../../src/logger/useLogger";
import type { LogEntry } from "../../src/logger/types";

describe("useLogger", () => {
  it("creates a Logger that emits entries via callbacks", () => {
    const cb = vi.fn();
    const log = useLogger({ callbackFunctions: [cb] });
    log.info("test message");
    expect(cb).toHaveBeenCalledTimes(1);
    const entry = cb.mock.calls[0]![0] as LogEntry;
    expect(entry.level).toBe("info");
    expect(entry.message).toBe("test message");
  });

  it("default options work without errors (no crash on empty options)", () => {
    const log = useLogger();
    expect(() => log.debug("silent")).not.toThrow();
  });

  it("specialize works on a useLogger-created instance", () => {
    const cb = vi.fn();
    const log = useLogger({ where: "root", callbackFunctions: [cb] });
    const child = log.specialize({ where: "child" });
    child.info("msg");
    const entry = cb.mock.calls[0]![0] as LogEntry;
    expect(entry.where).toBe("root.child");
  });

  it("respects minLevel", () => {
    const cb = vi.fn();
    const log = useLogger({ minLevel: "error", callbackFunctions: [cb] });
    log.debug("blocked");
    log.info("blocked");
    log.warn("blocked");
    log.error("visible");
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
