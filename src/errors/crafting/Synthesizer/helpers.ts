import { SynthesizedError } from "../../transmuted-errors/SynthesizedError";
import type { Transmuter } from "../Transmuter/types";
import type { Synthesizer, SynthesizerMiddlewareChain } from "./types";

const isSynthesizer = (v: unknown): v is Synthesizer =>
  typeof v === "object" &&
  v !== null &&
  Array.isArray((v as Synthesizer).middlewareChain) &&
  typeof (v as Synthesizer).synthesize === "function";

/** Recursively flattens nested middleware chains into a flat Transmuter array. */
export const flattenMiddlewareChain = (
  chain: SynthesizerMiddlewareChain
): Transmuter[] => {
  const result: Transmuter[] = [];

  for (const entry of chain) {
    if (Array.isArray(entry)) {
      result.push(...flattenMiddlewareChain(entry));
    } else if (isSynthesizer(entry)) {
      result.push(...entry.middlewareChain);
    } else {
      result.push(entry as Transmuter);
    }
  }

  return result;
};

/**
 * Runs each transmuter in sequence, stopping as soon as one produces a SynthesizedError.
 * If nothing matches, the original error is returned unchanged.
 */
export const executeSynthesizerMiddlewareOneByOne = (
  err: unknown,
  transmuters: Transmuter[]
): unknown => {
  let result: unknown = err;

  for (const transmuter of transmuters) {
    result = transmuter.execute(result);
    if (result instanceof SynthesizedError) break;
  }

  return result;
};
