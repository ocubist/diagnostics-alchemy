import { describe, it, expect } from "vitest";
import { objectifyError } from "../../../src/logger/formatters/objectifyError";
import { TransmutedError } from "../../../src/errors/transmuted-errors/TransmutedError";
import { craftMysticError } from "../../../src/errors/crafting/craft-errors/craftMysticError";

const AppError = craftMysticError({
  name: "AppError",
  errorCode: "RUNTIME_ERROR",
  severity: "critical",
  reason: "Something broke",
  module: "core",
  context: "bootstrap",
});

describe("objectifyError", () => {
  describe("TransmutedError subclasses", () => {
    it("serializes all TransmutedError fields", () => {
      const err = new AppError({
        message: "init failed",
        payload: { key: "value" },
      });
      const obj = objectifyError(err);

      expect(obj["type"]).toBe("AppError");
      expect(obj["message"]).toBe("init failed");
      expect(obj["severity"]).toBe("critical");
      expect(obj["errorCode"]).toBe("RUNTIME_ERROR");
      expect(obj["reason"]).toBe("Something broke");
      expect(obj["module"]).toBe("core");
      expect(obj["context"]).toBe("bootstrap");
      expect(obj["identifier"]).toBe("AppError/core/bootstrap/RUNTIME_ERROR");
      expect(obj["payload"]).toEqual({ key: "value" });
      expect(typeof obj["instanceUuid"]).toBe("string");
    });

    it("omits undefined fields like reason/module/context when not set", () => {
      const MinimalError = craftMysticError({ name: "MinimalError" });
      const err = new MinimalError({ message: "minimal" });
      const obj = objectifyError(err);

      expect("reason" in obj).toBe(false);
      expect("module" in obj).toBe(false);
      expect("context" in obj).toBe(false);
    });

    it("recursively serializes origin when it is a TransmutedError", () => {
      const cause = new AppError({ message: "root cause" });
      const wrapper = new TransmutedError({
        message: "wrapped",
        name: "WrapperError",
        origin: cause,
      });
      const obj = objectifyError(wrapper);
      const origin = obj["origin"] as Record<string, unknown>;
      expect(origin["type"]).toBe("AppError");
      expect(origin["message"]).toBe("root cause");
    });

    it("recursively serializes origin when it is a plain Error", () => {
      const cause = new Error("raw cause");
      const err = new AppError({ message: "wrapped", origin: cause });
      const obj = objectifyError(err);
      const origin = obj["origin"] as Record<string, unknown>;
      expect(origin["type"]).toBe("Error");
      expect(origin["message"]).toBe("raw cause");
    });

    it("omits payload when empty", () => {
      const err = new AppError({ message: "no payload" });
      const obj = objectifyError(err);
      expect(obj["payload"]).toBeUndefined();
    });
  });

  describe("plain Error", () => {
    it("serializes type, message, and stack", () => {
      const err = new TypeError("bad type");
      const obj = objectifyError(err);
      expect(obj["type"]).toBe("TypeError");
      expect(obj["message"]).toBe("bad type");
      expect(typeof obj["stack"]).toBe("string");
    });
  });

  describe("non-Error values", () => {
    it("wraps a string in { value }", () => {
      expect(objectifyError("some string")).toEqual({ value: "some string" });
    });

    it("wraps null in { value }", () => {
      expect(objectifyError(null)).toEqual({ value: null });
    });

    it("wraps a number in { value }", () => {
      expect(objectifyError(42)).toEqual({ value: 42 });
    });
  });
});
