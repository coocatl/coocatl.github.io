import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const root = path.resolve("reference");
const sites = [
  {
    key: "fed",
    url: "https://www.federicopian.com/",
  },
  {
    key: "interface-craft",
    url: "https://www.interfacecraft.dev/",
  },
];

fs.mkdirSync(root, { recursive: true });
const browser = await chromium.launch({ executablePath: chrome, headless: true });

for (const site of sites) {
  const output = path.join(root, site.key);
  fs.mkdirSync(output, { recursive: true });
  const logs = [];

  for (const [name, viewport] of [
    ["home-1440x900", { width: 1440, height: 900 }],
    ["home-390x844", { width: 390, height: 844 }],
  ]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    page.on("console", (message) =>
      logs.push(`[${name}] ${message.type()}: ${message.text()}`),
    );
    page.on("pageerror", (error) =>
      logs.push(`[${name}] pageerror: ${error.message}`),
    );
    await page.goto(site.url, {
      waitUntil: "domcontentloaded",
      timeout: 45_000,
    });
    await page.waitForTimeout(4_000);
    await page.screenshot({
      path: path.join(output, `${name}.png`),
      fullPage: false,
    });

    if (name === "home-1440x900") {
      const pageInfo = await page.evaluate(() => ({
        title: document.title,
        url: location.href,
        headings: [...document.querySelectorAll("h1,h2")]
          .map((node) => node.textContent?.trim())
          .filter(Boolean)
          .slice(0, 20),
        controls: [...document.querySelectorAll("a,button")]
          .map((node) => ({
            tag: node.tagName.toLowerCase(),
            text: node.textContent?.trim().replace(/\s+/g, " ").slice(0, 100),
            href: node instanceof HTMLAnchorElement ? node.href : undefined,
            label: node.getAttribute("aria-label"),
          }))
          .filter((item) => item.text || item.label)
          .slice(0, 80),
      }));
      fs.writeFileSync(
        path.join(output, "page-info.json"),
        `${JSON.stringify(pageInfo, null, 2)}\n`,
      );
    }
    await context.close();
  }

  fs.writeFileSync(
    path.join(output, "console-log.txt"),
    logs.length ? `${logs.join("\n")}\n` : "No console output.\n",
  );
}

await browser.close();
console.log(`Captured public reference evidence in ${root}`);
