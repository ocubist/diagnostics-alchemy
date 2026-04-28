import type { SynthesizedError } from "../../transmuted-errors/SynthesizedError";

type ErrorMapEntry = [
  typeof SynthesizedError,
  (err: SynthesizedError) => void,
];

/**
 * Builds a Map of SynthesizedError constructors → handler functions,
 * used by craftErrorResolver to route errors to the right handler.
 *
 * @example
 * const map = craftErrorResolverMap(
 *   [NotFoundError, (err) => res.status(404).json({ error: err.message })],
 *   [AuthError,     (err) => res.status(401).json({ error: err.message })],
 * );
 */
export const craftErrorResolverMap = (
  ...mapping: ErrorMapEntry[]
): Map<typeof SynthesizedError, (err: SynthesizedError) => void> =>
  new Map(mapping);
