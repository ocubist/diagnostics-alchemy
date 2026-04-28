import type { Severity } from "../../severity/types";
import { TransmutedError } from "../../transmuted-errors/TransmutedError";

type AnyLogger = (err: unknown) => void;

export type CraftErrorLoggerProps = Partial<Record<Severity, AnyLogger>> & {
  default: AnyLogger;
};

/**
 * Creates a severity-aware error dispatcher.
 * Routes TransmutedErrors to per-severity handlers; everything else goes to `default`.
 *
 * @example
 * const logError = craftErrorLogger({
 *   default: (err) => log.error("Error", err),
 *   fatal:   (err) => log.fatal("Fatal", err),
 * });
 *
 * logError(anyError);
 */
export const craftErrorLogger = (
  props: CraftErrorLoggerProps
): ((err: unknown) => void) =>
  (err: unknown) => {
    if (err instanceof TransmutedError) {
      const handler = props[err.severity];
      (handler ?? props.default)(err);
    } else {
      props.default(err);
    }
  };
