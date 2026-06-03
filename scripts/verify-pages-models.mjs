#!/usr/bin/env node
/**
 * Ensure BioScope3D GLBs exist and are real binaries (not Git LFS pointer stubs).
 */
import { readFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MIN_BYTES = 100_000;

const REQUIRED = [
  "apps/bioscope3d/public/models/tripo-plant-cell-test.glb",
  "apps/bioscope3d/public/models/animal-cell.glb",
  "apps/bioscope3d/public/models/cancer-cell.glb",
  "apps/bioscope3d/public/models/tripo-bacteria-cell.glb",
  "apps/bioscope3d/public/models/neuron-cell.glb",
  "apps/bioscope3d/public/models/white-blood-cell.glb",
  "apps/bioscope3d/public/models/muscle-cell.glb",
];

async function checkOne(rel) {
  const abs = join(ROOT, rel);
  try {
    const st = await stat(abs);
    if (st.size >= MIN_BYTES) return null;
    const head = (await readFile(abs, { encoding: "utf8" })).slice(0, 40);
    if (head.startsWith("version https://git-lfs.github.com")) {
      return `${rel}: Git LFS pointer only (${st.size} B) — CI needs actions/checkout with lfs: true`;
    }
    return `${rel}: too small (${st.size} B), expected a GLB binary`;
  } catch {
    return `${rel}: missing`;
  }
}

async function main() {
  const problems = [];
  for (const rel of REQUIRED) {
    const p = await checkOne(rel);
    if (p) problems.push(p);
  }
  if (problems.length === 0) {
    console.log(`verify-pages-models: all ${REQUIRED.length} cell GLBs present (>= ${MIN_BYTES} bytes each).`);
    return;
  }
  console.error("verify-pages-models: invalid GLB files for GitHub Pages:\n");
  for (const p of problems) console.error(`  - ${p}`);
  console.error(
    "\nFix: ensure Git LFS files are pulled (checkout with lfs: true) or run pnpm sync:models after downloading models/."
  );
  process.exit(1);
}

main();
