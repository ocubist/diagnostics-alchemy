import { errorCodeSelector } from "./errorCodeSelector";
import { isErrorCode } from "./isErrorCode";

describe("isErrorCode", () => {
  test("true ErrorCodes", () => {
    expect(isErrorCode("DATA_INTEGRITY_VIOLATION")).toBe(true);
    expect(isErrorCode(errorCodeSelector.AUTH_INSUFFICIENT_PERMISSION)).toBe(
      true
    );
  });

  test("wrong ErrorCodes", () => {
    expect(isErrorCode("nope")).toBe(false);
  });
});
