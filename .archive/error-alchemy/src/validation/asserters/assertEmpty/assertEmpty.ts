import { useErrorAlchemy } from "../../../crafting/useErrorAlchemy/useErrorAlchemy";

const { craftMysticError } = useErrorAlchemy("errorAlchemy", "assertEmpty");

/**
 * Type for AssertEmptyFailedError.
 */
export type AssertEmptyFailedError = InstanceType<
  ReturnType<typeof craftMysticError>
>;

export const AssertEmptyFailedError = craftMysticError({
  name: "AssertEmptyFailedError",
  severity: "critical",
  errorCode: "DATA_INTEGRITY_VIOLATION",
  reason: "The value was expected to be empty, but a non-empty value was found.",
});

export type AssertEmptyValueType =
  | string
  | any[]
  | ArrayBufferView
  | Set<unknown>
  | Map<unknown, unknown>
  | Buffer
  | Record<string, unknown>;

/**
 * Asserts that a given value is empty.
 * @param {T} value - The value to be checked for emptiness.
 * @throws {AssertEmptyFailedError} If the value is not empty.
 */
export function assertEmpty<T extends AssertEmptyValueType>(
  value: T
): asserts value is NonNullable<T> {
  let length: number = 0;

  if (value !== null && value !== undefined) {
    if (
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
  }

  if (length > 0) {
    throw new AssertEmptyFailedError({
      message: `Expected value to be empty, but found with length/size '${length}'.`,
      payload: { type: typeof value, actualValue: value, length },
    });
  }
}
