import type { Transmuter } from "../Transmuter/types";

export type SynthesizerMiddlewareChain = Array<
  Transmuter | Synthesizer | SynthesizerMiddlewareChain
>;

export interface Synthesizer {
  middlewareChain: Transmuter[];
  synthesize: (err: unknown) => unknown;
}
