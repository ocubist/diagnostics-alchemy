import { useErrorAlchemy } from "../../../crafting/useErrorAlchemy/useErrorAlchemy";

const { craftMysticError } = useErrorAlchemy("errorAlchemy", "assertNotEmpty");

/**
 * Type for AssertNotEmptyFailedError.
 */
export type AssertNotEmptyFailedError = InstanceType<
  ReturnType<typeof craftMysticError>
>;

/**
 * Type for AssertNotEmptyMaxSmallerThanMinError.
 */
export type AssertNotEmptyMaxSmallerThanMinError = InstanceType<
  ReturnType<typeof craftMysticError>
>;

export const AssertNotEmptyFailedError = craftMysticError({
  name: "AssertNotEmptyFailedError",
  severity: "critical",
  errorCode: "DATA_INTEGRITY_VIOLATION",
  reason: "The value was found to be empty, but a non-empty value was expected.",
});

export const AssertNotEmptyMaxSmallerThanMinError = craftMysticError({
  name: "AssertNotEmptyMaxSmallerThanMinError",
  severity: "critical",
  errorCode: "RUNTIME_ERROR",
  reason: "The max-length must be at least as big as the min-value",
});

export type AssertNotEmptyValueType =
  | string
  | any[]
  | ArrayBufferView
  | Set<unknown>
  | Map<unknown, unknown>
  | Buffer
  | Record<string, unknown>;

/**
 * Asserts that a given value is not empty.
 * @param {T} value - The value to be checked for non-emptiness.
 * @param {number} [min=1] - The minimum acceptable length or size.
 * @param {number} [max] - The maximum acceptable length or size.
 * @throws {AssertNotEmptyFailedError} If the value is empty.
 * @throws {AssertNotEmptyMaxSmallerThanMinError} If the max length is smaller than the min length.
 */
export function assertNotEmpty<T extends AssertNotEmptyValueType>(
  value: T,
  min: number = 1,
  max?: number
): asserts value is NonNullable<T> {
  if (max && max < min) {
    throw new AssertNotEmptyMaxSmallerThanMinError({
      message: `Properties invalid: Max '${max}' was smaller than min '${min}'`,
      payload: { min, max, value, type: typeof value },
    });
  }

  let length: number = 0;

  if (value === null || value === undefined) {
    throw new AssertNotEmptyFailedError({
      message: "Value was either null or undefined.",
      payload: { type: typeof value, actualValue: value },
    });
  } else if (
    typeof value === "string" ||
    Array.isArray(value) ||
    ArrayBuffer.isView(value)
  ) {
    length = (value as unknown as { length: number }).length;
  } else if (
    typeof value === "object" &&
    (value instanceof Set || value instanceof Map)
  ) {
    length = (value as Set<unknown> | Map<unknown, unknown>).size;
  } else if (typeof value === "object" && Buffer.isBuffer(value)) {
    length = (value as Buffer).length;
  } else if (typeof value === "object") {
    length = Object.keys(value).length;
  }

  if (length < min) {
    throw new AssertNotEmptyFailedError({
      message: `Value-length '${length}' was below the given min-value of '${min}'.`,
      payload: { type: typeof value, actualValue: value, min, max },
    });
  } else if (max && length > max) {
    throw new AssertNotEmptyFailedError({
      message: `Value-length '${length}' was above the given max-value of '${max}'.`,
      payload: { type: typeof value, actualValue: value, min, max },
    });
  }
}
