#!/usr/bin/env node
/**
 * Capture EN / ZH / JA screenshots of the running dev server.
 * One-shot validation that the language switcher actually re-renders the UI.
 *
 * Prerequisite: `npm run dev` is up on http://localhost:5173/
 *
 * Usage: node scripts/screenshot_i18n.mjs
 */
import puppeteer from "puppeteer-core";
import { writeFileSync } from "node:fs";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = "http://localhost:5173/";
const VIEWPORT = { width: 1480, height: 920, deviceScaleFactor: 1 };

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: VIEWPORT,
  args: ["--no-sandbox", "--disable-gpu"],
});

const page = await browser.newPage();

async function captureFor(locale, filename) {
  await page.evaluate((loc) => {
    const raw = localStorage.getItem("bioscope3d:app-state");
    const parsed = raw ? JSON.parse(raw) : { state: {}, version: 4 };
    parsed.state = { ...parsed.state, locale: loc, localeInitialized: true };
    parsed.version = 4;
    localStorage.setItem("bioscope3d:app-state", JSON.stringify(parsed));
  }, locale);
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector(".brand .tag");
  await new Promise((r) => setTimeout(r, 700));
  const buffer = await page.screenshot({ fullPage: false });
  writeFileSync(filename, buffer);
  console.log(`✓ ${locale.padEnd(2)} → ${filename}`);
}

await page.goto(URL, { waitUntil: "networkidle0" });
await page.waitForSelector(".brand .tag");

await captureFor("en", "screenshot_v0.3_en.png");
await captureFor("zh", "screenshot_v0.3_zh.png");
await captureFor("ja", "screenshot_v0.3_ja.png");

await browser.close();
console.log("done.");
