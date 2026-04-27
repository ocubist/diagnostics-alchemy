import { TransmutedError } from "./TransmutedError";
import { TransmutedErrorProps } from "./types";

/**
 * Class representing a synthesized error, which is an error that is clearly identified and ready to be handled immediately.
 *
 * @extends TransmutedError
 */
export class SynthesizedError extends TransmutedError {
  /**
   * Constructs a new SynthesizedError.
   *
   * @param {TransmutedErrorProps} props - The properties of the synthesized error.
   */
  constructor(props: TransmutedErrorProps) {
    super(props);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SynthesizedError.prototype);
  }
}
