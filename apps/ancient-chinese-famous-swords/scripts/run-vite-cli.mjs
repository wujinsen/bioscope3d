import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(path.join(appRoot, "package.json"));

function resolveViteBin() {
  const siblingBioscope = path.join(appRoot, "..", "bioscope3d", "node_modules", "vite", "bin", "vite.js");
  if (existsSync(siblingBioscope)) return siblingBioscope;

  let dir = appRoot;
  for (let i = 0; i < 10; i++) {
    const direct = path.join(dir, "node_modules", "vite", "bin", "vite.js");
    if (existsSync(direct)) return direct;
    try {
      return require.resolve("vite/bin/vite.js", { paths: [dir] });
    } catch {
      /* try parent */
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const viteJs = resolveViteBin();
if (!viteJs) {
  console.error("vite not found. From repo root run: pnpm install");
  process.exit(1);
}

const mode = process.argv[2] === "preview" ? "preview" : "dev";
const viteArgs = mode === "preview" ? ["preview"] : [];

const child = spawn(process.execPath, [viteJs, ...viteArgs], {
  cwd: appRoot,
  stdio: "inherit",
  env: process.env,
  windowsHide: true,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});
