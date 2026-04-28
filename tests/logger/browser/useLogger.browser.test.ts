// @vitest-environment happy-dom

import { describe, it, expect, vi, beforeEach } from "vitest";
import { useLogger } from "../../../src/logger/useLogger";
import type { LogEntry } from "../../../src/logger/types";

/**
 * In happy-dom, `globalThis.window` is defined, so `useLogger` picks
 * BrowserTransport automatically. These tests verify that the full
 * logger pipeline works end-to-end in a browser context.
 */
describe("useLogger — browser (happy-dom)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("routes log entries through console (not stdout) in a browser environment", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const log = useLogger();
    log.info("hello browser");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("does not write to process.stdout in a browser environment", () => {
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

  it("callbacks still fire in browser environment", () => {
    vi.spyOn(console, "info").mockImplementation(() => {});
    const cb = vi.fn();
    const log = useLogger({ callbackFunctions: [cb] });
    log.info("cb test");
    expect(cb).toHaveBeenCalledTimes(1);
    const entry = cb.mock.calls[0]![0] as LogEntry;
    expect(entry.level).toBe("info");
    expect(entry.message).toBe("cb test");
  });

  it('environment: "server" blocks logging in browser', () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const log = useLogger({ environment: "server" });
    log.info("should be blocked");
    expect(spy).not.toHaveBeenCalled();
  });

  it('environment: "device" passes in browser', () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const log = useLogger({ environment: "device" });
    log.info("should pass");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("specialize() context stacking works in browser", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const cb = vi.fn();
    const root = useLogger({ where: "app", callbackFunctions: [cb] });
    const child = root.specialize({ where: "auth" });
    child.info("msg");
    const entry = cb.mock.calls[0]![0] as LogEntry;
    expect(entry.where).toBe("app.auth");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("minLevel filtering works in browser", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "debug").mockImplementation(() => {});
    const log = useLogger({ minLevel: "warn" });
    log.debug("blocked");
    log.info("blocked");
    log.warn("ok");
    // only warn reached console — but warn spy not set here, check info is silent
    expect(spy).not.toHaveBeenCalled();
  });
});
