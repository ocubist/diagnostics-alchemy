import {
  getAllSingletonKeys,
  getSingleton,
  setSingleton,
} from "@ocubist/singleton-manager";
import * as ex from "../src/index";
import { logger } from "../src/index";
import { ansify } from "@ocubist/utils";

function waitFiveSeconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Waited for 5 seconds");
    }, 5000);
  });
}

logger.info("0", { keys: getAllSingletonKeys() });

logger.overrideConfigurations({
  filePaths: ["./logs/log.log"],
  restrictions: {
    logOutput: "all",
    environment: "all",
    runtimeEnvironment: "all",
  },
});

logger.info("1", { keys: getAllSingletonKeys() });
const weakMap = new WeakMap();
(() => {
  const spLogger = logger.specialize(
    { name: "bla" },
    { filePaths: ["./logs/log2.log"] }
  );
  weakMap.set({}, {});

  spLogger.info("2", { keys: getAllSingletonKeys() });
})();

console.log(weakMap.has({}));

waitFiveSeconds().then(() => {
  logger.info("3", { keys: getAllSingletonKeys() });
});

// console.log(logger);

// logger.info("Just a Test...");

// const spz = logger.specialize({ name: "even more..." });

// getAllSingletonKeys().forEach((key) => {
//   console.log(`Key: ${key}, Val:`, getSingleton(key));
// });

// for (let i = 0; i < 10; i++) {
//   const nl = logger.specialize({ name: i.toString() });

//   for (let i = 0; i < 5; i++) {
//     nl.info("All Exports", {
//       exportsOftenStressTest: [
//         ex,
//         ex,
//         ex,
//         ex,
//         ex,
//         ex,
//         ex,
//         ex,
//         ex,
//         ex,
//         ex,
//         ex,
//         ex,
//         ex,
//         ex,
//         ex,
//       ],
//     });
//   }
// }

// logger.info("logger", new Error("test-error"), { a: "A", b: "B" });

// const traceLogger = logger.specialize(
//   { name: "traceLogger" },
//   {
//     level: "trace",
//   }
// );

// traceLogger.trace("trace");

// console.log(`All exports`, ex);

// setSingleton("a", "A");

// console.log(getSingleton("a"));

// logger.trace("should be ignored");

// console.log("logger:", { config: logger.config });

// const specializedLogger = logger.specialize(
//   { name: "sp1" },
//   { apiUrl: "apiUrl", filePath: "filePath" }
// );

// console.log("specializedLogger", {
//   config: specializedLogger.config,
//   spez: specializedLogger.config.specializations,
// });

// specializedLogger.info("specializedLogger");

// const traceLogger = specializedLogger.specialize(
//   { name: "awesome!" },
//   { redactList: ["oink"], level: "trace" }
// );

// console.log("traceLogger:", {
//   config: traceLogger.config,
//   spez: traceLogger.config.specializations,
// });

// traceLogger.trace("traceLogger");

// console.log(ansify.red("test"));

// Usage
waitFiveSeconds().then(() => waitFiveSeconds());
