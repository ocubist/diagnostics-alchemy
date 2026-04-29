import SonicBoom from "sonic-boom";
import type { LogEntry, OutputRestriction } from "../types";
import { formatNodeEntry } from "../formatters/formatNodeEntry";
import type { Transport } from "./types";

/**
 * Node.js transport:
 * - Writes chalk-formatted lines to `process.stdout`
 * - Optionally writes newline-delimited JSON to a file via SonicBoom
 *
 * SonicBoom is used for file writing because it buffers writes asynchronously
 * and exposes a synchronous flush (`flushSync`) that is safe to call on process exit —
 * preventing silent log loss that plain `fs.writeFile` callbacks cannot guarantee.
 *
 * `process.once` (not `on`) is used for signal handlers to avoid listener leaks when
 * multiple transports are created. `destroy()` closes the underlying file descriptor so
 * the event loop is not kept alive after the transport is no longer needed.
 */
export class NodeTransport implements Transport {
  private readonly boom: SonicBoom | null;

  constructor(filePath: string | undefined, logOutput: OutputRestriction) {
    const needsFile = logOutput === "file" || logOutput === "all";
    if (needsFile && filePath) {
      this.boom = new SonicBoom({ dest: filePath, sync: false, mkdir: true });
      process.once("exit",   () => { this.boom?.flushSync(); this.boom?.destroy(); });
      process.once("SIGINT",  () => { this.boom?.flushSync(); this.boom?.destroy(); process.exit(0); });
      process.once("SIGTERM", () => { this.boom?.flushSync(); this.boom?.destroy(); process.exit(0); });
    } else {
      this.boom = null;
    }
  }

  write(entry: LogEntry, logOutput: OutputRestriction): void {
    if (logOutput === "stdOut" || logOutput === "all") {
      process.stdout.write(formatNodeEntry(entry) + "\n");
    }

    if ((logOutput === "file" || logOutput === "all") && this.boom) {
      this.boom.write(JSON.stringify(entry) + "\n");
    }
  }

  flushSync(): void {
    this.boom?.flushSync();
  }

  destroy(): void {
    this.boom?.flushSync();
    this.boom?.destroy();
  }
}
