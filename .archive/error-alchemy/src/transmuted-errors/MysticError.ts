import { TransmutedError } from "./TransmutedError";
import { TransmutedErrorProps } from "./types";

/**
 * Class representing a mystic error, which is a transmuted error that is not yet handled.
 *
 * @extends TransmutedError
 */
export class MysticError extends TransmutedError {
  /**
   * Constructs a new MysticError.
   *
   * @param {TransmutedErrorProps} props - The properties of the mystic error.
   */
  constructor(props: TransmutedErrorProps) {
    super(props);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, MysticError.prototype);
  }
}
