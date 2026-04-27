import { closeFileStream } from "./basic/closeFileStream";
import { flushFileStream } from "./basic/flushFileStream";
import { openFileStream } from "./basic/openFileStream";
import { readFileStream } from "./basic/readFileStream";
import { writeFileStream } from "./basic/writeFileStream";
import { subscribeToFileStream } from "./basic/subscribeToFileStream";
import { unsubscribeFromFileStream } from "./basic/unsubscribeFromFileStream";
import { ensureNodeEnvironment } from "../helpers/ensureNodeEnvironment";
import { getFileStreamUsageCount } from "./basic/getFileStreamUsageCount";
import { isFileStreamOpen } from "./basic/isFileStreamOpen";

/**
 * Provides file stream management functionalities.
 * This function returns an object that offers various methods to manage a file stream,
 * including opening, closing, reading, writing, flushing, subscribing, unsubscribing from the stream,
 * getting the usage count of the stream, and checking if a stream is open.
 *
 * @param {string} filePath - The path of the file to manage.
 * @returns {Object} An object with the following file stream management functions:
 *
 * @property {() => Promise<void>} open - Opens the file stream.
 *  Internally calls {@link openFileStream}. Throws errors if the environment is not Node.js or if the file stream fails to open.
 *
 * @property {() => Promise<void>} close - Closes the file stream.
 *  Internally calls {@link closeFileStream}. Throws errors if the environment is not Node.js or if the file stream fails to close.
 *
 * @property {(data: string) => boolean} write - Writes data to the file stream.
 *  Internally calls {@link writeFileStream}. Throws errors if the environment is not Node.js or if the file stream does not exist or fails to write.
 *
 * @property {() => Promise<string>} read - Reads the content of the file stream.
 *  Internally calls {@link readFileStream}. Throws errors if the environment is not Node.js or if the file does not exist or fails to read.
 *
 * @property {() => void} flush - Flushes the file stream, ensuring all buffered data is written to the file.
 *  Internally calls {@link flushFileStream}. Throws errors if the environment is not Node.js or if the file stream does not exist or fails to flush.
 *
 * @property {() => Promise<void>} subscribe - Subscribes to the file stream, incrementing its usage counter.
 *  Internally calls {@link subscribeToFileStream}. Throws errors if the environment is not Node.js or if subscribing fails.
 *
 * @property {() => Promise<void>} unsubscribe - Unsubscribes from the file stream, decrementing its usage counter.
 *  Internally calls {@link unsubscribeFromFileStream}. Closes the stream if the counter reaches zero.
 *  Throws errors if the environment is not Node.js or if unsubscribing fails.
 *
 * @property {() => number} getUsageCount - Retrieves the usage count (subscription count) for the file stream.
 *  Internally calls {@link getFileStreamUsageCount}. Throws errors if the environment is not Node.js or if the file stream does not exist or does not provide a counter.
 *
 * @property {() => boolean} isFileStreamOpen - Checks if the file stream is currently open.
 *  Internally calls {@link isFileStreamOpen}. Throws errors if the environment is not Node.js.
 *
 * @throws {NotNodeEnvironmentError} Thrown if the environment is not a Node.js server.
 */
export const useFileStreamManager = (filePath: string) => {
  ensureNodeEnvironment();

  return {
    open: async () => await openFileStream(filePath),
    close: async () => await closeFileStream(filePath),
    write: (data: string) => writeFileStream(filePath, data),
    read: async () => await readFileStream(filePath),
    flush: () => flushFileStream(filePath),
    subscribe: async () => await subscribeToFileStream(filePath),
    unsubscribe: async () => await unsubscribeFromFileStream(filePath),
    getUsageCount: () => getFileStreamUsageCount(filePath),
    isFileStreamOpen: () => isFileStreamOpen(filePath),
  };
};
