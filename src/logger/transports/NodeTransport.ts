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
 */
export class NodeTransport implements Transport {
  private readonly boom: SonicBoom | null;

  constructor(filePath: string | undefined, logOutput: OutputRestriction) {
    const needsFile = logOutput === "file" || logOutput === "all";
    if (needsFile && filePath) {
      this.boom = new SonicBoom({ dest: filePath, sync: false, mkdir: true });
      // Ensure buffered data is not lost when the process exits.
      process.on("exit", () => this.flushSync());
      process.on("SIGINT", () => {
        this.flushSync();
        process.exit(0);
      });
      process.on("SIGTERM", () => {
        this.flushSync();
        process.exit(0);
      });
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
}
