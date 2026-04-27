import { v4 as uuid } from "uuid";
import { MysticError } from "../../transmuted-errors/MysticError";
import { CraftErrorProps, CraftedErrorProps } from "./types";

/**
 * Crafts a new mystic error class with the given properties.
 *
 * @param {CraftErrorProps} props - The properties to craft the mystic error.
 * @returns {typeof MysticError} The crafted mystic error class.
 */
export const craftMysticError = (props: CraftErrorProps) => {
  const craftProps = props;
  const dynamicUUID = uuid();

  /**
   * Class representing a crafted mystic error.
   *
   * @extends MysticError
   */
  class CraftedMysticError extends MysticError {
    dynamicClassUuid: string;

    /**
     * Constructs a new CraftedMysticError.
     *
     * @param {CraftedErrorProps} props - The properties of the crafted mystic error.
     */
    constructor(props: CraftedErrorProps) {
      super({ ...craftProps, ...props });

      // Set the prototype explicitly.
      Object.setPrototypeOf(this, CraftedMysticError.prototype);

      this.dynamicClassUuid = dynamicUUID;
    }

    /**
     * Compares an unknown error to determine if it is an instance of CraftedMysticError.
     *
     * @param {unknown} err - The error to compare.
     * @returns {boolean} True if the error is an instance of CraftedMysticError, false otherwise.
     */
    static compare(err: unknown): boolean {
      return err instanceof CraftedMysticError;
    }
  }

  return CraftedMysticError;
};
