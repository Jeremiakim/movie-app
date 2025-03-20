import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup/test-utils.tsx",
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "istanbul",
      reportsDirectory: "./tests/coverage",
    },
  },
  resolve: {
    alias: {
      "@": "/src",
      "@tests": "/tests",
    },
  },
});
