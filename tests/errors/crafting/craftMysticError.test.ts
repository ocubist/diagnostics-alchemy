import { describe, it, expect } from "vitest";
import { craftMysticError } from "../../../src/errors/crafting/craft-errors/craftMysticError";
import { craftSynthesizedError } from "../../../src/errors/crafting/craft-errors/craftSynthesizedError";
import { MysticError } from "../../../src/errors/transmuted-errors/MysticError";
import { SynthesizedError } from "../../../src/errors/transmuted-errors/SynthesizedError";
import { TransmutedError } from "../../../src/errors/transmuted-errors/TransmutedError";

describe("craftMysticError", () => {
  const FileNotFoundError = craftMysticError({
    name: "FileNotFoundError",
    errorCode: "FILE_NOT_FOUND",
    severity: "critical",
    reason: "The requested file does not exist",
    module: "fs",
    context: "reader",
  });

  it("creates a class that extends MysticError", () => {
    const err = new FileNotFoundError({ message: "not found: /etc/foo" });
    expect(err).toBeInstanceOf(MysticError);
    expect(err).toBeInstanceOf(TransmutedError);
    expect(err).toBeInstanceOf(Error);
  });

  it("static props are baked in", () => {
    const err = new FileNotFoundError({ message: "msg" });
    expect(err.name).toBe("FileNotFoundError");
    expect(err.errorCode).toBe("FILE_NOT_FOUND");
    expect(err.severity).toBe("critical");
    expect(err.reason).toBe("The requested file does not exist");
    expect(err.module).toBe("fs");
    expect(err.context).toBe("reader");
  });

  it("instance props override static props", () => {
    const err = new FileNotFoundError({
      message: "custom",
      severity: "fatal",
    });
    expect(err.severity).toBe("fatal");
    expect(err.message).toBe("custom");
  });

  it("each instance has a unique uuid", () => {
    const a = new FileNotFoundError({ message: "a" });
    const b = new FileNotFoundError({ message: "b" });
    expect(a.instanceUuid).not.toBe(b.instanceUuid);
  });

  describe("compare (safe instanceof)", () => {
    it("returns true for instances of the crafted class", () => {
      const err = new FileNotFoundError({ message: "test" });
      expect(FileNotFoundError.compare(err)).toBe(true);
    });

    it("returns false for a plain MysticError", () => {
      const err = new MysticError({ message: "plain", name: "MysticError" });
      expect(FileNotFoundError.compare(err)).toBe(false);
    });

    it("returns false for a different crafted class", () => {
      const OtherError = craftMysticError({ name: "OtherError" });
      const err = new OtherError({ message: "other" });
      expect(FileNotFoundError.compare(err)).toBe(false);
    });

    it("returns false for a plain Error", () => {
      expect(FileNotFoundError.compare(new Error("nope"))).toBe(false);
    });

    it("returns false for non-errors", () => {
      expect(FileNotFoundError.compare(null)).toBe(false);
      expect(FileNotFoundError.compare("string")).toBe(false);
      expect(FileNotFoundError.compare(42)).toBe(false);
    });

    it("each crafted class has a unique dynamicClassUuid", () => {
      const A = craftMysticError({ name: "A" });
      const B = craftMysticError({ name: "B" });
      expect(A.dynamicClassUuid).not.toBe(B.dynamicClassUuid);
    });
  });
});

describe("craftSynthesizedError", () => {
  const HttpError = craftSynthesizedError({
    name: "HttpError",
    errorCode: "HTTP_BAD_REQUEST",
    severity: "unexpected",
  });

  it("creates a class that extends SynthesizedError", () => {
    const err = new HttpError({ message: "400 Bad Request" });
    expect(err).toBeInstanceOf(SynthesizedError);
    expect(err).toBeInstanceOf(TransmutedError);
  });

  it("is not a MysticError", () => {
    const err = new HttpError({ message: "400 Bad Request" });
    expect(err).not.toBeInstanceOf(MysticError);
  });

  it("compare works correctly for SynthesizedError-based classes", () => {
    const err = new HttpError({ message: "test" });
    expect(HttpError.compare(err)).toBe(true);

    const OtherSynth = craftSynthesizedError({ name: "OtherSynth" });
    const other = new OtherSynth({ message: "other" });
    expect(HttpError.compare(other)).toBe(false);
  });
});
