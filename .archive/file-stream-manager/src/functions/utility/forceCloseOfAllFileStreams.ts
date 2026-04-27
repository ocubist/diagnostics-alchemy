import { useErrorAlchemy } from "@ocubist/error-alchemy";
import { useFileStreamManagerSingleton } from "../../config/useFileStreamManagerSingleton";
import { getAllFileStreamSingletonKeys } from "../../helpers/getAllFileStreamSingletonKeys";
import { OpenFileStreamSingletonObject } from "../../types/OpenFIleStreamSingletonObject";
import { ensureNodeEnvironment } from "../../helpers/ensureNodeEnvironment";

const { getSingleton, removeSingleton } = useFileStreamManagerSingleton();

const { craftMysticError } = useErrorAlchemy(
  "file-stream-manager",
  "forceCloseOfAllFileStreams"
);

const ForceCloseOfAllFileStreamsFailedError = craftMysticError({
  name: "ForceCloseOfAllFileStreamsFailedError",
  severity: "critical",
});

/**
 * Forces the closure of all active file streams.
 * Used typically for cleanup or shutdown processes to ensure that all file streams
 * are properly closed and resources are released.
 *
 * @throws {NotNodeEnvironmentError} Thrown if the environment is not a Node.js server.
 * @throws {ForceCloseOfAllFileStreamsFailedError} Thrown if an unexpected error occurs while forcing the closure of file streams.
 */
export const forceCloseOfAllFileStreams = () => {
  ensureNodeEnvironment();

  try {
    getAllFileStreamSingletonKeys().forEach(async (key) => {
      const instance =
        getSingleton<OpenFileStreamSingletonObject>(key).instance;
      instance.end();
      removeSingleton(key);
    });
  } catch (err) {
    throw new ForceCloseOfAllFileStreamsFailedError({
      message:
        "Something unexpected happened while closing all FileStreams by force",
      origin: err,
    });
  }
};
