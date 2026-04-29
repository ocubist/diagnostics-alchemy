import { describe, it, expect, vi, beforeEach } from "vitest";
import { Logger } from "../../src/logger/Logger";
import type { LogEntry, LoggerOptions } from "../../src/logger/types";
import type { Transport } from "../../src/logger/transports/types";

// Minimal in-memory transport for testing
const makeTransport = (): Transport & { entries: LogEntry[] } => {
  const entries: LogEntry[] = [];
  return {
    entries,
    write(entry) {
      entries.push(entry);
    },
    flushSync() {},
    destroy() {},
  };
};

const makeLogger = (
  options: LoggerOptions = {},
  transport = makeTransport()
): { logger: Logger; transport: ReturnType<typeof makeTransport> } => ({
  logger: new Logger(options, transport),
  transport,
});

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

describe("Logger — specialize()", () => {
  it("inherits parent where and appends child where", () => {
    const transport = makeTransport();
    const parent = new Logger({ where: "app" }, transport);
    const child = parent.specialize({ where: "auth" });
    child.info("msg");
    expect(transport.entries[0]!.where).toBe("app.auth");
  });

  it("further specialize chains correctly", () => {
    const transport = makeTransport();
    const root = new Logger({ where: "api" }, transport);
    const mid = root.specialize({ where: "users" });
    const leaf = mid.specialize({ where: "list" });
    leaf.info("msg");
    expect(transport.entries[0]!.where).toBe("api.users.list");
  });

  it("parent and child share the same transport instance", () => {
    const transport = makeTransport();
    const parent = new Logger({}, transport);
    const child = parent.specialize({ where: "child" });
    parent.info("from parent");
    child.info("from child");
    expect(transport.entries).toHaveLength(2);
  });

  it("child inherits parent callbacks and can add more", () => {
    const parentCb = vi.fn();
    const childCb = vi.fn();
    const transport = makeTransport();
    const parent = new Logger({ callbackFunctions: [parentCb] }, transport);
    const child = parent.specialize({ callbackFunctions: [childCb] });
    child.info("msg");
    expect(parentCb).toHaveBeenCalledTimes(1);
    expect(childCb).toHaveBeenCalledTimes(1);
  });

  it("child overrides minLevel", () => {
    const transport = makeTransport();
    const parent = new Logger({ minLevel: "warn" }, transport);
    const child = parent.specialize({ minLevel: "debug" });
    child.debug("should appear");
    expect(transport.entries).toHaveLength(1);
  });
});

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

describe("Logger — runtime environment restrictions", () => {
  const originalEnv = process.env["NODE_ENV"];
  beforeEach(() => {
    process.env["NODE_ENV"] = "development";
  });
  afterEach(() => {
    process.env["NODE_ENV"] = originalEnv;
  });

  it('"development" passes when NODE_ENV is "development"', () => {
    const { logger, transport } = makeLogger({ runtimeEnvironment: "development" });
    logger.info("msg");
    expect(transport.entries).toHaveLength(1);
  });

  it('"production" blocks when NODE_ENV is "development"', () => {
    const { logger, transport } = makeLogger({ runtimeEnvironment: "production" });
    logger.info("msg");
    expect(transport.entries).toHaveLength(0);
  });
});

describe("Logger — callbacks", () => {
  it("calls every registered callback with the log entry", () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    const { logger } = makeLogger({ callbackFunctions: [cb1, cb2] });
    logger.warn("event");
    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb2).toHaveBeenCalledTimes(1);
    const entry = cb1.mock.calls[0]![0] as LogEntry;
    expect(entry.level).toBe("warn");
    expect(entry.message).toBe("event");
  });

  it("callback receives full entry including where/why/payload", () => {
    const cb = vi.fn();
    const { logger } = makeLogger({
      where: "app",
      callbackFunctions: [cb],
    });
    logger.error("fail", { where: "handler", payload: { code: 500 } });
    const entry = cb.mock.calls[0]![0] as LogEntry;
    expect(entry.where).toBe("app.handler");
    expect(entry.payload).toEqual({ code: 500 });
  });

  it("does not call callbacks for suppressed (filtered) entries", () => {
    const cb = vi.fn();
    const { logger } = makeLogger({ minLevel: "error", callbackFunctions: [cb] });
    logger.debug("suppressed");
    logger.info("suppressed");
    expect(cb).not.toHaveBeenCalled();
  });
});
