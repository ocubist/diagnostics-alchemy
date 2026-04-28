import { describe, it, expect } from "vitest";
import { z, ZodError } from "zod";
import { useErrorAlchemy } from "../../../src/errors/crafting/useErrorAlchemy/useErrorAlchemy";
import { TransmutedError } from "../../../src/errors/transmuted-errors/TransmutedError";

const MODULE = "test-module";
const CONTEXT = "test-context";

const {
  craftMysticError,
  craftSynthesizedError,
  craftErrorTransmuter,
  craftErrorSynthesizer,
} = useErrorAlchemy(MODULE, CONTEXT);

describe("useErrorAlchemy", () => {
  describe("craftMysticError (via useErrorAlchemy)", () => {
    const BoundError = craftMysticError({
      name: "BoundError",
      errorCode: "RUNTIME_ERROR",
      severity: "unexpected",
    });

    it("auto-stamps module and context onto created instances", () => {
      const err = new BoundError({ message: "stamped" });
      expect(err.module).toBe(MODULE);
      expect(err.context).toBe(CONTEXT);
    });

    it("instance-level overrides still work", () => {
      const err = new BoundError({ message: "stamped", severity: "fatal" });
      expect(err.severity).toBe("fatal");
    });
  });

  describe("craftSynthesizedError (via useErrorAlchemy)", () => {
    const BoundSynth = craftSynthesizedError({
      name: "BoundSynth",
      errorCode: "UNKNOWN_ERROR",
    });

    it("auto-stamps module and context", () => {
      const err = new BoundSynth({ message: "synth" });
      expect(err.module).toBe(MODULE);
      expect(err.context).toBe(CONTEXT);
    });
  });

  describe("craftErrorTransmuter (via useErrorAlchemy)", () => {
    const WrappedError = craftMysticError({
      name: "WrappedError",
      errorCode: "UNKNOWN_ERROR",
    });

    const transmuter = craftErrorTransmuter(
      (err) => err instanceof RangeError,
      (err: RangeError) => new WrappedError({ message: err.message })
    );

    it("stamps module/context onto transmuted results", () => {
      const raw = new RangeError("out of bounds");
      const result = transmuter.execute(raw);
      expect(result).toBeInstanceOf(TransmutedError);
      if (result instanceof TransmutedError) {
        expect(result.module).toBe(MODULE);
        expect(result.context).toBe(CONTEXT);
      }
    });

    it("passes through non-matching errors without stamping", () => {
      const raw = new TypeError("type mismatch");
      const result = transmuter.execute(raw);
      expect(result).toBe(raw);
      expect((result as TransmutedError).module).toBeUndefined();
    });
  });

  describe("craftErrorSynthesizer (via useErrorAlchemy)", () => {
    const ZodWrapped = craftMysticError({ name: "ZodWrapped" });

    const zodTransmuter = craftErrorTransmuter(
      (err) => err instanceof ZodError,
      (err: ZodError) => new ZodWrapped({ message: err.message })
    );

    const synthesizer = craftErrorSynthesizer([zodTransmuter]);

    it("stamps module/context on synthesized results", () => {
      let zodError: ZodError | null = null;
      try {
        z.string().parse(42);
      } catch (e) {
        if (e instanceof ZodError) zodError = e;
      }
      if (!zodError) throw new Error("Test setup: expected ZodError to be thrown");

      const result = synthesizer.synthesize(zodError);
      expect(result).toBeInstanceOf(TransmutedError);
      if (result instanceof TransmutedError) {
        expect(result.module).toBe(MODULE);
      }
    });
  });
});
