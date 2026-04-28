import { describe, it, expect } from "vitest";
import { craftErrorTransmuter } from "../../../src/errors/crafting/Transmuter/craftErrorTransmuter";
import { craftErrorSynthesizer } from "../../../src/errors/crafting/Synthesizer/craftErrorSynthesizer";
import { craftMysticError } from "../../../src/errors/crafting/craft-errors/craftMysticError";

const NetworkError = craftMysticError({
  name: "NetworkError",
  errorCode: "NETWORK_ERROR",
  severity: "critical",
});

const networkTransmuter = craftErrorTransmuter(
  (err) => err instanceof TypeError && (err as TypeError).message.includes("network"),
  (err: TypeError) => new NetworkError({ message: err.message, origin: err })
);

describe("craftErrorTransmuter", () => {
  it("detect returns true when the error matches", () => {
    const err = new TypeError("network failure");
    expect(networkTransmuter.detect(err)).toBe(true);
  });

  it("detect returns false for non-matching errors", () => {
    expect(networkTransmuter.detect(new TypeError("unrelated"))).toBe(false);
    expect(networkTransmuter.detect(new Error("network"))).toBe(false);
    expect(networkTransmuter.detect("not an error")).toBe(false);
  });

  it("execute transmutes a matching error into typed error", () => {
    const raw = new TypeError("network timeout");
    const result = networkTransmuter.execute(raw);
    expect(NetworkError.compare(result)).toBe(true);
    if (result instanceof NetworkError) {
      expect(result.message).toBe("network timeout");
      expect(result.origin).toBe(raw);
    }
  });

  it("execute passes through non-matching errors unchanged", () => {
    const raw = new Error("some other error");
    const result = networkTransmuter.execute(raw);
    expect(result).toBe(raw);
  });

  it("execute passes through non-errors unchanged", () => {
    expect(networkTransmuter.execute("string")).toBe("string");
    expect(networkTransmuter.execute(null)).toBe(null);
  });
});

describe("craftErrorSynthesizer", () => {
  const ValidationError = craftMysticError({
    name: "ValidationError",
    errorCode: "VALIDATION_ERROR",
    severity: "unexpected",
  });

  const validationTransmuter = craftErrorTransmuter(
    (err) => err instanceof RangeError,
    (err: RangeError) => new ValidationError({ message: err.message, origin: err })
  );

  const synthesizer = craftErrorSynthesizer([networkTransmuter, validationTransmuter]);

  it("synthesize applies the first matching transmuter", () => {
    const raw = new TypeError("network down");
    const result = synthesizer.synthesize(raw);
    expect(NetworkError.compare(result)).toBe(true);
  });

  it("synthesize applies the second transmuter when first doesn't match", () => {
    const raw = new RangeError("out of range");
    const result = synthesizer.synthesize(raw);
    expect(ValidationError.compare(result)).toBe(true);
  });

  it("synthesize passes through errors that match no transmuter", () => {
    const raw = new SyntaxError("unexpected token");
    const result = synthesizer.synthesize(raw);
    expect(result).toBe(raw);
  });

  it("supports nested synthesizers in the chain", () => {
    const inner = craftErrorSynthesizer([validationTransmuter]);
    const outer = craftErrorSynthesizer([networkTransmuter, inner]);
    const raw = new RangeError("range");
    const result = outer.synthesize(raw);
    expect(ValidationError.compare(result)).toBe(true);
  });
});
