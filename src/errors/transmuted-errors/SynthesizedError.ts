import { TransmutedError } from "./TransmutedError";
import type { TransmutedErrorProps } from "./types";

/**
 * Represents an error that has been clearly identified and is ready to be handled.
 * Use SynthesizedError when the error type is known and can be routed to a specific handler.
 */
export class SynthesizedError extends TransmutedError {
  constructor(props: TransmutedErrorProps) {
    super(props);
    Object.setPrototypeOf(this, SynthesizedError.prototype);
  }
}
