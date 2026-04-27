import {
  executeSynthesizerMiddlewareOneByOne,
  flattenMiddlewareChain,
} from "./helpers";
import { Synthesizer, SynthesizerMiddlewareChain } from "./types";

/**
 * Crafts a new error synthesizer with the given middleware chain.
 *
 * @param {SynthesizerMiddlewareChain} middlewareChain - The middleware chain of transmuters.
 * @returns {Synthesizer} The crafted synthesizer.
 */
export const craftErrorSynthesizer = (
  middlewareChain: SynthesizerMiddlewareChain
): Synthesizer => {
  const newSynthesizer: Synthesizer = {
    middlewareChain: flattenMiddlewareChain(middlewareChain),
    synthesize(err) {
      return executeSynthesizerMiddlewareOneByOne(err, this.middlewareChain);
    },
  };

  return newSynthesizer;
};
