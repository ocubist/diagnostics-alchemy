import { useErrorAlchemy } from "../../../crafting/useErrorAlchemy/useErrorAlchemy";

const { craftMysticError } = useErrorAlchemy(
  "ErrorAlchemy",
  "assertFalsy-function"
);

/**
 * Type for AssertFalsyFailedError.
 */
export type AssertFalsyFailedError = InstanceType<
  ReturnType<typeof craftMysticError>
>;

export const AssertFalsyFailedError = craftMysticError({
  name: "AssertFalsyFailedError",
  errorCode: "DATA_INTEGRITY_VIOLATION",
  severity: "critical",
  reason: "value was truthy",
});

export type Falsy<T> = T extends false | "" | 0 | null | undefined ? T : never;

/**
 * Asserts that a given value is falsy.
 * @param {T} value - The value to be checked for falsiness.
 * @throws {AssertFalsyFailedError} If the value is truthy.
 */
export function assertFalsy<T>(value: T): asserts value is Falsy<T> {
  if (value) {
    throw new AssertFalsyFailedError({
      message: `Assertion failed. Expected a falsy value.`,
      payload: { value, type: typeof value },
    });
  }
}
