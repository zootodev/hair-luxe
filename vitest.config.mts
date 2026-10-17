import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx}"],
    // jsdom + parallel worker startup on slow machines can exceed the 5s default.
    testTimeout: 30000,
    // Guarantees no test can reach a real store (Postgres / KV / Redis).
    setupFiles: ["./tests/setup.ts"],
  },
});
