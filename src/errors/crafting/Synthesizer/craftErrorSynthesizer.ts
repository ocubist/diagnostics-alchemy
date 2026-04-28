import {
  executeSynthesizerMiddlewareOneByOne,
  flattenMiddlewareChain,
} from "./helpers";
import type { Synthesizer, SynthesizerMiddlewareChain } from "./types";

/**
 * Composes multiple transmuters into a single pipeline.
 * Each transmuter is tried in order; the first match wins.
 *
 * @example
 * const synthesizer = craftErrorSynthesizer([axiosTransmuter, zodTransmuter]);
 * const typed = synthesizer.synthesize(unknownError);
 */
export const craftErrorSynthesizer = (
  middlewareChain: SynthesizerMiddlewareChain
): Synthesizer => ({
  middlewareChain: flattenMiddlewareChain(middlewareChain),
  synthesize(err: unknown) {
    return executeSynthesizerMiddlewareOneByOne(err, this.middlewareChain);
  },
});
