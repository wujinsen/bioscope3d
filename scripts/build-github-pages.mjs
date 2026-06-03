#!/usr/bin/env node
/**
 * Local dry-run for the GitHub Pages bundle (same layout as CI).
 * Usage: pnpm build:pages
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = process.env.PAGES_REPO_NAME ?? "bioscope3d";
const ORIGIN = process.env.PAGES_ORIGIN ?? "https://wujinsen.github.io";

const env = {
  ...process.env,
  PAGES_REPO_NAME: REPO,
  GITHUB_REPOSITORY_OWNER: process.env.GITHUB_REPOSITORY_OWNER ?? "wujinsen",
  VITE_BASE_HUB: `/${REPO}/`,
  VITE_BASE_STUDIO: `/${REPO}/studio/`,
  VITE_BASE_HERITAGE: `/${REPO}/heritage/`,
  VITE_URL_BIOSCOPE3D: `${ORIGIN}/${REPO}/studio/`,
  VITE_URL_STELLAR_EXPANSE: `${ORIGIN}/${REPO}/studio/`,
  VITE_URL_HERITAGE_BASE: `${ORIGIN}/${REPO}/heritage/`,
};

function run(cmd, args, extraEnv = {}) {
  const r = spawnSync(cmd, args, {
    cwd: ROOT,
    stdio: "inherit",
    env: { ...env, ...extraEnv },
    shell: process.platform === "win32",
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

run("pnpm", ["install"]);
run("pnpm", ["-C", "apps/lab-hub", "build"], {
  VITE_BASE_PATH: env.VITE_BASE_HUB,
  VITE_URL_BIOSCOPE3D: env.VITE_URL_BIOSCOPE3D,
  VITE_URL_STELLAR_EXPANSE: env.VITE_URL_STELLAR_EXPANSE,
  VITE_URL_HERITAGE_BASE: env.VITE_URL_HERITAGE_BASE,
});
run("pnpm", ["-C", "apps/bioscope3d", "build"], {
  VITE_BASE_PATH: env.VITE_BASE_STUDIO,
});
run("pnpm", ["-C", "apps/ancient-chinese-famous-swords", "build"], {
  VITE_BASE_PATH: env.VITE_BASE_HERITAGE,
});
run("node", ["scripts/assemble-github-pages.mjs"]);
