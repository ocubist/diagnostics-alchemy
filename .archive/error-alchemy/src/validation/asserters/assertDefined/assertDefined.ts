import { useErrorAlchemy } from "../../../crafting/useErrorAlchemy/useErrorAlchemy";

const { craftMysticError } = useErrorAlchemy(
  "ErrorAlchemy",
  "assertDefined-function"
);

/**
 * Type for AssertDefinedFailedError.
 */
export type AssertDefinedFailedError = InstanceType<
  ReturnType<typeof craftMysticError>
>;

export const AssertDefinedFailedError = craftMysticError({
  name: "AssertDefinedFailedError",
  errorCode: "DATA_INTEGRITY_VIOLATION",
  severity: "critical",
  reason: "value was null, undefined or NaN",
});

/**
 * Asserts that a value is defined and not null or NaN.
 *
 * @template T
 * @param {T | null | undefined} value - The value to assert.
 * @throws {AssertDefinedFailedError} If the value is null, undefined, or NaN.
 */
export function assertDefined<T>(
  value: T | null | undefined
): asserts value is T {
  if (value == null || (typeof value === "number" && isNaN(value))) {
    throw new AssertDefinedFailedError({
      message: "Defined-Assertion failed.",
      payload: { value, type: typeof value },
    });
  }
}
