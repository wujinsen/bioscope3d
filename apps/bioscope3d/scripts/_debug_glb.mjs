#!/usr/bin/env node
/** Quick diagnostic: load the dev page, watch network + console, then dump WebGL state */
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = "http://localhost:5174/";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: { width: 1480, height: 920 },
  args: ["--no-sandbox", "--disable-gpu"],
});

const page = await browser.newPage();
page.on("console", (msg) => console.log(`[browser ${msg.type()}]`, msg.text()));
page.on("pageerror", (err) => console.log("[pageerror]", err.message));
page.on("response", (res) => {
  const u = res.url();
  if (u.includes(".glb") || u.includes("/models/")) {
    console.log(`[net] ${res.status()} ${u} (${res.headers()["content-length"] ?? "?"} B)`);
  }
});

await page.evaluate(() => localStorage.clear()).catch(() => {});
await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle0", timeout: 30000 });

console.log("→ waiting 8s for GLB to load...");
await new Promise((r) => setTimeout(r, 8000));

const info = await page.evaluate(() => {
  const canvas = document.querySelector(".cell-scene canvas");
  if (!canvas) return { canvas: false };
  const w = canvas.width, h = canvas.height;
  // Read a center pixel of the canvas via WebGL readPixels (alpha buffer test).
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
  let centerPx = null;
  if (gl) {
    const px = new Uint8Array(4);
    gl.readPixels(Math.floor(w / 2), Math.floor(h / 2), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    centerPx = Array.from(px);
  }
  return { canvas: true, w, h, centerPx };
});
console.log("→ canvas info:", info);
await browser.close();
