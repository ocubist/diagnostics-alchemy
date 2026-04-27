import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    exclude: ["src/play/**", "src/**/*.play.ts"],
    globalSetup: ["src/tests/globalSetup.ts"],
  },
});
