import { SynthesizedError } from "../../transmuted-errors/SynthesizedError";
import { MysticError } from "../../transmuted-errors/MysticError";

import { craftErrorTransmuter } from "./craftErrorTransmuter";
import { DetectorFunction, TransmuterFunction } from "./types";

describe("craftErrorTransmuter", () => {
  const mysticErrorTransmuter = craftErrorTransmuter(
    () => true,
    (err: any) =>
      new MysticError({
        message: "message...",
        name: "name...",
        origin: err,
      })
  );

  const doNothingTransmuter = craftErrorTransmuter(
    () => false,
    (err: any) =>
      new SynthesizedError({
        message: "message...",
        name: "name...",
        origin: err,
      })
  );

  const err = new Error("Test");

  it("should create a Transmuter with specified functions", () => {
    expect(
      DetectorFunction.safeParse(mysticErrorTransmuter.detect).success
    ).toBe(true);
    expect(
      TransmuterFunction.safeParse(mysticErrorTransmuter.transmute).success
    ).toBe(true);
    expect(mysticErrorTransmuter.execute(err)).toBeInstanceOf(MysticError);
    expect(doNothingTransmuter.execute(err)).toBe(err);
  });

  // Add more tests to check the behavior of detect, transmute, and execute functions
});
