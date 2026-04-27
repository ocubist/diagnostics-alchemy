import { v4 as uuid } from "uuid";
import { CraftErrorProps, CraftedErrorProps } from "./types";
import { SynthesizedError } from "../../transmuted-errors/SynthesizedError";

/**
 * Crafts a new synthesized error class with the given properties.
 *
 * @param {CraftErrorProps} props - The properties to craft the synthesized error.
 * @returns {typeof SynthesizedError} The crafted synthesized error class.
 */
export const craftSynthesizedError = (props: CraftErrorProps) => {
  const craftProps = props;
  const dynamicUUID = uuid();

  /**
   * Class representing a crafted synthesized error.
   *
   * @extends SynthesizedError
   */
  class CraftedSynthesizedError extends SynthesizedError {
    dynamicClassUuid: string;

    /**
     * Constructs a new CraftedSynthesizedError.
     *
     * @param {CraftedErrorProps} props - The properties of the crafted synthesized error.
     */
    constructor(props: CraftedErrorProps) {
      super({ ...craftProps, ...props });

      // Set the prototype explicitly.
      Object.setPrototypeOf(this, CraftedSynthesizedError.prototype);

      this.dynamicClassUuid = dynamicUUID;
    }

    /**
     * Compares an unknown error to determine if it is an instance of CraftedSynthesizedError.
     *
     * @param {unknown} err - The error to compare.
     * @returns {boolean} True if the error is an instance of CraftedSynthesizedError, false otherwise.
     */
    static compare(err: unknown): boolean {
      return err instanceof CraftedSynthesizedError;
    }
  }

  return CraftedSynthesizedError;
};
