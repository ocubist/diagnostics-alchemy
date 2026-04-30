import { describe, it, expect } from "vitest";
import { formatEntry } from "../../../src/logger/formatters/formatEntry";
import type { LogEntry } from "../../../src/logger/types";

const base: LogEntry = {
  level: "info",
  time: new Date("2026-04-29T23:58:08.000Z").getTime(),
  message: "hello",
};

describe("formatEntry — timestamp", () => {
  it("formats as YYYY-MM-DD HH:mm:ss in UTC by default", () => {
    const out = formatEntry(base);
    expect(out).toContain("2026-04-29 23:58:08");
  });

  it("does not contain the raw ISO T/Z markers", () => {
    const out = formatEntry(base);
    expect(out).not.toMatch(/T\d{2}:\d{2}:\d{2}/); // no T separator
    expect(out).not.toContain(".000Z");             // no milliseconds + Z
  });

  it("respects a non-UTC IANA timezone", () => {
    // UTC+2 → 2026-04-30 01:58:08
    const out = formatEntry(base, "Europe/Berlin");
    expect(out).toContain("2026-04-30 01:58:08");
  });

  it("UTC+0 and explicit UTC produce the same result", () => {
    expect(formatEntry(base)).toBe(formatEntry(base, "UTC"));
  });
});

describe("formatEntry — structure", () => {
  it("includes level", () => {
    expect(formatEntry(base)).toContain("INFO");
  });

  it("includes message", () => {
    expect(formatEntry(base)).toContain("hello");
  });

  it("includes where when present", () => {
    const out = formatEntry({ ...base, where: "app.auth" });
    expect(out).toContain("[app.auth]");
  });

  it("includes why when present", () => {
    const out = formatEntry({ ...base, why: "login" });
    expect(out).toContain("(login)");
  });

  it("includes payload as indented JSON", () => {
    const out = formatEntry({ ...base, payload: { key: "val" } });
    expect(out).toContain('"key": "val"');
  });

  it("omits payload block when payload is empty object", () => {
    const out = formatEntry({ ...base, payload: {} });
    expect(out).not.toContain("{");
  });
});
