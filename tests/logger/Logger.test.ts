import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Logger } from "../../src/logger/Logger";
import type { LogEntry, LoggerOptions, Transport } from "../../src/logger/types";

// ─── Test helpers ─────────────────────────────────────────────────────────────

/** Creates an in-memory transport and the entries array it collects into. */
const makeTransport = (minLevel?: Transport["minLevel"]): { transport: Transport; entries: LogEntry[] } => {
  const entries: LogEntry[] = [];
  return { entries, transport: { write: (entry) => { entries.push(entry); }, minLevel } };
};

/** Convenience: Logger backed by a single in-memory transport. */
const makeLogger = (
  options: LoggerOptions = {},
  t = makeTransport()
): { logger: Logger; transport: ReturnType<typeof makeTransport> } => ({
  logger: new Logger(options, [t.transport]),
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
    const parent = new Logger({ where: "app" }, [t.transport]);
    const child = parent.specialize({ where: "auth" });
    child.info("msg");
    expect(t.entries[0]!.where).toBe("app.auth");
  });

  it("further specialize chains correctly", () => {
    const t = makeTransport();
    const root = new Logger({ where: "api" }, [t.transport]);
    const mid = root.specialize({ where: "users" });
    const leaf = mid.specialize({ where: "list" });
    leaf.info("msg");
    expect(t.entries[0]!.where).toBe("api.users.list");
  });

  it("parent and child share the same transport", () => {
    const t = makeTransport();
    const parent = new Logger({}, [t.transport]);
    const child = parent.specialize({ where: "child" });
    parent.info("from parent");
    child.info("from child");
    expect(t.entries).toHaveLength(2);
  });

  it("child inherits parent transports and can add more", () => {
    const extra = vi.fn();
    const t = makeTransport();
    const parent = new Logger({}, [t.transport]);
    const child = parent.specialize({ transports: [{ write: extra }] });
    child.info("msg");
    expect(t.entries).toHaveLength(1);
    expect(extra).toHaveBeenCalledTimes(1);
  });
});

// ─── per-transport minLevel ───────────────────────────────────────────────────

describe("Logger — per-transport minLevel", () => {
  it("transport defaults to debug (receives all levels)", () => {
    const { logger, transport } = makeLogger();
    logger.debug("d");
    logger.info("i");
    expect(transport.entries).toHaveLength(2);
  });

  it("transport with minLevel warn skips debug and info", () => {
    const t = makeTransport("warn");
    const logger = new Logger({}, [t.transport]);
    logger.debug("suppressed");
    logger.info("suppressed");
    logger.warn("visible");
    logger.error("visible");
    expect(t.entries).toHaveLength(2);
    expect(t.entries.map((e) => e.level)).toEqual(["warn", "error"]);
  });

  it("two transports with different minLevels filter independently", () => {
    const tAll = makeTransport("debug");
    const tWarn = makeTransport("warn");
    const logger = new Logger({}, [tAll.transport, tWarn.transport]);
    logger.debug("d");
    logger.info("i");
    logger.warn("w");
    expect(tAll.entries).toHaveLength(3);
    expect(tWarn.entries).toHaveLength(1);
    expect(tWarn.entries[0]!.level).toBe("warn");
  });
});

// ─── transports ───────────────────────────────────────────────────────────────

describe("Logger — transports", () => {
  it("calls every registered transport with the log entry", () => {
    const t1 = vi.fn();
    const t2 = vi.fn();
    const logger = new Logger({}, [{ write: t1 }, { write: t2 }]);
    logger.warn("event");
    expect(t1).toHaveBeenCalledTimes(1);
    expect(t2).toHaveBeenCalledTimes(1);
    const entry = t1.mock.calls[0]![0] as LogEntry;
    expect(entry.level).toBe("warn");
    expect(entry.message).toBe("event");
  });

  it("transport receives full entry including where/why/payload", () => {
    const t = vi.fn();
    const logger = new Logger({ where: "app" }, [{ write: t }]);
    logger.error("fail", { where: "handler", payload: { code: 500 } });
    const entry = t.mock.calls[0]![0] as LogEntry;
    expect(entry.where).toBe("app.handler");
    expect(entry.payload).toEqual({ code: 500 });
  });
});

// ─── plain sub-logger ─────────────────────────────────────────────────────────

describe("Logger — plain", () => {
  let consoleSpy: {
    debug: ReturnType<typeof vi.spyOn>;
    info:  ReturnType<typeof vi.spyOn>;
    warn:  ReturnType<typeof vi.spyOn>;
    error: ReturnType<typeof vi.spyOn>;
  };

  beforeEach(() => {
    consoleSpy = {
      debug: vi.spyOn(console, "debug").mockImplementation(() => {}),
      info:  vi.spyOn(console, "info").mockImplementation(() => {}),
      warn:  vi.spyOn(console, "warn").mockImplementation(() => {}),
      error: vi.spyOn(console, "error").mockImplementation(() => {}),
    };
  });

  afterEach(() => vi.restoreAllMocks());

  it("plain.info prints the raw string", () => {
    const logger = new Logger({}, []);
    logger.plain.info("hello plain");
    expect(consoleSpy.info).toHaveBeenCalledWith("hello plain");
  });

  it("routes each level to the correct console method", () => {
    const logger = new Logger({}, []);
    logger.plain.debug("d");
    logger.plain.info("i");
    logger.plain.warn("w");
    logger.plain.error("e");
    logger.plain.fatal("f");
    expect(consoleSpy.debug).toHaveBeenCalledWith("d");
    expect(consoleSpy.info).toHaveBeenCalledWith("i");
    expect(consoleSpy.warn).toHaveBeenCalledWith("w");
    expect(consoleSpy.error).toHaveBeenCalledTimes(2); // error + fatal both → console.error
  });

  it("always fires — no minLevel filtering", () => {
    // even a transport with minLevel: "fatal" doesn't affect plain
    const t = makeTransport("fatal");
    const logger = new Logger({}, [t.transport]);
    logger.plain.debug("always visible");
    expect(consoleSpy.debug).toHaveBeenCalledWith("always visible");
  });

  it("passes multiline strings through unchanged", () => {
    const logger = new Logger({}, []);
    const msg = "line one\nline two\nline three";
    logger.plain.info(msg);
    expect(consoleSpy.info).toHaveBeenCalledWith(msg);
  });

  it("does not go through transports", () => {
    const t = vi.fn();
    const logger = new Logger({}, [{ write: t }]);
    logger.plain.info("raw");
    expect(t).not.toHaveBeenCalled();
    expect(consoleSpy.info).toHaveBeenCalledWith("raw");
  });

  it("specialize() inherits plain unchanged", () => {
    const t = makeTransport();
    const parent = new Logger({}, [t.transport]);
    const child = parent.specialize({ where: "child" });
    child.plain.warn("msg");
    expect(consoleSpy.warn).toHaveBeenCalledWith("msg");
  });
});
