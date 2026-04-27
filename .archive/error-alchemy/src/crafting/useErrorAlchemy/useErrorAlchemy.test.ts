import { MysticError } from "../../transmuted-errors/MysticError";
import { SynthesizedError } from "../../transmuted-errors/SynthesizedError";
import { TransmutedError } from "../../transmuted-errors/TransmutedError";
import { craftMysticError } from "../craft-errors/craftMysticError";
import { craftSynthesizedError } from "../craft-errors/craftSynthesizedError";
import { useErrorAlchemy } from "./useErrorAlchemy";

describe("useErrorAlchemy should provide all the crafting tools and set the module and context correctly on all errors produced by it's tools", () => {
  it("should set the module and context of the crafted errors correctly", () => {
    const a = useErrorAlchemy("M", "C");
    const S = a.craftSynthesizedError({ name: "S" });
    const s = new S({ message: "s" });
    expect(s.module).toBe("M");
    expect(s.context).toBe("C");

    const M = a.craftMysticError({ name: "M" });
    const m = new M({ message: "m" });
    expect(m.module).toBe("M");
    expect(m.context).toBe("C");
  });

  it("should set the module and context of transmuted errors correctly", () => {
    const a = useErrorAlchemy("M", "C");
    const M = craftMysticError({ name: "M" });
    const m = new M({ message: "s" });
    expect(m.context).toBeUndefined();
    const r = a
      .craftErrorTransmuter(
        () => true,
        (err) => new M({ message: "tm", origin: err })
      )
      .execute(m);
    expect((r as MysticError).module).toBe("M");
    expect((r as MysticError).context).toBe("C");

    const S = craftSynthesizedError({ name: "S", context: "SC" });
    const sr = a
      .craftErrorTransmuter(
        () => true,
        (err) => new M({ message: "tm", origin: err })
      )
      .execute(new S({ message: "s" }));
    expect((sr as SynthesizedError).context).toBe("C");
  });

  it("should set the module and context of synthesized errors correctly", () => {
    const aTransmuter = useErrorAlchemy("M1", "C1").craftErrorTransmuter(
      () => true,
      () =>
        new SynthesizedError({
          name: "S",
          message: "s",
          module: "sM",
          context: "sC",
        })
    );

    expect(aTransmuter.transmute("").module).toBe("M1");
    expect(aTransmuter.transmute("").context).toBe("C1");

    expect(
      (
        useErrorAlchemy("NM1", "NM2")
          .craftErrorSynthesizer([aTransmuter])
          .synthesize("") as TransmutedError
      ).module
    ).toBe("NM1");
  });
});
