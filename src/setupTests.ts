// src/setupTests.ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Bersihkan DOM setelah setiap test
afterEach(() => {
  cleanup();
});
