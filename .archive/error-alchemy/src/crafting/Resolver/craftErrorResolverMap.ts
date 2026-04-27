import { SynthesizedError } from "../../transmuted-errors/SynthesizedError";

type ErrorMapEntry = [typeof SynthesizedError, (err: SynthesizedError) => void];

/**
 * Crafts a new error resolver map with the given mappings.
 *
 * @param {...ErrorMapEntry[]} mapping - The error map entries.
 * @returns {Map<typeof SynthesizedError, (err: SynthesizedError) => void>} The crafted error resolver map.
 */
export const craftErrorResolverMap = (...mapping: ErrorMapEntry[]) => {
  const errorResolverMap = new Map<
    typeof SynthesizedError,
    (err: SynthesizedError) => void
  >(mapping);

  return errorResolverMap;
};
