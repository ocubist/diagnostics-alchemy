import { craftMysticError } from "../craft-errors/craftMysticError";
import { craftErrorLogger } from "./craftErrorLogger";

describe("Make sure the ErrorLogger works as intended.", () => {
  it("should use the default-logger", () => {
    let defWorks: string = "does not work";
    const errLogger = craftErrorLogger({
      default: () => (defWorks = "works"),
    });

    errLogger(new Error());
    expect(defWorks).toBe("works");
  });

  it("should use the specifiedLogger, only if it exists", () => {
    let s = "does not work";
    const errLogger = craftErrorLogger({
      critical: () => (s = "criticalWorks"),
      default: () => (s = "defaultWorks"),
    });

    const MCritical = craftMysticError({
      name: "MCritical",
      severity: "critical", // Make sure this matches a key in CraftErrorLoggerProps
    });
    const mc = new MCritical({ message: "bla" });

    const MFatal = craftMysticError({
      name: "MFatal",
      severity: "fatal", // Make sure this matches a key in CraftErrorLoggerProps
    });

    const mf = new MFatal({ message: "bla" });

    errLogger(mc);
    expect(s).toBe("criticalWorks");
    errLogger(mf);
    expect(s).toBe("defaultWorks");
  });
});
