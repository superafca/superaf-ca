import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const html = pathToFileURL(resolve("/workspace/.grok/brand/og-card.html")).href;
const out = "/workspace/.grok/brand/og-raw.png";

const browser = await chromium.launch({ args: ["--font-render-hinting=none"] });
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
});
await page.goto(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(160);
await page.screenshot({ path: out, type: "png" });
await browser.close();
console.log("wrote", out);
