import { TransmutedError } from "../../errors/transmuted-errors/TransmutedError";

/**
 * Converts any value into a plain, JSON-serializable object.
 *
 * - `TransmutedError` instances are deeply serialized with all their typed fields.
 * - Plain `Error` instances are serialized with name, message, and stack.
 * - Everything else is wrapped in `{ value }`.
 *
 * Handles recursive `origin` chains so that wrapped errors are fully represented.
 *
 * @example
 * logger.error("Fetch failed", { payload: { err: objectifyError(err) } });
 */
export const objectifyError = (err: unknown): Record<string, unknown> => {
  if (err instanceof TransmutedError) {
    return {
      type: err.name,
      message: err.message,
      severity: err.severity,
      errorCode: err.errorCode,
      ...(err.reason !== undefined && { reason: err.reason }),
      ...(err.module !== undefined && { module: err.module }),
      ...(err.context !== undefined && { context: err.context }),
      identifier: err.identifier,
      payload: Object.keys(err.payload).length > 0 ? err.payload : undefined,
      origin:
        err.origin !== undefined ? objectifyError(err.origin) : undefined,
      instanceUuid: err.instanceUuid,
    };
  }

  if (err instanceof Error) {
    return {
      type: err.name,
      message: err.message,
      stack: err.stack,
    };
  }

  return { value: err };
};
