import z from "zod";

import { MysticError } from "../../../transmuted-errors/MysticError";

import { assert } from "./assert";

describe("assertFunction tests", () => {
  const StringSchema = z.string();
  const NumberSchema = z.number();

  it("should pass for the two valid values", () => {
    expect(() => {
      assert("string", StringSchema);
    }).not.toThrow();

    expect(() => {
      assert("", StringSchema);
    }).not.toThrow();
  });

  it("should throw MysticErrors for invalid data", () => {
    expect(() => {
      // @ts-ignore
      assert(2, StringSchema);
    }).toThrow(MysticError);
    expect(() => {
      // @ts-ignore
      assert("string", NumberSchema);
    }).toThrow(MysticError);
    expect(() => {
      // @ts-ignore
      assert(123, StringSchema);
    }).toThrow(MysticError);
  });
});
