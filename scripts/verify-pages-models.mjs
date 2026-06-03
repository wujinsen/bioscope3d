#!/usr/bin/env node
/**
 * Ensure BioScope3D GLBs exist under public/models before Pages deploy.
 * Run after `pnpm sync:models` in CI or locally.
 */
import { stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const REQUIRED = [
  "apps/bioscope3d/public/models/tripo-plant-cell-test.glb",
  "apps/bioscope3d/public/models/animal-cell.glb",
  "apps/bioscope3d/public/models/cancer-cell.glb",
  "apps/bioscope3d/public/models/tripo-bacteria-cell.glb",
  "apps/bioscope3d/public/models/neuron-cell.glb",
  "apps/bioscope3d/public/models/white-blood-cell.glb",
  "apps/bioscope3d/public/models/muscle-cell.glb",
];

async function exists(p) {
  try {
    await stat(join(ROOT, p));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const missing = [];
  for (const rel of REQUIRED) {
    if (!(await exists(rel))) missing.push(rel);
  }
  if (missing.length === 0) {
    console.log(`verify-pages-models: all ${REQUIRED.length} cell GLBs present.`);
    return;
  }
  console.error("verify-pages-models: missing GLB files for GitHub Pages:\n");
  for (const m of missing) console.error(`  - ${m}`);
  console.error(
    "\nAdd GLBs to repo-root models/ (from maintainer Drive), then:\n" +
      "  pnpm sync:models\n" +
      "  git add models/ apps/bioscope3d/public/models/\n" +
      "  git commit && git push\n" +
      "\nFor files over 50MB use Git LFS (see docs/deploy-github-pages.md)."
  );
  process.exit(1);
}

main();
