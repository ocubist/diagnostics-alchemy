import { describe, it, expect, vi } from "vitest";
import { useLogger } from "../../src/logger/useLogger";
import type { LogEntry } from "../../src/logger/types";

describe("useLogger", () => {
  it("creates a Logger that emits entries via transports", () => {
    const t = vi.fn();
    const log = useLogger({ console: { enableTransport: false }, transports: [{ write: t }] });
    log.info("test message");
    expect(t).toHaveBeenCalledTimes(1);
    const entry = t.mock.calls[0]![0] as LogEntry;
    expect(entry.level).toBe("info");
    expect(entry.message).toBe("test message");
  });

  it("default options work without errors (no crash on empty options)", () => {
    const log = useLogger({ console: { enableTransport: false } });
    expect(() => log.debug("silent")).not.toThrow();
  });

  it("specialize works on a useLogger-created instance", () => {
    const t = vi.fn();
    const log = useLogger({ where: "root", console: { enableTransport: false }, transports: [{ write: t }] });
    const child = log.specialize({ where: "child" });
    child.info("msg");
    const entry = t.mock.calls[0]![0] as LogEntry;
    expect(entry.where).toBe("root.child");
  });

  it("console transport minLevel filters correctly", () => {
    const t = vi.fn();
    const log = useLogger({
      console: { enableTransport: false },
      transports: [{ write: t, minLevel: "error" }],
    });
    log.debug("blocked");
    log.info("blocked");
    log.warn("blocked");
    log.error("visible");
    expect(t).toHaveBeenCalledTimes(1);
  });

  it("includes console transport by default", () => {
    const t = vi.fn();
    const log = useLogger({ transports: [{ write: t }] });
    log.info("hello");
    expect(t).toHaveBeenCalledTimes(1);
  });

  it("suppresses console transport when enableTransport: false", () => {
    const log = useLogger({ console: { enableTransport: false } });
    expect(() => log.info("silent")).not.toThrow();
  });

  it("console minLevel is independent from extra transport minLevel", () => {
    const t = vi.fn();
    const log = useLogger({
      console: { enableTransport: false },
      transports: [{ write: t, minLevel: "warn" }],
    });
    log.debug("skipped by transport");
    log.warn("reached transport");
    expect(t).toHaveBeenCalledTimes(1);
    const entry = t.mock.calls[0]![0] as LogEntry;
    expect(entry.level).toBe("warn");
  });
});
