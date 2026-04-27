import { runAllStreamCleanupCallbacks } from "./runAllStreamCleanupCallbacks";

/**
 * Adds event listeners for process termination events.
 * @param onExitCB - The callback function to run on process exit.
 */
export const addProcessListeners = () => {
  process.once("SIGINT", runAllStreamCleanupCallbacks);
  process.once("SIGTERM", runAllStreamCleanupCallbacks);
  process.once("exit", runAllStreamCleanupCallbacks);
};
