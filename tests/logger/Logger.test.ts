import { describe, it, expect, vi } from "vitest";
import { Logger } from "../../src/logger/Logger";
import type { LogEntry, LoggerOptions, Transport } from "../../src/logger/types";

// ─── Test helpers ─────────────────────────────────────────────────────────────

/** Creates an in-memory transport and the entries array it collects into. */
const makeTransport = (): { fn: Transport; entries: LogEntry[] } => {
  const entries: LogEntry[] = [];
  return { entries, fn: (entry) => { entries.push(entry); } };
};

/** Convenience: Logger backed by a single in-memory transport. */
const makeLogger = (
  options: LoggerOptions = {},
  t = makeTransport()
): { logger: Logger; transport: ReturnType<typeof makeTransport> } => ({
  logger: new Logger(options, [t.fn]),
  transport: t,
});

// ─── Basic logging ────────────────────────────────────────────────────────────

describe("Logger — basic logging", () => {
  it("emits an info entry", () => {
    const { logger, transport } = makeLogger();
    logger.info("Hello");
    expect(transport.entries).toHaveLength(1);
    expect(transport.entries[0]!.level).toBe("info");
    expect(transport.entries[0]!.message).toBe("Hello");
  });

  it("all five levels emit entries", () => {
    const { logger, transport } = makeLogger();
    logger.debug("d");
    logger.info("i");
    logger.warn("w");
    logger.error("e");
    logger.fatal("f");
    expect(transport.entries).toHaveLength(5);
    const levels = transport.entries.map((e) => e.level);
    expect(levels).toEqual(["debug", "info", "warn", "error", "fatal"]);
  });

  it("attaches a timestamp close to now", () => {
    const before = Date.now();
    const { logger, transport } = makeLogger();
    logger.info("ts test");
    const after = Date.now();
    expect(transport.entries[0]!.time).toBeGreaterThanOrEqual(before);
    expect(transport.entries[0]!.time).toBeLessThanOrEqual(after);
  });
});

// ─── where / why context ──────────────────────────────────────────────────────

describe("Logger — where / why context", () => {
  it("attaches where from logger options", () => {
    const { logger, transport } = makeLogger({ where: "app" });
    logger.info("msg");
    expect(transport.entries[0]!.where).toBe("app");
  });

  it("merges logger where with call-site where", () => {
    const { logger, transport } = makeLogger({ where: "app" });
    logger.info("msg", { where: "auth" });
    expect(transport.entries[0]!.where).toBe("app.auth");
  });

  it("call-site where only, no logger where", () => {
    const { logger, transport } = makeLogger();
    logger.info("msg", { where: "handler" });
    expect(transport.entries[0]!.where).toBe("handler");
  });

  it("attaches why correctly", () => {
    const { logger, transport } = makeLogger({ why: "boot" });
    logger.info("msg", { why: "init-db" });
    expect(transport.entries[0]!.why).toBe("boot.init-db");
  });

  it("attaches payload", () => {
    const { logger, transport } = makeLogger();
    logger.warn("check", { payload: { userId: "u1", count: 3 } });
    expect(transport.entries[0]!.payload).toEqual({ userId: "u1", count: 3 });
  });
});

// ─── specialize() ─────────────────────────────────────────────────────────────

describe("Logger — specialize()", () => {
  it("inherits parent where and appends child where", () => {
    const t = makeTransport();
    const parent = new Logger({ where: "app" }, [t.fn]);
    const child = parent.specialize({ where: "auth" });
    child.info("msg");
    expect(t.entries[0]!.where).toBe("app.auth");
  });

  it("further specialize chains correctly", () => {
    const t = makeTransport();
    const root = new Logger({ where: "api" }, [t.fn]);
    const mid = root.specialize({ where: "users" });
    const leaf = mid.specialize({ where: "list" });
    leaf.info("msg");
    expect(t.entries[0]!.where).toBe("api.users.list");
  });

  it("parent and child share the same transport", () => {
    const t = makeTransport();
    const parent = new Logger({}, [t.fn]);
    const child = parent.specialize({ where: "child" });
    parent.info("from parent");
    child.info("from child");
    expect(t.entries).toHaveLength(2);
  });

  it("child inherits parent transports and can add more", () => {
    const parentTransport = vi.fn();
    const childTransport = vi.fn();
    const t = makeTransport();
    const parent = new Logger({}, [t.fn, parentTransport]);
    const child = parent.specialize({ transports: [childTransport] });
    child.info("msg");
    expect(parentTransport).toHaveBeenCalledTimes(1);
    expect(childTransport).toHaveBeenCalledTimes(1);
  });

  it("child overrides minLevel", () => {
    const t = makeTransport();
    const parent = new Logger({ minLevel: "warn" }, [t.fn]);
    const child = parent.specialize({ minLevel: "debug" });
    child.debug("should appear");
    expect(t.entries).toHaveLength(1);
  });
});

// ─── minLevel filtering ───────────────────────────────────────────────────────

describe("Logger — minLevel filtering", () => {
  it("blocks levels below minLevel", () => {
    const { logger, transport } = makeLogger({ minLevel: "warn" });
    logger.debug("suppressed");
    logger.info("suppressed");
    logger.warn("visible");
    logger.error("visible");
    expect(transport.entries).toHaveLength(2);
    expect(transport.entries.map((e) => e.level)).toEqual(["warn", "error"]);
  });

  it("allows all levels when minLevel is debug (default)", () => {
    const { logger, transport } = makeLogger();
    logger.debug("d");
    logger.info("i");
    expect(transport.entries).toHaveLength(2);
  });
});

// ─── transports ───────────────────────────────────────────────────────────────

describe("Logger — transports", () => {
  it("calls every registered transport with the log entry", () => {
    const t1 = vi.fn();
    const t2 = vi.fn();
    const { logger } = makeLogger({}, { fn: () => {}, entries: [] });
    // Build a fresh logger with two spy transports
    const logger2 = new Logger({}, [t1, t2]);
    logger2.warn("event");
    expect(t1).toHaveBeenCalledTimes(1);
    expect(t2).toHaveBeenCalledTimes(1);
    const entry = t1.mock.calls[0]![0] as LogEntry;
    expect(entry.level).toBe("warn");
    expect(entry.message).toBe("event");
  });

  it("transport receives full entry including where/why/payload", () => {
    const t = vi.fn();
    const logger = new Logger({ where: "app" }, [t]);
    logger.error("fail", { where: "handler", payload: { code: 500 } });
    const entry = t.mock.calls[0]![0] as LogEntry;
    expect(entry.where).toBe("app.handler");
    expect(entry.payload).toEqual({ code: 500 });
  });

  it("does not call transports for suppressed (filtered) entries", () => {
    const t = vi.fn();
    const logger = new Logger({ minLevel: "error" }, [t]);
    logger.debug("suppressed");
    logger.info("suppressed");
    expect(t).not.toHaveBeenCalled();
  });
});
