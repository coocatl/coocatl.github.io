import { chromium } from 'playwright-core';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const base = process.env.QA_URL ?? 'http://127.0.0.1:4323';
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await context.newPage();

await page.addInitScript(() => {
  window.__portfolioMetrics = { lcp: 0, cls: 0, eventDuration: 0 };
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const last = entries.at(-1);
    if (last) window.__portfolioMetrics.lcp = last.startTime;
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__portfolioMetrics.cls += entry.value;
  }).observe({ type: 'layout-shift', buffered: true });
  if (PerformanceObserver.supportedEntryTypes.includes('event')) {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__portfolioMetrics.eventDuration = Math.max(window.__portfolioMetrics.eventDuration, entry.duration);
    }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
  }
});

await page.goto(base, { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);
const initialTransferred = await page.evaluate(() => {
  const resources = performance.getEntriesByType('resource');
  const bytes = (pattern) => resources.filter((entry) => pattern.test(entry.name)).reduce((total, entry) => total + (entry.transferSize || entry.encodedBodySize || 0), 0);
  return { total: bytes(/./), images: bytes(/\.(webp|png|jpe?g|avif)(\?|$)/i), fonts: bytes(/\.woff2(\?|$)/i), scripts: bytes(/\.js(\?|$)/i), styles: bytes(/\.css(\?|$)/i) };
});
await page.locator('.stage-controls button').last().click();
await page.waitForTimeout(900);

const measured = await page.evaluate(() => {
  const navigation = performance.getEntriesByType('navigation')[0];
  const resources = performance.getEntriesByType('resource');
  const summarize = (pattern) => resources.filter((entry) => pattern.test(entry.name)).reduce((total, entry) => total + (entry.transferSize || entry.encodedBodySize || 0), 0);
  return {
    ...window.__portfolioMetrics,
    domContentLoaded: navigation.domContentLoadedEventEnd,
    loadEvent: navigation.loadEventEnd,
    transferred: {
      total: resources.reduce((total, entry) => total + (entry.transferSize || entry.encodedBodySize || 0), 0),
      images: summarize(/\.(webp|png|jpe?g|avif)(\?|$)/i),
      fonts: summarize(/\.woff2(\?|$)/i),
      scripts: summarize(/\.js(\?|$)/i),
      styles: summarize(/\.css(\?|$)/i)
    },
    resourceCount: resources.length
  };
});
const metrics = { ...measured, initialTransferred };

await writeFile(path.resolve('visual-review/round-2/performance.json'), `${JSON.stringify(metrics, null, 2)}\n`);
await browser.close();
console.log(JSON.stringify(metrics));
