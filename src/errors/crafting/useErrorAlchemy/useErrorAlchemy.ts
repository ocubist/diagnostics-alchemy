import type { CraftErrorProps } from "../craft-errors/types";
import { craftMysticError } from "../craft-errors/craftMysticError";
import { craftSynthesizedError } from "../craft-errors/craftSynthesizedError";
import { craftErrorTransmuter } from "../Transmuter/craftErrorTransmuter";
import { craftErrorSynthesizer } from "../Synthesizer/craftErrorSynthesizer";
import { craftErrorLogger } from "../Resolver/craftErrorLogger";
import { craftErrorResolverMap } from "../Resolver/craftErrorResolverMap";
import { craftErrorResolver } from "../Resolver/craftErrorResolver";
import type { DetectorFunction, TransmuterFunction } from "../Transmuter/types";
import type { SynthesizerMiddlewareChain } from "../Synthesizer/types";
import { TransmutedError } from "../../transmuted-errors/TransmutedError";

/** CraftErrorProps without module/context — those are injected from useErrorAlchemy. */
export type AlchemyCraftErrorProps = Omit<CraftErrorProps, "module" | "context">;

/**
 * Primary entry point for the error framework.
 * Pre-binds `module` and `context` to all crafting functions so every error
 * produced in a module is automatically tagged with its origin.
 *
 * @example
 * const { craftMysticError, craftErrorTransmuter } = useErrorAlchemy(
 *   "auth-service",
 *   "LoginHandler"
 * );
 *
 * export const LoginFailedError = craftMysticError({
 *   name: "LoginFailedError",
 *   errorCode: "AUTH_INVALID_CREDENTIALS",
 *   severity: "critical",
 * });
 */
export const useErrorAlchemy = (module: string, context: string) => {
  const _craftMysticError = (props: AlchemyCraftErrorProps) =>
    craftMysticError({ ...props, module, context });

  const _craftSynthesizedError = (props: AlchemyCraftErrorProps) =>
    craftSynthesizedError({ ...props, module, context });

  const _craftErrorTransmuter = <T = unknown>(
    detector: DetectorFunction,
    transmuter: TransmuterFunction<T>
  ) => {
    const wrappedTransmuter: TransmuterFunction<T> = (err) => {
      const result = transmuter(err);
      // Stamp module/context onto the result if it's a TransmutedError
      if (result instanceof TransmutedError) {
        // TransmutedError fields are readonly; we use Object.assign for initial stamp
        // only when the transmuter didn't already set them.
        if (!result.module) Object.assign(result, { module });
        if (!result.context) Object.assign(result, { context });
      }
      return result;
    };
    return craftErrorTransmuter<T>(detector, wrappedTransmuter);
  };

  const _craftErrorSynthesizer = (chain: SynthesizerMiddlewareChain) => {
    const synth = craftErrorSynthesizer(chain);
    return {
      ...synth,
      synthesize(err: unknown) {
        const result = synth.synthesize(err);
        if (result instanceof TransmutedError && result !== err) {
          if (!result.module) Object.assign(result, { module });
          if (!result.context) Object.assign(result, { context });
        }
        return result;
      },
    };
  };

  return {
    craftMysticError: _craftMysticError,
    craftSynthesizedError: _craftSynthesizedError,
    craftErrorTransmuter: _craftErrorTransmuter,
    craftErrorSynthesizer: _craftErrorSynthesizer,
    craftErrorLogger,
    craftErrorResolverMap,
    craftErrorResolver,
  };
};
