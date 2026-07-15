import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ executablePath: chrome, headless: true });
const viewport = { width: 1440, height: 900 };

async function capture(page, file) {
  await page.waitForTimeout(4_500);
  await page.screenshot({ path: file, fullPage: false });
}

const fedOutput = path.resolve("reference/fed");
const fedContext = await browser.newContext({ viewport });
const fed = await fedContext.newPage();
await fed.goto("https://www.federicopian.com/", {
  waitUntil: "domcontentloaded",
  timeout: 45_000,
});
await capture(fed, path.join(fedOutput, "stage-settled-1440x900.png"));
await fed.getByRole("button", { name: "Next project" }).click();
await fed.waitForTimeout(1_500);
await fed.screenshot({
  path: path.join(fedOutput, "stage-next-1440x900.png"),
  fullPage: false,
});
for (const [route, file] of [
  ["/projects", "projects-1440x900.png"],
  ["/projects/airbag-studio", "project-detail-1440x900.png"],
  ["/about", "about-1440x900.png"],
]) {
  await fed.goto(`https://www.federicopian.com${route}`, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });
  await capture(fed, path.join(fedOutput, file));
}
await fedContext.close();

const craftOutput = path.resolve("reference/interface-craft");
const craftContext = await browser.newContext({ viewport });
const craft = await craftContext.newPage();
await craft.goto("https://www.interfacecraft.dev/", {
  waitUntil: "domcontentloaded",
  timeout: 45_000,
});
await craft.waitForTimeout(4_000);
const cardTitle = craft.getByRole("heading", { name: "Working Knowledge" });
await cardTitle.hover();
await craft.waitForTimeout(700);
await craft.screenshot({
  path: path.join(craftOutput, "cards-focus-1440x900.png"),
  fullPage: false,
});
const concept = craft.getByRole("button", { name: "Open Conceptual Range" });
if (await concept.count()) {
  await concept.scrollIntoViewIfNeeded();
  await concept.click();
  await craft.waitForTimeout(700);
  await craft.screenshot({
    path: path.join(craftOutput, "interaction-open-1440x900.png"),
    fullPage: false,
  });
}
await craftContext.close();

await browser.close();
console.log("Captured public reference interaction evidence.");
