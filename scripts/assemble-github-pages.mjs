#!/usr/bin/env node
/**
 * Merge per-app Vite `dist/` folders into one GitHub Pages artifact.
 *
 * Layout (repo name = bioscope3d):
 *   /                      Lab Hub
 *   /studio/               BioScope3D
 *   /heritage/             Chinese heritage catalog + swords
 */
import { cp, mkdir, rm, writeFile, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPO =
  process.env.GITHUB_REPOSITORY?.split("/")[1] ??
  process.env.PAGES_REPO_NAME ??
  "bioscope3d";
const OUT = join(ROOT, "page-dist");

const APPS = {
  hub: join(ROOT, "apps/lab-hub/dist"),
  studio: join(ROOT, "apps/bioscope3d/dist"),
  heritage: join(ROOT, "apps/ancient-chinese-famous-swords/dist"),
};

const HERITAGE_SRC = join(ROOT, "apps/ancient-chinese-famous-swords");

async function copyTree(src, dest) {
  await mkdir(dirname(dest), { recursive: true });
  await cp(src, dest, { recursive: true });
}

async function patchHeritageHubLink() {
  const indexPath = join(OUT, "heritage", "index.html");
  try {
    let html = await readFile(indexPath, "utf8");
    const hubUrl = `https://${process.env.GITHUB_REPOSITORY_OWNER ?? "wujinsen"}.github.io/${REPO}/`;
    html = html.replace(
      /id="hubLink" href="[^"]*"/,
      `id="hubLink" href="${hubUrl}"`
    );
    await writeFile(indexPath, html);
  } catch {
    /* heritage index optional */
  }
}

async function main() {
  for (const [name, dir] of Object.entries(APPS)) {
    try {
      await readFile(join(dir, "index.html"));
    } catch {
      console.error(`Missing build output: ${dir} (run build for ${name} first)`);
      process.exit(1);
    }
  }

  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  await copyTree(APPS.hub, OUT);
  await copyTree(APPS.studio, join(OUT, "studio"));
  await copyTree(APPS.heritage, join(OUT, "heritage"));

  await mkdir(join(OUT, "heritage", "data"), { recursive: true });
  await cp(
    join(HERITAGE_SRC, "data/taxonomy.json"),
    join(OUT, "heritage/data/taxonomy.json")
  );

  const geminiSrc = join(
    HERITAGE_SRC,
    "sword-picture/Gemini_Generated_Image_y4kyzuy4kyzuy4ky.png"
  );
  try {
    await cp(geminiSrc, join(OUT, "heritage/Gemini_Generated_Image_y4kyzuy4kyzuy4ky.png"));
    await cp(join(HERITAGE_SRC, "sword-picture"), join(OUT, "heritage/sword-picture"), {
      recursive: true,
    });
  } catch {
    console.warn("Heritage sword images not copied (optional).");
  }

  await writeFile(join(OUT, ".nojekyll"), "");
  await patchHeritageHubLink();

  console.log(`GitHub Pages bundle ready: ${OUT}`);
  console.log(`Live URL: https://${process.env.GITHUB_REPOSITORY_OWNER ?? "<user>"}.github.io/${REPO}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
