// detectANSISupport.ts

import { isDevelopment } from "../nodeDetector/isDevelopment";

/**
 * Asynchronously detects if ANSI colors are supported in the current environment.
 *
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether ANSI colors are supported.
 */
export async function asyncDetectANSISupport(): Promise<boolean> {
  let supportsColorModule;

  // Dynamic import of supports-color
  try {
    // Use conditional require for CommonJS compatibility
    if (typeof require !== "undefined") {
      supportsColorModule = require("supports-color");
    }
  } catch (e) {
    if (isDevelopment()) {
      console.warn(
        "Failed to dynamically import supports-color. Proceeding with other checks..."
      );
    }
    // If import fails, we'll proceed with other checks
  }

  // Check if supports-color library detects ANSI support
  if (supportsColorModule && supportsColorModule.stdout) {
    return true;
  }

  // Browser detection (rough estimation)
  if (typeof window !== "undefined" && window.navigator) {
    const userAgent = window.navigator.userAgent;
    // Add specific browser checks as needed
    if (userAgent.includes("Chrome") || userAgent.includes("Firefox")) {
      return true;
    }
  }

  // Environment variable checks (for Unix-like systems)
  if (process.env.TERM) {
    if (
      process.env.TERM === "xterm-256color" ||
      process.env.TERM === "screen"
    ) {
      return true;
    }
  }

  // Manual override (user can set an environment variable to force-enable/disable)
  if (process.env.FORCE_ANSI_COLOR) {
    return process.env.FORCE_ANSI_COLOR !== "0";
  }

  // Default to false if none of the above checks succeed
  return false;
}
