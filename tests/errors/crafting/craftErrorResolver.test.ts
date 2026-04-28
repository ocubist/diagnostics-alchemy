import { describe, it, expect, vi } from "vitest";
import { craftErrorLogger } from "../../../src/errors/crafting/Resolver/craftErrorLogger";
import { craftErrorResolverMap } from "../../../src/errors/crafting/Resolver/craftErrorResolverMap";
import { craftErrorResolver } from "../../../src/errors/crafting/Resolver/craftErrorResolver";
import { craftMysticError } from "../../../src/errors/crafting/craft-errors/craftMysticError";
import { craftSynthesizedError } from "../../../src/errors/crafting/craft-errors/craftSynthesizedError";
import { craftErrorTransmuter } from "../../../src/errors/crafting/Transmuter/craftErrorTransmuter";
import { craftErrorSynthesizer } from "../../../src/errors/crafting/Synthesizer/craftErrorSynthesizer";
import { TransmutedError } from "../../../src/errors/transmuted-errors/TransmutedError";
import { SynthesizedError } from "../../../src/errors/transmuted-errors/SynthesizedError";

const FatalAppError = craftMysticError({
  name: "FatalAppError",
  errorCode: "UNKNOWN_ERROR",
  severity: "fatal",
});

const UnexpectedAppError = craftMysticError({
  name: "UnexpectedAppError",
  errorCode: "RUNTIME_ERROR",
  severity: "unexpected",
});

const SomeHttpError = craftSynthesizedError({
  name: "SomeHttpError",
  errorCode: "HTTP_BAD_REQUEST",
  severity: "unexpected",
});

describe("craftErrorLogger", () => {
  it("dispatches fatal errors to the fatal handler", () => {
    const fatalHandler = vi.fn();
    const defaultHandler = vi.fn();
    const logger = craftErrorLogger({ default: defaultHandler, fatal: fatalHandler });

    const err = new FatalAppError({ message: "fatal!" });
    logger(err);

    expect(fatalHandler).toHaveBeenCalledWith(err);
    expect(defaultHandler).not.toHaveBeenCalled();
  });

  it("falls back to default handler when no severity-specific handler is registered", () => {
    const defaultHandler = vi.fn();
    const logger = craftErrorLogger({ default: defaultHandler });

    const err = new UnexpectedAppError({ message: "unexpected!" });
    logger(err);

    expect(defaultHandler).toHaveBeenCalledWith(err);
  });

  it("uses default handler for non-TransmutedErrors", () => {
    const defaultHandler = vi.fn();
    const logger = craftErrorLogger({ default: defaultHandler });

    const raw = new Error("raw");
    logger(raw);

    expect(defaultHandler).toHaveBeenCalledWith(raw);
  });
});

describe("craftErrorResolverMap", () => {
  it("creates a Map with the provided entries", () => {
    const handler = vi.fn();
    const map = craftErrorResolverMap([SomeHttpError as typeof SynthesizedError, handler]);
    expect(map).toBeInstanceOf(Map);
    expect(map.size).toBe(1);
  });

  it("stores multiple entries", () => {
    const h1 = vi.fn();
    const h2 = vi.fn();
    const AnotherError = craftSynthesizedError({ name: "AnotherError" });
    const map = craftErrorResolverMap(
      [SomeHttpError as typeof SynthesizedError, h1],
      [AnotherError as typeof SynthesizedError, h2]
    );
    expect(map.size).toBe(2);
  });
});

describe("craftErrorResolver", () => {
  const httpTransmuter = craftErrorTransmuter(
    (err) => err instanceof TypeError,
    (err: TypeError) =>
      new SomeHttpError({ message: err.message, origin: err })
  );
  const synthesizer = craftErrorSynthesizer([httpTransmuter]);

  it("synthesizes error → routes to registered handler", () => {
    const httpHandler = vi.fn();
    const defaultHandler = vi.fn();
    const resolver = craftErrorResolver({
      synthesizer,
      errorResolverMap: craftErrorResolverMap(
        [SomeHttpError as typeof SynthesizedError, httpHandler]
      ),
      defaultResolver: defaultHandler,
    });

    resolver(new TypeError("network error"));
    expect(httpHandler).toHaveBeenCalledTimes(1);
    expect(defaultHandler).not.toHaveBeenCalled();
  });

  it("calls defaultResolver for unmatched synthesized errors", () => {
    const defaultHandler = vi.fn();
    const resolver = craftErrorResolver({
      synthesizer,
      defaultResolver: defaultHandler,
    });

    // TypeError matches the synthesizer → becomes SomeHttpError → but no handler registered
    resolver(new TypeError("unhandled type"));
    expect(defaultHandler).toHaveBeenCalledTimes(1);
  });

  it("calls defaultResolver for pass-through errors", () => {
    const defaultHandler = vi.fn();
    const resolver = craftErrorResolver({ defaultResolver: defaultHandler });
    resolver(new RangeError("pass through"));
    expect(defaultHandler).toHaveBeenCalledWith(expect.any(RangeError));
  });

  it("logs before resolving when logger is provided", () => {
    const logFn = vi.fn();
    const defaultHandler = vi.fn();
    const resolver = craftErrorResolver({ logger: logFn, defaultResolver: defaultHandler });
    resolver(new Error("any error"));
    expect(logFn).toHaveBeenCalledTimes(1);
    expect(defaultHandler).toHaveBeenCalledTimes(1);
  });
});
