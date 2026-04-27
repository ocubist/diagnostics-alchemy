import { SynthesizedError } from "./SynthesizedError";
import { TransmutedError } from "./TransmutedError";

describe("SynthesizedError", () => {
  test("Should be a valid SynthesizedError", () => {
    const error = new SynthesizedError({
      message: "Test-SynthesizedError-Message",
      name: "Test-SynthesizedError",
    });

    expect(error).toBeInstanceOf(SynthesizedError);
    expect(error).toBeInstanceOf(TransmutedError);
  });
});
