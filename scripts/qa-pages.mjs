import { chromium } from 'playwright-core';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const base = process.env.QA_PAGES_URL ?? 'http://127.0.0.1:4325/portfolio';
const routes = ['/', '/projects/', '/profile/', '/projects/tailo/', '/projects/kebike/', '/projects/bamboo-dream/', '/projects/haoshi/', '/projects/speaking-world/', '/projects/portrait-photography/', '/projects/poster-experiments/'];
const expectedTitles = {
  '/': '李佳颖｜品牌策划、视觉内容与新媒体运营作品集',
  '/projects/': '作品｜李佳颖个人作品集',
  '/profile/': '关于李佳颖｜经历与简历',
  '/projects/tailo/': '尾焰 TAILO｜李佳颖作品集',
  '/projects/kebike/': '可比克品牌线下快闪｜李佳颖作品集',
  '/projects/bamboo-dream/': '竹梦百千万｜李佳颖作品集',
  '/projects/haoshi/': '豪士品牌策划案｜李佳颖作品集',
  '/projects/speaking-world/': '用说话，造世界｜李佳颖作品集',
  '/projects/portrait-photography/': '创意人像摄影｜李佳颖作品集',
  '/projects/poster-experiments/': '平面与海报实验｜李佳颖作品集'
};
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
const results = [];
for (const route of routes) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(700);
  results.push({ route, status: response?.status(), title: await page.title(), h1: await page.locator('h1').count(), brokenImages: await page.locator('img').evaluateAll((images) => images.filter((image) => !image.complete || image.naturalWidth === 0).length), errors });
  await page.close();
}
await browser.close();
await writeFile(path.resolve('visual-review/final/pages-subpath.json'), `${JSON.stringify(results, null, 2)}\n`);
const failed = results.filter((result) => result.status !== 200 || result.h1 !== 1 || result.brokenImages || result.errors.length || result.title !== expectedTitles[result.route]);
if (failed.length) throw new Error(`GitHub Pages subpath QA failed for ${failed.map((item) => item.route).join(', ')}`);
console.log(`GitHub Pages subpath QA passed for ${results.length} routes.`);
