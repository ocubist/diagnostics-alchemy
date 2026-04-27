import { AssertTruthyFailedError, assertTruthy } from "./assertTruthy";

describe("assertTruthy tests", () => {
  test("assertTruthy does not throw error for truthy values", () => {
    expect(() => {
      assertTruthy("string");
    }).not.toThrow();

    expect(() => {
      assertTruthy(123);
    }).not.toThrow();

    expect(() => {
      assertTruthy(true);
    }).not.toThrow();

    expect(() => {
      assertTruthy({});
    }).not.toThrow();
  });

  test("assertTruthy throws AssertFailedError for falsy values", () => {
    expect(() => {
      assertTruthy(false);
    }).toThrow(AssertTruthyFailedError);

    expect(() => {
      assertTruthy(0);
    }).toThrow(AssertTruthyFailedError);

    expect(() => {
      assertTruthy("");
    }).toThrow(AssertTruthyFailedError);

    expect(() => {
      assertTruthy(null);
    }).toThrow(AssertTruthyFailedError);

    expect(() => {
      assertTruthy(undefined);
    }).toThrow(AssertTruthyFailedError);

    expect(() => {
      assertTruthy(NaN);
    }).toThrow(AssertTruthyFailedError);
  });
});
