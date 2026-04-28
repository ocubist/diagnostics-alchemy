import { MysticError } from "../../transmuted-errors/MysticError";
import type { CraftErrorProps, CraftedErrorProps } from "./types";

/**
 * Factory that produces a named MysticError subclass pre-filled with static metadata.
 *
 * @example
 * const FileNotFoundError = craftMysticError({
 *   name: "FileNotFoundError",
 *   errorCode: "FILE_NOT_FOUND",
 *   severity: "critical",
 *   reason: "The requested file does not exist",
 * });
 *
 * throw new FileNotFoundError({ message: `Not found: ${path}`, payload: { path } });
 * FileNotFoundError.compare(err); // safe instanceof
 */
export const craftMysticError = (props: CraftErrorProps) => {
  const staticProps = props;
  const dynamicClassUuid = crypto.randomUUID();

  class CraftedMysticError extends MysticError {
    static readonly dynamicClassUuid = dynamicClassUuid;

    constructor(instanceProps: CraftedErrorProps) {
      super({ ...staticProps, ...instanceProps });
      Object.setPrototypeOf(this, CraftedMysticError.prototype);
      Object.defineProperty(this, "dynamicClassUuid", {
        value: dynamicClassUuid,
        writable: false,
        enumerable: true,
      });
    }

    /** Type-safe alternative to instanceof that survives module boundary differences. */
    static compare(err: unknown): err is CraftedMysticError {
      return (
        err instanceof CraftedMysticError ||
        (err instanceof MysticError &&
          (err as unknown as { dynamicClassUuid?: string }).dynamicClassUuid === dynamicClassUuid)
      );
    }
  }

  return CraftedMysticError;
};

export type CraftedMysticErrorClass = ReturnType<typeof craftMysticError>;
export type CraftedMysticErrorInstance = InstanceType<CraftedMysticErrorClass>;
