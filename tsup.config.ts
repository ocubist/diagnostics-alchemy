import { defineConfig } from "tsup";

export default defineConfig([
  {
    // Node (server) build — full transport stack including SonicBoom / chalk
    entry: { index: "src/index.ts" },
    format: ["esm"],
    dts: true,
    clean: true,
    sourcemap: true,
    target: "es2022",
    platform: "node",
  },
  {
    // Browser build — no Node built-ins, no sonic-boom, console transport only
    entry: { browser: "src/browser.ts" },
    format: ["esm"],
    dts: true,
    clean: false, // Node build already cleaned dist/
    sourcemap: true,
    target: "es2022",
    platform: "browser",
  },
]);
