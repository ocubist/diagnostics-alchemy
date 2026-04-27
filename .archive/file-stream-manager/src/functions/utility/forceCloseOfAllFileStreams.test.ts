import { delay } from "@ocubist/utils";
import { getAllFileStreamSingletonKeys } from "../../helpers/getAllFileStreamSingletonKeys";
import {
  defaultLoremIpsumContent,
  firstWord,
  hundredTestFilePaths,
} from "../../tests/globalSetup";
import { forceCloseOfAllFileStreams } from "./forceCloseOfAllFileStreams";
import { openFileStream } from "../basic/openFileStream";
import { readFileStream } from "../basic/readFileStream";
import { writeFileStream } from "../basic/writeFileStream";
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

describe("forceCloseOfAllFileStreams", () => {
  test("forceCloseOfAllFileStreams to close and flush all fileStreams", async () => {
    for (const path of hundredTestFilePaths) {
      await openFileStream(path);
      writeFileStream(path, defaultLoremIpsumContent);
    }

    expect(getAllFileStreamSingletonKeys().length).toBe(100);

    await delay(4000);

    forceCloseOfAllFileStreams();

    await delay(4000);

    for (const path of hundredTestFilePaths) {
      expect(await readFileStream(path)).toStartWith(firstWord);
    }

    expect(getAllFileStreamSingletonKeys().length).toBe(0);
  });
});
