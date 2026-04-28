import { SynthesizedError } from "../../transmuted-errors/SynthesizedError";
import type { Synthesizer } from "../Synthesizer/types";

export interface CraftErrorResolverProps {
  /** Optional synthesizer that converts unknown errors to typed ones before resolving. */
  synthesizer?: Synthesizer;
  /** Optional logger called with the (possibly synthesized) error before resolving. */
  logger?: (err: unknown) => void;
  /** Map of SynthesizedError constructors → handler functions. */
  errorResolverMap?: Map<typeof SynthesizedError, (err: SynthesizedError) => void>;
  /** Fallback handler for errors not matched by errorResolverMap. */
  defaultResolver?: (err: unknown) => void;
}

/**
 * Composes synthesize → log → resolve into a single error-handling function.
 *
 * @example
 * const resolver = craftErrorResolver({
 *   synthesizer,
 *   logger: (err) => logError(err),
 *   errorResolverMap: craftErrorResolverMap([NotFoundError, handleNotFound]),
 *   defaultResolver: (err) => res.status(500).json({ error: "Internal error" }),
 * });
 *
 * router.use((err, req, res, next) => resolver(err));
 */
export const craftErrorResolver =
  (props: CraftErrorResolverProps) =>
  (err: unknown): void => {
    const processed = props.synthesizer
      ? props.synthesizer.synthesize(err)
      : err;

    props.logger?.(processed);

    if (processed instanceof SynthesizedError) {
      const handler = props.errorResolverMap?.get(
        processed.constructor as typeof SynthesizedError
      );
      if (handler) {
        handler(processed);
      } else {
        props.defaultResolver?.(processed);
      }
    } else {
      props.defaultResolver?.(processed);
    }
  };
