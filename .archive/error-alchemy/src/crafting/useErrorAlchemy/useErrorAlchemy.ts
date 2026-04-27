import z from "zod";

import { CraftErrorProps } from "../craft-errors/types";
import {
  DetectorFunction,
  Transmuter,
  TransmuterFunction,
} from "../Transmuter/types";
import { TransmutedError } from "../../transmuted-errors/TransmutedError";

import { Synthesizer, SynthesizerMiddlewareChain } from "../Synthesizer/types";
import { craftErrorTransmuter } from "../Transmuter/craftErrorTransmuter";
import { craftErrorSynthesizer } from "../Synthesizer/craftErrorSynthesizer";
import { craftMysticError } from "../craft-errors/craftMysticError";
import { craftSynthesizedError } from "../craft-errors/craftSynthesizedError";
import { craftErrorLogger } from "../Resolver/craftErrorLogger";
import { craftErrorResolverMap } from "../Resolver/craftErrorResolverMap";
import { craftErrorResolver } from "../Resolver/craftErrorResolver";

/**
 * Zod schema for alchemy craft error properties.
 */
export const AlchemyCraftErrorProps = CraftErrorProps.omit({
  context: true,
  module: true,
});
export type AlchemyCraftErrorProps = z.infer<typeof AlchemyCraftErrorProps>;

/**
 * Provides functions for crafting errors and transmuters with specified module and context.
 *
 * @param {string} module - The module name to use for crafted errors.
 * @param {string} context - The context to use for crafted errors.
 * @returns {Object} An object containing functions for crafting errors and transmuters.
 */
export const useErrorAlchemy = (module: string, context: string) => {
  /**
   * Crafts a new transmuter with the given detector and transmuter functions, injecting module and context.
   *
   * @template T
   * @param {DetectorFunction} detectorFunction - The function to detect errors.
   * @param {TransmuterFunction<T>} transmuterFunction - The function to transmute errors.
   * @returns {Transmuter<T>} The crafted transmuter.
   */
  const _craftErrorTransmuter = <T = any>(
    detectorFunction: DetectorFunction,
    transmuterFunction: TransmuterFunction<T>
  ): Transmuter<T> => {
    const newTransmuterFunction: TransmuterFunction<T> = (err: T) => {
      const result = transmuterFunction(err);
      result.context = context;
      result.module = module;
      return result;
    };

    return craftErrorTransmuter<T>(detectorFunction, newTransmuterFunction);
  };

  /**
   * Crafts a new error synthesizer with the given middleware chain, injecting module and context.
   *
   * @param {SynthesizerMiddlewareChain} middlewareChain - The middleware chain of transmuters.
   * @returns {Synthesizer} The crafted synthesizer.
   */
  const _craftErrorSynthesizer = (
    middlewareChain: SynthesizerMiddlewareChain
  ): Synthesizer => {
    const originalSynthesizer = craftErrorSynthesizer(middlewareChain);

    const newSynthesizer: Synthesizer = {
      middlewareChain: originalSynthesizer.middlewareChain,
      synthesize: (err: unknown) => {
        const result = originalSynthesizer.synthesize(err);
        if (result !== err && result instanceof TransmutedError) {
          result.module = module;
          result.context = context;
        }
        return result;
      },
    };

    return newSynthesizer;
  };

  /**
   * Crafts a new mystic error with the given properties, injecting module and context.
   *
   * @param {AlchemyCraftErrorProps} props - The properties of the mystic error.
   * @returns {TransmutedError} The crafted mystic error.
   */
  const _craftMysticError = (props: AlchemyCraftErrorProps) => {
    const craftProps = { ...props, module, context };
    return craftMysticError(craftProps);
  };

  /**
   * Crafts a new synthesized error with the given properties, injecting module and context.
   *
   * @param {AlchemyCraftErrorProps} props - The properties of the synthesized error.
   * @returns {TransmutedError} The crafted synthesized error.
   */
  const _craftSynthesizedError = (props: AlchemyCraftErrorProps) => {
    const craftProps = { ...props, module, context };
    return craftSynthesizedError(craftProps);
  };

  return {
    /**
     * Crafts a new error synthesizer with the given middleware chain.
     *
     * @param {SynthesizerMiddlewareChain} middlewareChain - The middleware chain of transmuters.
     * @returns {Synthesizer} The crafted synthesizer.
     */
    craftErrorSynthesizer: _craftErrorSynthesizer,

    /**
     * Crafts a new mystic error with the given properties.
     *
     * @param {AlchemyCraftErrorProps} props - The properties of the mystic error.
     * @returns {TransmutedError} The crafted mystic error.
     */
    craftMysticError: _craftMysticError,

    /**
     * Crafts a new synthesized error with the given properties.
     *
     * @param {AlchemyCraftErrorProps} props - The properties of the synthesized error.
     * @returns {TransmutedError} The crafted synthesized error.
     */
    craftSynthesizedError: _craftSynthesizedError,

    /**
     * Crafts a new transmuter with the given detector and transmuter functions.
     *
     * @template T
     * @param {DetectorFunction} detectorFunction - The function to detect errors.
     * @param {TransmuterFunction<T>} transmuterFunction - The function to transmute errors.
     * @returns {Transmuter<T>} The crafted transmuter.
     */
    craftErrorTransmuter: _craftErrorTransmuter,

    /**
     * Crafts a new error logger with the given properties.
     *
     * @param {CraftErrorLoggerProps} props - The properties of the error logger.
     * @returns {(err: unknown) => void} The crafted error logger function.
     */
    craftErrorLogger,

    /**
     * Crafts a new error resolver map with the given mappings.
     *
     * @param {...ErrorMapEntry[]} mapping - The error map entries.
     * @returns {Map<typeof SynthesizedError, (err: SynthesizedError) => void>} The crafted error resolver map.
     */
    craftErrorResolverMap,

    /**
     * Crafts a new error resolver with the given properties.
     *
     * @param {CraftErrorResolverProps} props - The properties of the error resolver.
     * @returns {(err: unknown) => void} The crafted error resolver function.
     */
    craftErrorResolver,
  };
};
