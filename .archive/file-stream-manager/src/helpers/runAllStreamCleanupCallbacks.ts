import { useFileStreamManagerSingleton } from "../config/useFileStreamManagerSingleton";
import { getAllFileStreamSingletonKeys } from "../helpers/getAllFileStreamSingletonKeys";
import { OpenFileStreamSingletonObject } from "../types/OpenFIleStreamSingletonObject";

const { getSingleton } = useFileStreamManagerSingleton();

/**
 * Runs the cleanup callback for all open file streams.
 */
export const runAllStreamCleanupCallbacks = () => {
  const keys = getAllFileStreamSingletonKeys();
  keys.forEach((key) => {
    const { onExitCB } = getSingleton<OpenFileStreamSingletonObject>(key);
    onExitCB();
  });
};
