import { useErrorAlchemy } from "../../../crafting/useErrorAlchemy/useErrorAlchemy";

const { craftMysticError } = useErrorAlchemy(
  "ErrorAlchemy",
  "assertTruthy-function"
);

/**
 * Type for AssertTruthyFailedError.
 */
export type AssertTruthyFailedError = InstanceType<
  ReturnType<typeof craftMysticError>
>;

export const AssertTruthyFailedError = craftMysticError({
  name: "AssertTruthyFailedError",
  errorCode: "DATA_INTEGRITY_VIOLATION",
  severity: "critical",
  reason: "value was falsy",
});

/**
 * Asserts that a given value is truthy.
 * @param {T} value - The value to be checked for truthiness.
 * @throws {AssertTruthyFailedError} If the value is falsy.
 */
export function assertTruthy<T>(value: T): asserts value is NonNullable<T> {
  if (!value) {
    throw new AssertTruthyFailedError({
      message: `Assertion failed. Expected a truthy value.`,
      payload: { value, type: typeof value },
    });
  }
}
