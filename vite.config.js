import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["adopt-club-commodities-avatar.trycloudflare.com"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFilesAfterFramework: ["./src/tests/setup.js"],
    css: false,
  },
});
