import { describe, it, expect } from "vitest";
import { TransmutedError } from "../../../src/errors/transmuted-errors/TransmutedError";
import { MysticError } from "../../../src/errors/transmuted-errors/MysticError";
import { SynthesizedError } from "../../../src/errors/transmuted-errors/SynthesizedError";
import { DEFAULT_ERROR_CODE, DEFAULT_SEVERITY } from "../../../src/errors/config/defaultValues";

const makeError = (overrides?: Partial<ConstructorParameters<typeof TransmutedError>[0]>) =>
  new TransmutedError({
    message: "test error",
    name: "TestError",
    ...overrides,
  });

describe("TransmutedError", () => {
  it("is an instance of Error", () => {
    expect(makeError()).toBeInstanceOf(Error);
  });

  it("is an instance of TransmutedError", () => {
    expect(makeError()).toBeInstanceOf(TransmutedError);
  });

  it("sets message correctly", () => {
    const err = makeError({ message: "something went wrong" });
    expect(err.message).toBe("something went wrong");
  });

  it("sets name correctly", () => {
    const err = makeError({ name: "MySpecialError" });
    expect(err.name).toBe("MySpecialError");
  });

  it("applies default severity when not provided", () => {
    expect(makeError().severity).toBe(DEFAULT_SEVERITY);
  });

  it("applies default error code when not provided", () => {
    expect(makeError().errorCode).toBe(DEFAULT_ERROR_CODE);
  });

  it("respects provided severity", () => {
    const err = makeError({ severity: "fatal" });
    expect(err.severity).toBe("fatal");
  });

  it("respects provided errorCode", () => {
    const err = makeError({ errorCode: "VALIDATION_ERROR" });
    expect(err.errorCode).toBe("VALIDATION_ERROR");
  });

  it("falls back to default error code for an invalid errorCode", () => {
    const err = makeError({ errorCode: "NOT_REAL" as never });
    expect(err.errorCode).toBe(DEFAULT_ERROR_CODE);
  });

  it("generates a unique instanceUuid for each instance", () => {
    const a = makeError();
    const b = makeError();
    expect(a.instanceUuid).not.toBe(b.instanceUuid);
    expect(typeof a.instanceUuid).toBe("string");
    expect(a.instanceUuid.length).toBeGreaterThan(0);
  });

  it("stores payload", () => {
    const err = makeError({ payload: { key: "value", count: 42 } });
    expect(err.payload).toEqual({ key: "value", count: 42 });
  });

  it("defaults payload to empty object", () => {
    expect(makeError().payload).toEqual({});
  });

  it("stores reason", () => {
    const err = makeError({ reason: "network timed out" });
    expect(err.reason).toBe("network timed out");
  });

  it("stores module and context", () => {
    const err = makeError({ module: "auth", context: "login" });
    expect(err.module).toBe("auth");
    expect(err.context).toBe("login");
  });

  it("builds a correct identifier string", () => {
    const err = makeError({
      name: "FooError",
      module: "mod",
      context: "ctx",
      errorCode: "VALIDATION_ERROR",
    });
    expect(err.identifier).toBe("FooError/mod/ctx/VALIDATION_ERROR");
  });

  it("severityDescription is a non-empty string", () => {
    const err = makeError({ severity: "critical" });
    expect(typeof err.severityDescription).toBe("string");
    expect(err.severityDescription.length).toBeGreaterThan(0);
  });

  it("inherits origin metadata when origin is a TransmutedError", () => {
    const origin = makeError({
      name: "OriginError",
      module: "origin-mod",
      context: "origin-ctx",
      severity: "fatal",
      errorCode: "DATA_INTEGRITY_VIOLATION",
      reason: "from origin",
    });
    const wrapper = new TransmutedError({
      message: "wrapped",
      name: "WrapperError",
      origin,
    });
    // Props from the origin should be inherited as defaults
    expect(wrapper.module).toBe("origin-mod");
    expect(wrapper.context).toBe("origin-ctx");
    expect(wrapper.severity).toBe("fatal");
    expect(wrapper.reason).toBe("from origin");
  });

  it("props on the wrapper take precedence over origin metadata", () => {
    const origin = makeError({
      name: "OriginError",
      module: "origin-mod",
      severity: "fatal",
    });
    const wrapper = new TransmutedError({
      message: "wrapped",
      name: "WrapperError",
      origin,
      module: "override-mod",
      severity: "minor",
    });
    expect(wrapper.module).toBe("override-mod");
    expect(wrapper.severity).toBe("minor");
  });

  it("stores origin", () => {
    const cause = new Error("raw cause");
    const err = makeError({ origin: cause });
    expect(err.origin).toBe(cause);
  });
});

describe("MysticError", () => {
  it("is instanceof TransmutedError", () => {
    const err = new MysticError({ message: "mystic", name: "MysticError" });
    expect(err).toBeInstanceOf(TransmutedError);
    expect(err).toBeInstanceOf(MysticError);
  });

  it("is not instanceof SynthesizedError", () => {
    const err = new MysticError({ message: "mystic", name: "MysticError" });
    expect(err).not.toBeInstanceOf(SynthesizedError);
  });
});

describe("SynthesizedError", () => {
  it("is instanceof TransmutedError", () => {
    const err = new SynthesizedError({ message: "synthesized", name: "SynthesizedError" });
    expect(err).toBeInstanceOf(TransmutedError);
    expect(err).toBeInstanceOf(SynthesizedError);
  });

  it("is not instanceof MysticError", () => {
    const err = new SynthesizedError({ message: "synthesized", name: "SynthesizedError" });
    expect(err).not.toBeInstanceOf(MysticError);
  });
});
