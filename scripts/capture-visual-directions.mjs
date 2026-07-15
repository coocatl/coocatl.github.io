import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const base = process.env.VISUAL_REVIEW_URL ?? 'http://127.0.0.1:4322';
const root = path.resolve('visual-review/round-1');
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
});
const consoleLines = [];
const checks = [];
const sections = [
  ['projects-idle', 'projects-idle.png'],
  ['projects-focus', 'projects-focus.png'],
  ['detail', 'detail-hero.png'],
  ['profile', 'profile-upper.png'],
  ['specimens', 'type-color-specimens.png'],
];

for (const direction of ['a', 'b', 'c']) {
  const folder = path.join(root, `direction-${direction}`);
  await mkdir(folder, { recursive: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on('console', (message) => consoleLines.push(`[${direction}] ${message.type()}: ${message.text()}`));
  page.on('pageerror', (error) => consoleLines.push(`[${direction}] pageerror: ${error.message}`));
  await page.goto(`${base}/visual-directions/direction-${direction}/index.html`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(folder, 'home-desktop.png') });
  for (const [id, filename] of sections) {
    const element = page.locator(`#${id}`);
    await element.screenshot({ path: path.join(folder, filename) });
  }
  const audit = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelectorAll('h1').length,
    images: [...document.images].map((image) => ({ alt: image.alt, loaded: image.complete && image.naturalWidth > 0 })),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    focusable: document.querySelectorAll('a[href], button').length,
  }));
  checks.push({ direction, viewport: 'desktop', ...audit });
  await context.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const mobilePage = await mobile.newPage();
  mobilePage.on('console', (message) => consoleLines.push(`[${direction}-mobile] ${message.type()}: ${message.text()}`));
  await mobilePage.goto(`${base}/visual-directions/direction-${direction}/index.html`, { waitUntil: 'networkidle' });
  await mobilePage.screenshot({ path: path.join(folder, 'home-mobile.png') });
  checks.push({ direction, viewport: 'mobile', overflow: await mobilePage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) });
  await mobile.close();
}

await writeFile(path.join(root, 'console.txt'), consoleLines.length ? `${consoleLines.join('\n')}\n` : 'No console output.\n');
await writeFile(path.join(root, 'checks.json'), `${JSON.stringify(checks, null, 2)}\n`);
await browser.close();
console.log(`Captured visual directions in ${root}`);
