import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const baseURL = process.env.QA_BASE_URL ?? "http://127.0.0.1:4321";
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const output = path.resolve("audit/before");
fs.mkdirSync(output, { recursive: true });

const browser = await chromium.launch({ executablePath: chrome, headless: true });
const consoleLines = [];

async function capture(name, route, viewport) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  page.on("console", (message) =>
    consoleLines.push(`[${name}] ${message.type()}: ${message.text()}`),
  );
  page.on("pageerror", (error) =>
    consoleLines.push(`[${name}] pageerror: ${error.message}`),
  );
  await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(output, `${name}.png`),
    fullPage: false,
  });
  await context.close();
}

await capture("home-1440x900", "/", { width: 1440, height: 900 });
await capture("home-390x844", "/", { width: 390, height: 844 });
await capture("projects-1440x900", "/projects", {
  width: 1440,
  height: 900,
});
await capture("project-detail-1440x900", "/projects/soft-systems", {
  width: 1440,
  height: 900,
});
await capture("profile-1440x900", "/profile", {
  width: 1440,
  height: 900,
});

await browser.close();
fs.writeFileSync(
  path.join(output, "console-log.txt"),
  consoleLines.length ? `${consoleLines.join("\n")}\n` : "No console output.\n",
);
console.log(`Captured 5 baseline screenshots in ${output}`);
