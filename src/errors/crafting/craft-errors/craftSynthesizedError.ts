import { SynthesizedError } from "../../transmuted-errors/SynthesizedError";
import type { CraftErrorProps, CraftedErrorProps } from "./types";

/**
 * Factory that produces a named SynthesizedError subclass pre-filled with static metadata.
 *
 * @example
 * const HttpNotFoundError = craftSynthesizedError({
 *   name: "HttpNotFoundError",
 *   errorCode: "HTTP_NOT_FOUND",
 *   severity: "unexpected",
 * });
 *
 * throw new HttpNotFoundError({ message: "Resource not found" });
 * HttpNotFoundError.compare(err); // safe instanceof
 */
export const craftSynthesizedError = (props: CraftErrorProps) => {
  const staticProps = props;
  const dynamicClassUuid = crypto.randomUUID();

  class CraftedSynthesizedError extends SynthesizedError {
    static readonly dynamicClassUuid = dynamicClassUuid;

    constructor(instanceProps: CraftedErrorProps) {
      super({ ...staticProps, ...instanceProps });
      Object.setPrototypeOf(this, CraftedSynthesizedError.prototype);
      Object.defineProperty(this, "dynamicClassUuid", {
        value: dynamicClassUuid,
        writable: false,
        enumerable: true,
      });
    }

    /** Type-safe alternative to instanceof that survives module boundary differences. */
    static compare(err: unknown): err is CraftedSynthesizedError {
      return (
        err instanceof CraftedSynthesizedError ||
        (err instanceof SynthesizedError &&
          (err as unknown as { dynamicClassUuid?: string }).dynamicClassUuid === dynamicClassUuid)
      );
    }
  }

  return CraftedSynthesizedError;
};

export type CraftedSynthesizedErrorClass = ReturnType<typeof craftSynthesizedError>;
export type CraftedSynthesizedErrorInstance = InstanceType<CraftedSynthesizedErrorClass>;
