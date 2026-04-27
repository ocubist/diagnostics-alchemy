import { createOpenFileStreamKey } from "../../helpers/createOpenFileStreamKey";
import { getAllFileStreamSingletonKeys } from "../../helpers/getAllFileStreamSingletonKeys";
import { ensureNodeEnvironment } from "../../helpers/ensureNodeEnvironment";

/**
 * Checks if a specific file stream is currently open.
 * @param {string} filePath - The path to the file stream.
 * @returns {boolean} True if the file stream is open, otherwise false.
 * @throws {NotNodeEnvironmentError} Thrown if the environment is not a Node.js server.
 */
export const isFileStreamOpen = (filePath: string): boolean => {
  ensureNodeEnvironment();

  const key = createOpenFileStreamKey(filePath);
  const allKeys = getAllFileStreamSingletonKeys();

  return allKeys.includes(key);
};
