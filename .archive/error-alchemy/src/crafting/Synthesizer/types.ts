import z from "zod";
import { Transmuter } from "../Transmuter/types";

/**
 * Type for a chain of synthesizer middleware, which can be an array of transmuters or nested middleware chains.
 *
 * @typedef {Array} SynthesizerMiddlewareChain
 */
export type SynthesizerMiddlewareChain = Array<
  Transmuter | Synthesizer | SynthesizerMiddlewareChain
>;

/**
 * Zod schema for a synthesizer that contains a middleware chain and a synthesize function.
 */
export const Synthesizer = z.lazy(() =>
  z.object({
    middlewareChain: z.array(Transmuter),
    synthesize: z.function(z.tuple([z.unknown()]), z.unknown()),
  })
);

/**
 * Interface for a synthesizer that contains a middleware chain and a synthesize function.
 *
 * @typedef {Object} Synthesizer
 * @property {Transmuter[]} middlewareChain - The middleware chain of transmuters.
 * @property {Function} synthesize - The function to synthesize errors.
 */
export interface Synthesizer {
  middlewareChain: Transmuter[];
  synthesize: (err: unknown) => unknown;
}
