import { SynthesizedError } from "../../transmuted-errors/SynthesizedError";
import { Synthesizer } from "../Synthesizer/types";

export interface CraftErrorResolverProps {
  logger?: (err: unknown) => void;
  synthesizer?: Synthesizer;
  errorResolverMap?: Map<
    typeof SynthesizedError,
    (err: SynthesizedError) => void
  >;
  defaultResolver?: (err: unknown) => void;
}

/**
 * Crafts a new error resolver with the given properties.
 * 
 * @param {CraftErrorResolverProps} props - The properties of the error resolver.
 * @returns {(err: unknown) => void} The crafted error resolver function.
 */
export const craftErrorResolver = (props: CraftErrorResolverProps): (err: unknown) => void => {
  const { defaultResolver, errorResolverMap, logger, synthesizer } = props;

  return (err: unknown) => {
    const processedError = synthesizer ? synthesizer.synthesize(err) : err;
    if (logger) logger(processedError);

    // Check if the error is an instance of SynthesizedError
    if (processedError instanceof SynthesizedError) {
      // Find the resolver function for this specific type of SynthesizedError
      const resolver = errorResolverMap?.get(
        processedError.constructor as typeof SynthesizedError
      );

      // If a resolver function is found, use it
      if (resolver) {
        resolver(processedError);
      } else if (defaultResolver) {
        // If no specific resolver is found, use the default resolver
        defaultResolver(processedError);
      }
    } else if (defaultResolver) {
      // If the error is not a SynthesizedError, use the default resolver
      defaultResolver(processedError);
    }
  };
};
