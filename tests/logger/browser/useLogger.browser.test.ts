// @vitest-environment happy-dom

import { describe, it, expect, vi, beforeEach } from "vitest";
import { useLogger } from "../../../src/logger/useLogger.browser";
import type { LogEntry } from "../../../src/logger/types";

/**
 * Tests the browser entry point of useLogger.
 * Runs under happy-dom so console spies work as expected.
 */
describe("useLogger — browser (happy-dom)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("routes log entries through console (not stdout)", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const log = useLogger();
    log.info("hello browser");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("does not write to process.stdout", () => {
    const stdoutSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const log = useLogger();
    log.info("should go to console only");
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(stdoutSpy).not.toHaveBeenCalled();
  });

  it("all five log levels route to the correct console method", () => {
    const debug = vi.spyOn(console, "debug").mockImplementation(() => {});
    const info  = vi.spyOn(console, "info").mockImplementation(() => {});
    const warn  = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const log = useLogger({ minLevel: "debug" });
    log.debug("d");
    log.info("i");
    log.warn("w");
    log.error("e");
    log.fatal("f");

    expect(debug).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(2); // error + fatal both go to console.error
  });

  it("where/why context appears in the console output string", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const log = useLogger({ where: "app" });
    log.warn("something", { where: "auth", why: "session" });
    const firstArg = spy.mock.calls[0]![0] as string;
    expect(firstArg).toContain("[app.auth]");
    expect(firstArg).toContain("(session)");
  });

  it("callbacks still fire", () => {
    vi.spyOn(console, "info").mockImplementation(() => {});
    const cb = vi.fn();
    const log = useLogger({ callbackFunctions: [cb] });
    log.info("cb test");
    expect(cb).toHaveBeenCalledTimes(1);
    const entry = cb.mock.calls[0]![0] as LogEntry;
    expect(entry.level).toBe("info");
    expect(entry.message).toBe("cb test");
  });

  it("specialize() context stacking works", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const cb = vi.fn();
    const root = useLogger({ where: "app", callbackFunctions: [cb] });
    const child = root.specialize({ where: "auth" });
    child.info("msg");
    const entry = cb.mock.calls[0]![0] as LogEntry;
    expect(entry.where).toBe("app.auth");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("minLevel filtering works", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "debug").mockImplementation(() => {});
    const log = useLogger({ minLevel: "warn" });
    log.debug("blocked");
    log.info("blocked");
    log.warn("ok");
    expect(spy).not.toHaveBeenCalled();
  });
});
