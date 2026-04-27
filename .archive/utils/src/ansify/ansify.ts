import ansiColors from "ansi-colors";
import { asyncDetectANSISupport } from "./asyncDetectANSISupport";
import { isDevelopment } from "../nodeDetector/isDevelopment";

// Initially set ansiColors.enabled to true
ansiColors.enabled = true;

/**
 * A promise that resolves when the async initialization to detect ANSI color support is complete.
 * If ANSI colors are not supported, disables ANSI coloring.
 * This is immediately invoked to start the detection process as soon as the module is imported.
 *
 * @type {Promise<void>}
 */
export const ansiInitializationPromise = (async () => {
  const supportsAnsiColors = await asyncDetectANSISupport();
  if (!supportsAnsiColors) {
    if (isDevelopment()) {
      console.log("Turn off Ansi-Coloring!");
    }
    ansiColors.enabled = false;
  }
})();

/**
 * The ansi-colors module for applying ANSI colors to strings.
 *
 * @type {import("ansi-colors")}
 */
export const ansify = ansiColors;
