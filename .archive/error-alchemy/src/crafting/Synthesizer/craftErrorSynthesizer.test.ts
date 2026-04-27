import z from "zod";

import { TransmutedError } from "../../transmuted-errors/TransmutedError";

import { craftErrorTransmuter } from "../Transmuter/craftErrorTransmuter";
import { Transmuter } from "../Transmuter/types";

import { SynthesizerMiddlewareChain } from "./types";
import { craftErrorSynthesizer } from "./craftErrorSynthesizer";
import { MysticError } from "../../transmuted-errors/MysticError";
import { SynthesizedError } from "../../transmuted-errors/SynthesizedError";

describe("craftErrorSynthesizer", () => {
  const mysticErrorTransmuter = craftErrorTransmuter(
    () => true,
    (err) =>
      new MysticError({
        message: "message...",
        name: "name...",
        origin: err,
      })
  );

  const doNothingTransmuter = craftErrorTransmuter(
    () => false,
    (err) =>
      new SynthesizedError({
        message: "message...",
        name: "name...",
        origin: err,
      })
  );

  const err = new Error("Test");
  const middlewareChain: SynthesizerMiddlewareChain = [
    doNothingTransmuter,
    [mysticErrorTransmuter],
  ];

  it("should create a Synthesizer with a middleware chain", () => {
    const synthesizer = craftErrorSynthesizer(middlewareChain);

    expect(Array.isArray(synthesizer.middlewareChain)).toBeTruthy();
    expect(synthesizer.middlewareChain).toContain(mysticErrorTransmuter);
    expect(synthesizer.middlewareChain).toContain(doNothingTransmuter);
    expect(
      z.array(Transmuter).safeParse(synthesizer.middlewareChain).success
    ).toBe(true);
  });

  it("should correctly apply middleware to an error", () => {
    const synthesizer = craftErrorSynthesizer(middlewareChain);

    const result = synthesizer.synthesize(err);
    expect(result).toBeInstanceOf(MysticError);
    // expect((middlewareChain.at(0) as Transmuter).detect).toHaveBeenCalledWith(
    //   err
    // );
    // expect(
    //   (middlewareChain.at(0) as Transmuter).transmute
    // ).not.toHaveBeenCalled();
    // expect((middlewareChain.at(1) as Transmuter).detect).toHaveBeenCalledWith(
    //   err
    // );
    // expect(
    //   (middlewareChain.at(0) as Transmuter).transmute
    // ).toHaveBeenCalledWith(err);
    expect(result instanceof MysticError).toBe(true);
  });

  it("should handle multiple middleware in order", () => {
    const synthesizer = craftErrorSynthesizer([
      mysticErrorTransmuter,
      doNothingTransmuter,
      mysticErrorTransmuter,
    ]);

    const result = synthesizer.synthesize(err);

    expect(((result as TransmutedError).origin as TransmutedError).origin).toBe(
      err
    );
  });

  it("should return original error if no transmutation occurs", () => {
    expect(craftErrorSynthesizer([]).synthesize(err)).toBe(err);
    expect(craftErrorSynthesizer([doNothingTransmuter]).synthesize(err)).toBe(
      err
    );
  });
});
