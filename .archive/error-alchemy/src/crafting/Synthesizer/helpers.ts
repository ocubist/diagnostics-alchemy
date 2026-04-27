import { SynthesizedError } from "../../transmuted-errors/SynthesizedError";
import { Transmuter } from "../Transmuter/types";
import { Synthesizer, SynthesizerMiddlewareChain } from "./types";

/**
 * Flattens a nested middleware chain into a single array of transmuters.
 *
 * @param {SynthesizerMiddlewareChain} middlewareChain - The nested middleware chain to flatten.
 * @returns {Transmuter[]} The flattened array of transmuters.
 */
export function flattenMiddlewareChain(
  middlewareChain: SynthesizerMiddlewareChain
) {
  const result: Transmuter[] = [];

  middlewareChain.forEach((mw) => {
    if (Array.isArray(mw)) {
      result.push(...flattenMiddlewareChain(mw));
    } else if (Synthesizer.safeParse(mw).success) {
      result.push(...(mw as Synthesizer).middlewareChain);
    } else {
      result.push(mw as Transmuter);
    }
  });

  return result;
}

/**
 * Executes a series of transmuters on an error, one by one, until an error is transmuted into a SynthesizedError.
 *
 * @param {unknown} err - The error to process.
 * @param {Transmuter[]} transmuters - The array of transmuters to execute.
 * @returns {unknown} The final processed error.
 */
export const executeSynthesizerMiddlewareOneByOne = (
  err: unknown,
  transmuters: Transmuter[]
) => {
  let result = err;

  for (const mw of transmuters) {
    result = mw.execute(result);
    if (result instanceof SynthesizedError) break;
  }

  return result;
};
