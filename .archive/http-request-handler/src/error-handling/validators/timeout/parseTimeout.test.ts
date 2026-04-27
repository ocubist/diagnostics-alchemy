import { defaultTimeout } from "../../../types/Timeout";
import { InvalidTimeoutError } from "../../errors/request";
import { parseTimeout } from "./parseTimeout";

describe("Test function parseRetryOptions", () => {
  test("regular timeouts", () => {
    expect(parseTimeout(1000)).toBe(1000);
    expect(parseTimeout(undefined)).toBe(defaultTimeout);
  });

  test("provoke Errors", () => {
    try {
      parseTimeout(0);
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidTimeoutError);
    }

    try {
      parseTimeout(99999999);
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidTimeoutError);
    }
  });
});
