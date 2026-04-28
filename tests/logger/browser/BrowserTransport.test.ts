// @vitest-environment happy-dom

import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserTransport } from "../../../src/logger/transports/BrowserTransport";
import type { LogEntry } from "../../../src/logger/types";

const makeEntry = (overrides: Partial<LogEntry> = {}): LogEntry => ({
  level: "info",
  time: Date.now(),
  message: "test message",
  ...overrides,
});

describe("BrowserTransport (happy-dom)", () => {
  const transport = new BrowserTransport();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // ─── Correct console method per level ────────────────────────────────────────

  it("calls console.debug for debug level", () => {
    const spy = vi.spyOn(console, "debug").mockImplementation(() => {});
    transport.write(makeEntry({ level: "debug" }), "stdOut");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("calls console.info for info level", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    transport.write(makeEntry({ level: "info" }), "stdOut");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("calls console.warn for warn level", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    transport.write(makeEntry({ level: "warn" }), "stdOut");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("calls console.error for error level", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    transport.write(makeEntry({ level: "error" }), "stdOut");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("calls console.error for fatal level (fatal routes to console.error)", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    transport.write(makeEntry({ level: "fatal" }), "stdOut");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  // ─── %c formatting ────────────────────────────────────────────────────────────

  it("first argument contains %c directives", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    transport.write(makeEntry(), "stdOut");
    const firstArg = spy.mock.calls[0]![0] as string;
    expect(firstArg).toContain("%c");
  });

  it("level label appears in the format string (uppercased)", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    transport.write(makeEntry({ level: "warn" }), "stdOut");
    const firstArg = spy.mock.calls[0]![0] as string;
    expect(firstArg).toContain("WARN");
  });

  it("message appears in the format string", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    transport.write(makeEntry({ message: "hello world" }), "stdOut");
    const firstArg = spy.mock.calls[0]![0] as string;
    expect(firstArg).toContain("hello world");
  });

  it("second argument is the CSS style string for the level", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    transport.write(makeEntry({ level: "info" }), "stdOut");
    const cssArg = spy.mock.calls[0]![1] as string;
    expect(typeof cssArg).toBe("string");
    expect(cssArg.length).toBeGreaterThan(0);
  });

  // ─── Context (where / why) ────────────────────────────────────────────────────

  it("includes where context in the format string", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    transport.write(makeEntry({ where: "app.auth" }), "stdOut");
    const firstArg = spy.mock.calls[0]![0] as string;
    expect(firstArg).toContain("[app.auth]");
  });

  it("includes why context in the format string", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    transport.write(makeEntry({ why: "user-login" }), "stdOut");
    const firstArg = spy.mock.calls[0]![0] as string;
    expect(firstArg).toContain("(user-login)");
  });

  it("includes both where and why when both are set", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    transport.write(makeEntry({ where: "app.auth", why: "session" }), "stdOut");
    const firstArg = spy.mock.calls[0]![0] as string;
    expect(firstArg).toContain("[app.auth]");
    expect(firstArg).toContain("(session)");
  });

  it("omits context brackets when where and why are both absent", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    transport.write(makeEntry({ where: undefined, why: undefined }), "stdOut");
    const firstArg = spy.mock.calls[0]![0] as string;
    expect(firstArg).not.toContain("[");
    expect(firstArg).not.toContain("(");
  });

  // ─── Payload ──────────────────────────────────────────────────────────────────

  it("passes payload as extra argument when present", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const payload = { userId: "u1", code: 42 };
    transport.write(makeEntry({ payload }), "stdOut");
    const args = spy.mock.calls[0]!;
    // args: [formatStr, cssStyle, "", payload]
    expect(args).toContain(payload);
  });

  it("does not pass payload argument when payload is undefined", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    transport.write(makeEntry({ payload: undefined }), "stdOut");
    const args = spy.mock.calls[0]!;
    // args: [formatStr, cssStyle, ""] — no 4th element
    expect(args).toHaveLength(3);
  });

  it("does not pass payload argument when payload is an empty object", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    transport.write(makeEntry({ payload: {} }), "stdOut");
    const args = spy.mock.calls[0]!;
    expect(args).toHaveLength(3);
  });

  // ─── flushSync is a no-op ─────────────────────────────────────────────────────

  it("flushSync does not throw", () => {
    expect(() => transport.flushSync()).not.toThrow();
  });
});
