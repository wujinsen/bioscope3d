#!/usr/bin/env node
/**
 * BioScope3D v0.4 feature validation — captures one screenshot per Tier-1
 * feature so we can eyeball the result:
 *
 *   01 — default Explore on plant cell (R3F live + CameraRig preset for plant)
 *   02 — switched to animal cell (CameraRig flies to that cell's preset)
 *   03 — Auto Tour active mid-segment (TourBar visible with ◀ ⏸/▶ ▮ dots ✕)
 *   04 — Cinema mode engaged (chrome hidden, stage full-screen)
 *
 * Bonus: also verifies the Screenshot button actually delivers a PNG.
 *
 * Prereq: `npm run dev` running on 5173/5174/5175.
 * Usage:  node scripts/screenshot_v0.4.mjs
 */
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const VIEWPORT = { width: 1480, height: 920, deviceScaleFactor: 1 };
const DOWNLOAD_DIR = path.resolve("./_pup_downloads");

// Prefer the newest port (highest number) — Vite falls forward when 5173 is busy.
async function findUrl() {
  const candidates = [];
  for (const port of [5173, 5174, 5175, 5176, 5177]) {
    try {
      const res = await fetch(`http://localhost:${port}/`, { method: "HEAD" });
      if (res.status === 200) candidates.push(port);
    } catch {}
  }
  if (!candidates.length) throw new Error("No Vite dev server on 5173..5177.");
  const chosen = candidates[candidates.length - 1];
  return `http://localhost:${chosen}/`;
}

const URL = await findUrl();
console.log(`→ using ${URL}`);

if (existsSync(DOWNLOAD_DIR)) rmSync(DOWNLOAD_DIR, { recursive: true });
mkdirSync(DOWNLOAD_DIR, { recursive: true });

// IMPORTANT: do NOT pass `--disable-gpu` — it kills WebGL in headless Chrome.
// Swiftshader is the software fallback used by headless Chromium to honor
// WebGL contexts; without it, R3F's THREE.WebGLRenderer fails on launch and
// the 3D canvas stays transparent (the hero PNG shows through).
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: VIEWPORT,
  args: [
    "--no-sandbox",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
  ],
});

const page = await browser.newPage();
const client = await page.target().createCDPSession();
await client.send("Page.setDownloadBehavior", {
  behavior: "allow",
  downloadPath: DOWNLOAD_DIR,
});

async function freshReload() {
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector(".brand .tag");
}

async function waitForGlb() {
  await page.waitForSelector(".cell-scene canvas", { timeout: 8000 });
  // Software-rasterized WebGL + 60 MB GLB parsing means we need a generous
  // settle window. Poll the center pixel for any non-zero RGBA — that's
  // proof the model has rendered at least one frame into the buffer.
  for (let i = 0; i < 40; i++) {
    const rendered = await page.evaluate(() => {
      const c = document.querySelector(".cell-scene canvas");
      if (!c) return false;
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      if (!gl) return false;
      const px = new Uint8Array(4);
      gl.readPixels(c.width >> 1, c.height >> 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
      return px[0] !== 0 || px[1] !== 0 || px[2] !== 0 || px[3] !== 0;
    });
    if (rendered) break;
    await new Promise((r) => setTimeout(r, 500));
  }
  // Small extra cushion for camera lerp to converge.
  await new Promise((r) => setTimeout(r, 900));
}

async function shot(filename) {
  await new Promise((r) => setTimeout(r, 400));
  const buf = await page.screenshot({ fullPage: false });
  writeFileSync(filename, buf);
  console.log(`  ✓ ${filename}`);
}

/* ─── boot ─── */
await page.goto(URL, { waitUntil: "networkidle0" });
await freshReload();

/* 01 default plant — language to English for clarity */
await page.evaluate(() => {
  const raw = localStorage.getItem("bioscope3d:app-state");
  const parsed = raw ? JSON.parse(raw) : { state: {}, version: 5 };
  parsed.state = { ...parsed.state, locale: "en", localeInitialized: true, activeCell: "plant" };
  parsed.version = 5;
  localStorage.setItem("bioscope3d:app-state", JSON.stringify(parsed));
});
await page.reload({ waitUntil: "networkidle0" });
await waitForGlb();
await shot("screenshot_v0.4_01_plant.png");

/* 02 animal — click cell card. Cards are <a class="cell-item">, second one is animal. */
await page.evaluate(() => {
  const cards = document.querySelectorAll(".sec-body .cell-item");
  // cells are ordered plant, animal, bacteria, rbc, neuron, wbc, muscle
  cards[1]?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
});
await new Promise((r) => setTimeout(r, 2200));
await shot("screenshot_v0.4_02_animal_camera.png");

/* 03 tour — press Space to start, wait, then snapshot */
await page.evaluate(() => {
  const cards = document.querySelectorAll(".sec-body .cell-item");
  cards[0]?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
});
await new Promise((r) => setTimeout(r, 1200));
await page.keyboard.press("Space");
await page.waitForSelector(".tour-bar", { timeout: 4000 });
// Let the bar accumulate ~2 seconds of elapsed time
await new Promise((r) => setTimeout(r, 2200));
await shot("screenshot_v0.4_03_tour.png");

/* exit tour cleanly before cinema test */
await page.keyboard.press("Escape");
await new Promise((r) => setTimeout(r, 500));

/* 04 cinema — press F */
await page.keyboard.press("KeyF");
await new Promise((r) => setTimeout(r, 1400));
await shot("screenshot_v0.4_04_cinema.png");

/* exit cinema */
await page.keyboard.press("Escape");
await new Promise((r) => setTimeout(r, 500));

/* 05 screenshot button → real PNG on disk */
// Make sure we're on a GLB-backed cell first (cinema test may have left us on bacteria).
await page.evaluate(() => {
  const cards = document.querySelectorAll(".sec-body .cell-item");
  cards[0]?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
});
await new Promise((r) => setTimeout(r, 800));
await waitForGlb();
const before = readdirSync(DOWNLOAD_DIR);
await page.evaluate(() => {
  const btn = [...document.querySelectorAll(".stage-toolbar .tool-btn")].find(
    (b) => b.querySelector(".lucide-camera")
  );
  btn?.click();
});
await new Promise((r) => setTimeout(r, 1500));
const after = readdirSync(DOWNLOAD_DIR);
const newFiles = after.filter((f) => !before.includes(f) && f.endsWith(".png"));
if (newFiles.length) {
  const f = newFiles[0];
  const size = statSync(path.join(DOWNLOAD_DIR, f)).size;
  console.log(`  ✓ Screenshot button produced ${f} (${(size / 1024).toFixed(1)} KB)`);
  writeFileSync("screenshot_v0.4_05_canvas_download.png", readFileSync(path.join(DOWNLOAD_DIR, f)));
} else {
  console.log("  ✗ Screenshot button did NOT produce a download");
}

await browser.close();
console.log("done.");
