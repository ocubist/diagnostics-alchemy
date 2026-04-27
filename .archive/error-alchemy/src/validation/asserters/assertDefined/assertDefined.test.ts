import { MysticError } from "../../../transmuted-errors/MysticError";
import { assertDefined } from "./assertDefined";

describe("assertDefined tests", () => {
  test("assertDefined does not throw error for valid defined values", () => {
    expect(() => {
      assertDefined("string");
    }).not.toThrow();

    expect(() => {
      assertDefined(123);
    }).not.toThrow();

    expect(() => {
      assertDefined(true);
    }).not.toThrow();

    expect(() => {
      assertDefined({});
    }).not.toThrow();
  });

  test("assertDefined throws AssertFailedError for null, undefined and NaN", () => {
    expect(() => assertDefined(null)).toThrow(MysticError);
    expect(() => assertDefined(undefined)).toThrow(MysticError);
    expect(() => assertDefined(NaN)).toThrow(MysticError);
  });
});
