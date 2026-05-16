// Headless smoke screenshot — confirms the React app boots and a frame renders.
// Usage:  node scripts/smoke_screenshot.cjs <url> <out_png>
const puppeteer = require("puppeteer");

(async () => {
  const url = process.argv[2] || "http://127.0.0.1:5173";
  const out = process.argv[3] || "smoke.png";

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1600, height: 1000, deviceScaleFactor: 2 },
  });
  const page = await browser.newPage();
  page.on("pageerror", (e) => console.error("[pageerror]", e.message));
  page.on("console", (m) => {
    if (m.type() === "error") console.error("[console.error]", m.text());
  });
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

  // Give R3F / GLB a few extra seconds to load + auto-rotate a touch
  await new Promise((r) => setTimeout(r, 6000));

  await page.screenshot({ path: out, fullPage: false });
  console.log("Saved", out);
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
