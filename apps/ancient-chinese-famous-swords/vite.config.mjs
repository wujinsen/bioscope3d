import path from "node:path";
import { fileURLToPath } from "node:url";

const appDir = path.dirname(fileURLToPath(import.meta.url));

/** Plain object config — no `import from "vite"` so dev can use a sibling app's vite binary. */
export default {
  root: appDir,
  server: {
    port: 5175,
    strictPort: true,
    host: "127.0.0.1",
    open: "http://127.0.0.1:5175/",
  },
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        main: path.join(appDir, "index.html"),
        swords: path.join(appDir, "prototype.html"),
      },
    },
  },
};
