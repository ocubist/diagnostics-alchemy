import z from "zod";

import { ParseFailedError, parse } from "./parse";

describe("parse tests", () => {
  const StringSchema = z.string();
  const NumberSchema = z.number();

  test("parse correctly validates matching types", () => {
    expect(() => {
      parse("string", StringSchema);
    }).not.toThrow();

    expect(() => {
      parse(123, NumberSchema);
    }).not.toThrow();
  });

  test("parse throws ParseFailedError for mismatched types", () => {
    expect(() => {
      // @ts-ignore
      parse("string", NumberSchema);
    }).toThrow(ParseFailedError);

    expect(() => {
      // @ts-ignore
      parse(123, StringSchema);
    }).toThrow(ParseFailedError);
  });
});
