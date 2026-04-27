import { clearTestFiles, hundredTestFilePaths } from "../../tests/globalSetup";
import { closeFileStream } from "../basic/closeFileStream";
import { openFileStream } from "../basic/openFileStream";
import { getOpenFileStreams } from "./getOpenFileStreams";
import { delay } from "@ocubist/utils";

// Extend Jest matchers to include the custom matcher
declare global {
  namespace jest {
    interface Matchers<R> {
      toContainFilePath(argument: string): R;
    }
  }
}

expect.extend({
  toContainFilePath(received: string[], argument: string) {
    const pass = received.includes(argument);
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to contain file path ${argument}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to contain file path ${argument}`,
        pass: false,
      };
    }
  },
});

jest.setTimeout(60000);

describe("Test suite for opening, checking, and closing 100 test files", () => {
  beforeAll(async () => {
    await clearTestFiles(); // Ensure all test files are cleared before starting
  });

  test("Open all hundred test files and check for their entries", async () => {
    for (const filePath of hundredTestFilePaths) {
      await openFileStream(filePath);
    }

    // Allow time for all file streams to open
    await delay(1000);

    const openStreams = getOpenFileStreams();

    for (const filePath of hundredTestFilePaths) {
      expect(openStreams).toContainFilePath(filePath);
    }
  });

  test("Close all hundred test files and verify closure", async () => {
    for (const filePath of hundredTestFilePaths) {
      await closeFileStream(filePath);
    }

    // Allow time for all file streams to close
    await delay(1000);

    const openStreamsAfterClose = getOpenFileStreams();

    expect(openStreamsAfterClose.length).toBe(0);
  });
});
