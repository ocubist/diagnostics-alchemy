import { SynthesizedError } from "../../transmuted-errors/SynthesizedError";
import { TransmutedError } from "../../transmuted-errors/TransmutedError";
import { craftSynthesizedError } from "./craftSynthesizedError";

describe("craftSynthesizedError", () => {
  it("should create a SynthesizedError with the specified properties", () => {
    const TestSynthesizedError = craftSynthesizedError({
      name: "TestError",
    });

    const errorInstance = new TestSynthesizedError({ message: "Test message" });

    expect(errorInstance.name).toBe("TestError");
    expect(errorInstance.message).toBe("Test message");
    expect(errorInstance).toBeInstanceOf(TestSynthesizedError);
    expect(errorInstance).toBeInstanceOf(SynthesizedError);
    expect(errorInstance).toBeInstanceOf(TransmutedError);
    expect(TestSynthesizedError.compare(errorInstance)).toBe(true);
  });

  it("should have a unique dynamicClassUuid for each instance", () => {
    const SynthesizedError1 = craftSynthesizedError({
      name: "Error1",
    });

    const SynthesizedError2 = craftSynthesizedError({
      name: "Error2",
    });

    const errorInstance1 = new SynthesizedError1({ message: "Message1" });
    const errorInstance2 = new SynthesizedError2({ message: "Message2" });

    expect(errorInstance1.dynamicClassUuid).not.toBe(
      errorInstance2.dynamicClassUuid
    );
  });
});
