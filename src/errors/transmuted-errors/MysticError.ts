import { TransmutedError } from "./TransmutedError";
import type { TransmutedErrorProps } from "./types";

/**
 * Represents an error that has not yet been identified or handled.
 * Use MysticError when the origin or cause is unknown.
 */
export class MysticError extends TransmutedError {
  constructor(props: TransmutedErrorProps) {
    super(props);
    Object.setPrototypeOf(this, MysticError.prototype);
  }
}
