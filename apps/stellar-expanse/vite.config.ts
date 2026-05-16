import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const appDir = path.dirname(fileURLToPath(new URL(import.meta.url)));

export default defineConfig({
  root: appDir,
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@bioscope3d/workspace-ui-locale": fileURLToPath(
        new URL("../../packages/workspace-ui-locale/src/index.ts", import.meta.url)
      ),
    },
  },
  server: {
    port: 5174,
    strictPort: false,
    host: "127.0.0.1",
    open: "http://127.0.0.1:5174/",
  },
  build: {
    target: "es2022",
    sourcemap: true,
  },
});
