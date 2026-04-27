import { UrlValidationError } from "../../errors/request";
import { parseUrl } from "./parseUrl";

describe("Test function parseUrl", () => {
  const validUrl = "http://google.com";
  const invalidUrl = "12345";

  test("regular url", () => {
    expect(parseUrl(validUrl).startsWith(validUrl)).toBe(true);
  });

  test("invalid Url to throw error", () => {
    try {
      expect(parseUrl(invalidUrl));
    } catch (error) {
      expect(error).toBeInstanceOf(UrlValidationError);
    }
  });
});
