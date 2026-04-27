import { config } from "../../config/config";
import { ensureNodeEnvironment } from "../../helpers/ensureNodeEnvironment";
import { getAllFileStreamSingletonKeys } from "../../helpers/getAllFileStreamSingletonKeys";

/**
 * Retrieves a list of all currently open file streams by their file paths.
 * @returns {string[]} An array of file paths for the currently open file streams.
 * @throws {NotNodeEnvironmentError} Thrown if the environment is not a Node.js server.
 */
export const getOpenFileStreams = (): string[] => {
  ensureNodeEnvironment();

  const openKeys = getAllFileStreamSingletonKeys();
  return openKeys.map((key) =>
    key.replace(config.openStreamSingletonKeyPrefix, "")
  );
};
