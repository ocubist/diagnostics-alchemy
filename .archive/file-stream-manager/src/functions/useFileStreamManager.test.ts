import { delay } from "@ocubist/utils";
import path from "path";
import { getAllFileStreamSingletonKeys } from "../helpers/getAllFileStreamSingletonKeys";
import {
  defaultLoremIpsumContent,
  firstWord,
  testFilesFolderPath,
} from "../tests/globalSetup";
import { useFileStreamManager } from "./useFileStreamManager";

// Extend Jest matchers to include the custom matcher
declare global {
  namespace jest {
    interface Matchers<R> {
      toStartWith(argument: string): R;
    }
  }
}

expect.extend({
  toStartWith(received: string, argument: string) {
    const pass = received.startsWith(argument);
    if (pass) {
      return {
        message: () => `expected ${received} not to start with ${argument}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to start with ${argument}`,
        pass: false,
      };
    }
  },
});

jest.setTimeout(60000);

describe("test useFileStreamManager-functions", () => {
  const useFileStreamTestPath = path.resolve(
    testFilesFolderPath,
    `useFileStreamManager.txt`
  );

  const { open, close, read, write, flush, subscribe, unsubscribe } =
    useFileStreamManager(useFileStreamTestPath);

  test("open, write, read, flush and close", async () => {
    await open();
    write(defaultLoremIpsumContent);
    await delay(1000);
    flush();
    // writeFileStream(useFileStreamTestPath, defaultLoremIpsumContent);
    // flushFileStream(useFileStreamTestPath);
    await delay(1000);
    expect(await read()).toStartWith(firstWord);
    await close();
    await delay(1000);
  });

  test("subscribe and unsubscribe", async () => {
    await subscribe();
    await unsubscribe();
    expect(getAllFileStreamSingletonKeys()).not.toContain(
      useFileStreamTestPath
    );
  });
});
