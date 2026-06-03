import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const appDir = path.dirname(fileURLToPath(new URL(import.meta.url)));
const base = process.env.VITE_BASE_PATH ?? "/";

export default defineConfig({
  base,
  root: appDir,
  plugins: [react()],
  resolve: {
    alias: {
      "@":            fileURLToPath(new URL("./src", import.meta.url)),
      "@components":  fileURLToPath(new URL("./src/components", import.meta.url)),
      "@stores":      fileURLToPath(new URL("./src/stores", import.meta.url)),
      "@data":        fileURLToPath(new URL("./src/data", import.meta.url)),
      "@hooks":       fileURLToPath(new URL("./src/hooks", import.meta.url)),
      "@lib":         fileURLToPath(new URL("./src/lib", import.meta.url)),
      "@3d":          fileURLToPath(new URL("./src/3d", import.meta.url)),
      "@bioscope3d/workspace-ui-locale": fileURLToPath(
        new URL("../../packages/workspace-ui-locale/src/index.ts", import.meta.url)
      ),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    host: "127.0.0.1",
    open: "http://127.0.0.1:5173/",
  },
  build: {
    target: "es2022",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three:    ["three"],
          r3f:      ["@react-three/fiber", "@react-three/drei", "@react-three/postprocessing"],
          modelviewer: ["@google/model-viewer"],
          motion:   ["framer-motion"],
        },
      },
    },
  },
  assetsInclude: ["**/*.glb", "**/*.gltf", "**/*.hdr"],
});
