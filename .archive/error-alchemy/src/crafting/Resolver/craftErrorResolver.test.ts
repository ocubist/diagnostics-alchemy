import { craftMysticError } from "../craft-errors/craftMysticError";
import { craftSynthesizedError } from "../craft-errors/craftSynthesizedError";
import { craftErrorTransmuter } from "../Transmuter/craftErrorTransmuter";
import { craftErrorSynthesizer } from "../Synthesizer/craftErrorSynthesizer";
import { craftErrorLogger } from "./craftErrorLogger";
import { craftErrorResolverMap } from "./craftErrorResolverMap";
import { craftErrorResolver } from "./craftErrorResolver";

describe("CraftErrorResolver should craft a valid resolver, that works itself through the whole chain", () => {
  const M1 = craftMysticError({ name: "M1" });
  const S1 = craftSynthesizedError({ name: "S1" });

  const transmuteM1toS1 = craftErrorTransmuter(
    (err) => M1.compare(err),
    (err) => new S1({ message: "s1", origin: err })
  );

  let loggerOutput = "notTouched";
  let resolverOutput = "notTouched";
  let defaultResolverOutput = "notTouched";

  const reset = () => {
    loggerOutput = "notTouched";
    resolverOutput = "notTouched";
    defaultResolverOutput = "notTouched";
  };

  const synthesizer = craftErrorSynthesizer([transmuteM1toS1]);

  const errLogger = craftErrorLogger({
    default: (err: any) => (loggerOutput = err.message),
  });

  const errMap = craftErrorResolverMap([
    S1,
    (err) => (resolverOutput = err.message),
  ]);

  const resolve = craftErrorResolver({
    defaultResolver: (err: any) => (defaultResolverOutput = err.message),
    logger: errLogger,
    errorResolverMap: errMap,
    synthesizer,
  });

  it("should use the logger, synthesizer, resolverMap and ignore defaultResolver", () => {
    reset();
    resolve(new M1({ message: "m1" }));
    expect(loggerOutput).toBe("s1");
    expect(resolverOutput).toBe("s1");
    expect(defaultResolverOutput).toBe("notTouched");
  });

  it("should use the the logger, don't trigger the synthesizer, don't trigger the resolveMap and use the defaultResolver", () => {
    reset();
    resolve(new Error("bla"));
    expect(loggerOutput).toBe("bla");
    expect(resolverOutput).toBe("notTouched");
    expect(defaultResolverOutput).toBe("bla");
  });
});
