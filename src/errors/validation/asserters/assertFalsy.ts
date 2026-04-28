import { useErrorAlchemy } from "../../crafting/useErrorAlchemy/useErrorAlchemy";

const { craftMysticError } = useErrorAlchemy("diagnostics-alchemy", "assertFalsy");

export const AssertFalsyFailedError = craftMysticError({
  name: "AssertFalsyFailedError",
  errorCode: "DATA_INTEGRITY_VIOLATION",
  severity: "critical",
  reason: "Value was truthy",
});

export type AssertFalsyFailedError = InstanceType<typeof AssertFalsyFailedError>;

export type Falsy<T> = T extends false | "" | 0 | null | undefined ? T : never;

/** Asserts that `value` is falsy. */
export function assertFalsy<T>(value: T): asserts value is Falsy<T> {
  if (value) {
    throw new AssertFalsyFailedError({
      message: "Falsy-assertion failed: value was truthy.",
      payload: { value, type: typeof value },
    });
  }
}
