#!/usr/bin/env node
/**
 * Build all apps and assemble page-dist for GitHub Pages.
 * CI: set GITHUB_REPOSITORY + VITE_* via workflow; skips redundant pnpm install when CI=true.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoFull = process.env.GITHUB_REPOSITORY ?? "";
const repoName =
  repoFull.split("/")[1] ?? process.env.PAGES_REPO_NAME ?? "bioscope3d";
const owner =
  process.env.GITHUB_REPOSITORY_OWNER ??
  repoFull.split("/")[0] ??
  "wujinsen";
const origin = process.env.PAGES_ORIGIN ?? `https://${owner}.github.io`;

const sharedEnv = {
  ...process.env,
  PAGES_REPO_NAME: repoName,
  GITHUB_REPOSITORY_OWNER: owner,
  VITE_BASE_HUB: `/${repoName}/`,
  VITE_BASE_STUDIO: `/${repoName}/studio/`,
  VITE_BASE_HERITAGE: `/${repoName}/heritage/`,
  VITE_URL_BIOSCOPE3D: `${origin}/${repoName}/studio/`,
  VITE_URL_STELLAR_EXPANSE: `${origin}/${repoName}/studio/`,
  VITE_URL_HERITAGE_BASE: `${origin}/${repoName}/heritage/`,
};

function run(cmd, args, extraEnv = {}) {
  const r = spawnSync(cmd, args, {
    cwd: ROOT,
    stdio: "inherit",
    env: { ...sharedEnv, ...extraEnv },
    shell: process.platform === "win32",
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

if (!process.env.CI) {
  run("pnpm", ["install"]);
}

run("pnpm", ["--filter", "lab-hub", "run", "build"], {
  VITE_BASE_PATH: sharedEnv.VITE_BASE_HUB,
  VITE_URL_BIOSCOPE3D: sharedEnv.VITE_URL_BIOSCOPE3D,
  VITE_URL_STELLAR_EXPANSE: sharedEnv.VITE_URL_STELLAR_EXPANSE,
  VITE_URL_HERITAGE_BASE: sharedEnv.VITE_URL_HERITAGE_BASE,
});
run("pnpm", ["--filter", "bioscope3d", "run", "build"], {
  VITE_BASE_PATH: sharedEnv.VITE_BASE_STUDIO,
});
run("pnpm", ["--filter", "ancient-chinese-famous-swords", "run", "build"], {
  VITE_BASE_PATH: sharedEnv.VITE_BASE_HERITAGE,
});
run("node", ["scripts/assemble-github-pages.mjs"]);
