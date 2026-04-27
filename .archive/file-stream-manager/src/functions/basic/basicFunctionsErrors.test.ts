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
import {
  FileStreamDoesNotProvideCounterError,
  FileStreamToReadCounterDoesNotExistError,
  getFileStreamUsageCount,
} from "./getFileStreamUsageCount";

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

describe("test fileHandle-Functions errors", () => {
  const errorTestPath = path.resolve(testFilesFolderPath, `ErrorsTest.txt`);

  test("provoke FileStreamNotFoundError for closeFileStream", async () => {
    try {
      await closeFileStream("does not exist");
    } catch (error) {
      expect(error).toBeInstanceOf(FileStreamNotFoundError);
    }
  });

  test("provoke FileStreamToUnsubscribeDoesNotExist for unsubscribeFromFileStream", async () => {
    try {
      await unsubscribeFromFileStream("does not exist");
    } catch (error) {
      expect(error).toBeInstanceOf(FileStreamToUnsubscribeDoesNotExist);
    }
  });

  test("provoke NoSubscriptionsFoundError for unsubscribeFromFileStream", async () => {
    await openFileStream(errorTestPath);

    try {
      await unsubscribeFromFileStream(errorTestPath);
    } catch (error) {
      expect(error).toBeInstanceOf(NoSubscriptionsFoundError);
    }

    await delay(1000);

    await closeFileStream(errorTestPath);
    await delay(1000);
  });

  test("provoke FileStreamToFlushDoesNotExistError for flushFileStream", async () => {
    try {
      flushFileStream("nope");
    } catch (err) {
      expect(err).toBeInstanceOf(FileStreamToFlushDoesNotExistError);
    }
  });

  test("provoke FileToReadDoesNotExistError for readFileStream", async () => {
    try {
      await readFileStream("nope");
    } catch (err) {
      expect(err).toBeInstanceOf(FileToReadDoesNotExistError);
    }
  });

  test("provoke FileStreamToWriteDoesNotExistError for writeFileStream", async () => {
    try {
      writeFileStream("nope", "");
    } catch (err) {
      expect(err).toBeInstanceOf(FileStreamToWriteDoesNotExistError);
    }
  });

  test("provoke FileStreamToOpenAlreadyOpenError for openFileStream", async () => {
    try {
      await openFileStream(errorTestPath);
      await openFileStream(errorTestPath);
    } catch (err) {
      expect(err).toBeInstanceOf(FileStreamToOpenAlreadyOpenError);
      await closeFileStream(errorTestPath);
    }
  });

  test("provoke FileStreamToReadCounterDoesNotExistError for getFileStreamUsageCount", async () => {
    try {
      getFileStreamUsageCount("does not exist");
    } catch (error) {
      expect(error).toBeInstanceOf(FileStreamToReadCounterDoesNotExistError);
    }
  });

  test("provoke FileStreamDoesNotProvideCounterError for getFileStreamUsageCount", async () => {
    const errorTestPath = path.resolve(testFilesFolderPath, `ErrorsTest.txt`);
    await openFileStream(errorTestPath);

    try {
      getFileStreamUsageCount(errorTestPath);
    } catch (error) {
      expect(error).toBeInstanceOf(FileStreamDoesNotProvideCounterError);
    }

    await closeFileStream(errorTestPath);
  });
});
