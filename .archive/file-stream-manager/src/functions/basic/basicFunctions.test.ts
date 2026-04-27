import { delay } from "@ocubist/utils";
import {
  firstWord,
  loremIpsumPath,
  hundredTestFilePaths,
  clearTestFiles,
  defaultLoremIpsumContent,
  testFilesFolderPath,
} from "../../tests/globalSetup";
import { promises as fs } from "fs";
import path from "path";
import { getAllFileStreamSingletonKeys } from "../../helpers/getAllFileStreamSingletonKeys";
import { createOpenFileStreamKey } from "../../helpers/createOpenFileStreamKey";
import {
  FileStreamToOpenAlreadyOpenError,
  openFileStream,
} from "./openFileStream";
import {
  FileStreamToWriteDoesNotExistError,
  writeFileStream,
} from "./writeFileStream";
import { FileToReadDoesNotExistError, readFileStream } from "./readFileStream";
import {
  FileStreamToFlushDoesNotExistError,
  flushFileStream,
} from "./flushFileStream";
import { closeFileStream, FileStreamNotFoundError } from "./closeFileStream";
import { subscribeToFileStream } from "./subscribeToFileStream";
import { useFileStreamManagerSingleton } from "../../config/useFileStreamManagerSingleton";
import { OpenFileStreamSingletonObject } from "../../types/OpenFIleStreamSingletonObject";
import {
  unsubscribeFromFileStream,
  NoSubscriptionsFoundError,
  FileStreamToUnsubscribeDoesNotExist,
} from "./unsubscribeFromFileStream";
import { getFileStreamUsageCount } from "./getFileStreamUsageCount";
import { isFileStreamOpen } from "./isFileStreamOpen";

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

describe("test fileHandle-Functions", () => {
  test("file automatically created when opening file and check isFileStreamOpen", async () => {
    try {
      await fs.access(loremIpsumPath);
      throw "file should not exist";
    } catch {}

    await openFileStream(loremIpsumPath);

    try {
      await fs.access(loremIpsumPath);
    } catch {
      throw "file should exist";
    }

    expect(getAllFileStreamSingletonKeys()).toContain(
      createOpenFileStreamKey(loremIpsumPath)
    );

    expect(isFileStreamOpen(loremIpsumPath)).toBe(true);
    expect(isFileStreamOpen("nope")).toBe(false);
  });

  test("write-, flush-, read- and close-function", async () => {
    writeFileStream(loremIpsumPath, defaultLoremIpsumContent);
    flushFileStream(loremIpsumPath);

    expect(getAllFileStreamSingletonKeys()).toContain(
      createOpenFileStreamKey(loremIpsumPath)
    );

    await closeFileStream(loremIpsumPath);

    expect(getAllFileStreamSingletonKeys()).not.toContain(
      createOpenFileStreamKey(loremIpsumPath)
    );

    await delay(10000);

    const loremContent = await readFileStream(loremIpsumPath);

    expect(loremContent).toStartWith(firstWord);
  });

  test("subscribe- and unsubscribe-function", async () => {
    const { getSingleton } = useFileStreamManagerSingleton();

    const entries: OpenFileStreamSingletonObject[] = [];

    let allKeys = getAllFileStreamSingletonKeys();

    for (const path of hundredTestFilePaths) {
      expect(allKeys).not.toContain(createOpenFileStreamKey(path));
      for (let i = 0; i < 100; i++) {
        await subscribeToFileStream(path);
      }

      const singletonEntry = getSingleton<OpenFileStreamSingletonObject>(
        createOpenFileStreamKey(path)
      );
      entries.push(singletonEntry);
    }

    allKeys = getAllFileStreamSingletonKeys();

    allKeys.forEach((key) => {
      expect(allKeys).toContain(key);
    });

    hundredTestFilePaths.forEach((path) => {
      expect(getFileStreamUsageCount(path)).toBe(100);
    });

    entries.forEach((entry) => {
      expect(entry.counter).toBe(100);
    });

    for (const path of hundredTestFilePaths) {
      for (let i = 0; i < 50; i++) {
        await unsubscribeFromFileStream(path);
      }
    }

    entries.forEach((entry) => {
      expect(entry.counter).toBe(50);
    });

    for (const path of hundredTestFilePaths) {
      for (let i = 0; i < 50; i++) {
        await unsubscribeFromFileStream(path);
      }
    }

    allKeys = getAllFileStreamSingletonKeys();

    allKeys.forEach((key) => {
      expect(allKeys).not.toContain(key);
    });
  });
});
