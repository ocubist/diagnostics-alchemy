import { Severity } from "../../severity/types";
import { TransmutedError } from "../../transmuted-errors/TransmutedError";

type AnyLogger = (err: unknown) => void;

export type CraftErrorLoggerProps = {
  [key in Severity]?: AnyLogger;
} & { default: AnyLogger };

/**
 * Crafts a new error logger with the given logger properties.
 *
 * @param {CraftErrorLoggerProps} props - The logger properties.
 * @returns {(err: unknown) => void} The crafted error logger function.
 */
export const craftErrorLogger = (
  props: CraftErrorLoggerProps
): ((err: unknown) => void) => {
  return (err: unknown) => {
    if (err instanceof TransmutedError) {
      const severity = err.severity;
      const severityLogger = props[severity];
      if (severityLogger !== undefined) {
        severityLogger(err);
      } else props.default(err);
    } else {
      props.default(err);
    }
  };
};
