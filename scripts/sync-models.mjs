#!/usr/bin/env node
/**
 * Mirror GLBs from the repo-root `models/` folder into each app's `public/models/`
 * so Vite can serve `/models/*.glb` without bundling them.
 *
 * GLBs are not committed to Git; obtain them separately (e.g. maintainer Google Drive)
 * and place them under `models/` before running this script.
 *
 * - macOS / Linux: creates relative symlinks (single on-disk copy under `models/`).
 * - Windows: falls back to `copyFile` (no symlink privileges required).
 *
 * Usage (from repo root): `pnpm sync:models`
 */
/* eslint-disable no-console */
import { copyFile, mkdir, readlink, rm, stat, symlink } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");

/** Each `src` is relative to ROOT; each `dest` is relative to ROOT. */
const ENTRIES = [
  {
    src: "models/tripo-plant-cell-test.glb",
    dest: "apps/bioscope3d/public/models/tripo-plant-cell-test.glb",
  },
  {
    src: "models/animal-cell.glb",
    dest: "apps/bioscope3d/public/models/animal-cell.glb",
  },
  {
    src: "models/cancer-cell.glb",
    dest: "apps/bioscope3d/public/models/cancer-cell.glb",
  },
  {
    src: "models/neuron-cell.glb",
    dest: "apps/bioscope3d/public/models/neuron-cell.glb",
  },
  {
    src: "models/tripo-bacteria-cell.glb",
    dest: "apps/bioscope3d/public/models/tripo-bacteria-cell.glb",
  },
  {
    src: "models/白血球.glb",
    dest: "apps/bioscope3d/public/models/white-blood-cell.glb",
  },
  {
    src: "models/肌肉细胞.glb",
    dest: "apps/bioscope3d/public/models/muscle-cell.glb",
  },
  {
    src: "models/hunyuan3d-stellar-expanse.glb",
    dest: "apps/stellar-expanse/public/models/hunyuan3d-stellar-expanse.glb",
  },
];

async function pathExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function removeDest(absDest) {
  try {
    const st = await stat(absDest);
    if (st.isSymbolicLink()) {
      const target = await readlink(absDest);
      await rm(absDest);
      console.log(`removed symlink ${absDest} -> ${target}`);
      return;
    }
  } catch {
    return;
  }
  await rm(absDest, { force: true });
}

async function syncOne({ src, dest }) {
  const absSrc = join(ROOT, src);
  const absDest = join(ROOT, dest);
  if (!(await pathExists(absSrc))) {
    console.warn(`skip (missing source): ${src}`);
    return;
  }
  await mkdir(dirname(absDest), { recursive: true });
  await removeDest(absDest);

  if (process.platform === "win32") {
    await copyFile(absSrc, absDest);
    console.log(`copied ${dest} <- ${src}`);
    return;
  }

  const rel = relative(dirname(absDest), absSrc);
  await symlink(rel, absDest, "file");
  console.log(`symlink ${dest} -> ${rel}`);
}

async function main() {
  for (const e of ENTRIES) {
    await syncOne(e);
  }
  console.log("sync-models: done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
