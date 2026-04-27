import { runAllStreamCleanupCallbacks } from "./runAllStreamCleanupCallbacks";

/**
 * Removes event listeners for process termination events.
 * @param onExitCB - The callback function to remove.
 */
export const removeProcessListeners = () => {
  process.removeListener("SIGINT", runAllStreamCleanupCallbacks);
  process.removeListener("SIGTERM", runAllStreamCleanupCallbacks);
  process.removeListener("exit", runAllStreamCleanupCallbacks);
};
