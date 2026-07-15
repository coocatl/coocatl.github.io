import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const base = process.env.QA_URL ?? 'http://127.0.0.1:4323';
const output = path.resolve('visual-review/final');
await mkdir(path.join(output, 'viewports'), { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
const issues = [];
const checks = [];
const viewports = [
  ['360x800', 360, 800],
  ['390x844', 390, 844],
  ['768x1024', 768, 1024],
  ['1366x768', 1366, 768],
  ['1440x900', 1440, 900],
  ['1920x1080', 1920, 1080]
];

async function auditPage(page, label) {
  const result = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelectorAll('h1').length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    images: [...document.images].map((image) => ({ alt: image.alt, loaded: image.complete && image.naturalWidth > 0 })),
    mainFocused: document.activeElement === document.querySelector('main')
  }));
  checks.push({ label, ...result });
}

for (const [name, width, height] of viewports) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on('console', (message) => { if (['error', 'warning'].includes(message.type())) issues.push(`[${name}] ${message.type()}: ${message.text()}`); });
  page.on('pageerror', (error) => issues.push(`[${name}] pageerror: ${error.message}`));
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(output, 'viewports', `${name}-home.png`) });
  await auditPage(page, `home-${name}`);
  if (name === '390x844') await page.screenshot({ path: path.join(output, 'home-mobile.png') });
  if (name === '1440x900') await page.screenshot({ path: path.join(output, 'home-desktop.png') });
  await context.close();
}

const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await context.newPage();
page.on('console', (message) => { if (['error', 'warning'].includes(message.type())) issues.push(`[desktop-flow] ${message.type()}: ${message.text()}`); });
page.on('pageerror', (error) => issues.push(`[desktop-flow] pageerror: ${error.message}`));

await page.goto(`${base}/projects`, { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(output, 'projects-idle.png') });
await page.locator('[data-project-card]').last().hover();
await page.waitForTimeout(650);
await page.screenshot({ path: path.join(output, 'projects-focus.png') });
await auditPage(page, 'projects-focus-1440x900');
await page.locator('[data-project-card]').last().locator('a').click();
await page.waitForURL('**/projects/poster-experiments');
await page.waitForLoadState('networkidle');
await page.waitForFunction(() => {
  const heading = document.querySelector('.project-hero__copy h1');
  const media = document.querySelector('[data-detail-media]');
  return heading && media && getComputedStyle(heading).opacity === '1' && getComputedStyle(media).opacity === '1';
});
await page.screenshot({ path: path.join(output, 'project-hero.png') });
await auditPage(page, 'project-detail-1440x900');
await page.locator('.content-gallery button').first().click();
await page.locator('.lightbox').waitFor();
checks.push({ label: 'lightbox', open: await page.locator('.lightbox').isVisible(), imageLoaded: await page.locator('.lightbox img').evaluate((image) => image.complete && image.naturalWidth > 0) });
await page.keyboard.press('Shift+Tab');
const wrappedBackward = await page.evaluate(() => document.activeElement?.classList.contains('lightbox__next'));
await page.keyboard.press('Tab');
const wrappedForward = await page.evaluate(() => document.activeElement?.classList.contains('lightbox__close'));
checks.push({ label: 'lightbox-focus-trap', wrappedBackward, wrappedForward });
await page.keyboard.press('ArrowRight');
await page.keyboard.press('Escape');
checks.push({ label: 'lightbox-close', count: await page.locator('.lightbox').count() });
await page.reload({ waitUntil: 'networkidle' });
checks.push({ label: 'project-refresh', pathname: new URL(page.url()).pathname });
await page.goBack({ waitUntil: 'networkidle' });
checks.push({ label: 'browser-back', pathname: new URL(page.url()).pathname });

await page.goto(`${base}/profile`, { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(output, 'profile.png') });
await auditPage(page, 'profile-1440x900');
await page.emulateMedia({ media: 'print' });
const printProfile = { label: 'print-profile', headerDisplay: await page.locator('.site-header').evaluate((element) => getComputedStyle(element).display), actionDisplay: await page.locator('.profile-hero__actions').evaluate((element) => getComputedStyle(element).display), portraitCount: await page.locator('.profile-hero figure').count() };
checks.push(printProfile);
if (printProfile.headerDisplay !== 'none' || printProfile.actionDisplay !== 'none' || printProfile.portraitCount !== 0) issues.push(`[print-profile] Expected hidden header/actions and zero portrait figures, got ${JSON.stringify(printProfile)}`);
await page.emulateMedia({ media: 'screen' });

await page.goto(`${base}/missing-route`, { waitUntil: 'networkidle' });
checks.push({ label: '404', text: await page.locator('h1').innerText(), pathname: new URL(page.url()).pathname });
await context.close();

for (const route of ['/projects/tailo','/projects/kebike','/projects/bamboo-dream','/projects/haoshi','/projects/speaking-world','/projects/portrait-photography','/projects/poster-experiments']) {
  const routeContext = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const routePage = await routeContext.newPage();
  const response = await routePage.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  await routePage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await routePage.waitForTimeout(700);
  checks.push({ label: `direct-${route}`, status: response?.status(), h1: await routePage.locator('h1').count(), brokenImages: await routePage.locator('img').evaluateAll((images) => images.filter((image) => !image.complete || image.naturalWidth === 0).length) });
  await routeContext.close();
}

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const mobilePage = await mobile.newPage();
await mobilePage.goto(base, { waitUntil: 'networkidle' });
const beforeSwipe = await mobilePage.locator('.stage-ticket strong').innerText();
await mobilePage.locator('main').dispatchEvent('touchstart', { touches: [{ identifier: 1, clientX: 320, clientY: 400 }] });
await mobilePage.locator('main').dispatchEvent('touchend', { changedTouches: [{ identifier: 1, clientX: 80, clientY: 400 }] });
await mobilePage.waitForTimeout(900);
const afterSwipe = await mobilePage.locator('.stage-ticket strong').innerText();
checks.push({ label: 'touch-swipe', before: beforeSwipe, after: afterSwipe, changed: beforeSwipe !== afterSwipe });
await mobile.close();

const keyboard = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const keyboardPage = await keyboard.newPage();
await keyboardPage.goto(base, { waitUntil: 'networkidle' });
const beforeKey = await keyboardPage.locator('.stage-ticket strong').innerText();
await keyboardPage.locator('main').press('ArrowRight');
await keyboardPage.waitForTimeout(900);
const afterKey = await keyboardPage.locator('.stage-ticket strong').innerText();
await keyboardPage.keyboard.press('Tab');
checks.push({ label: 'keyboard', before: beforeKey, after: afterKey, changed: beforeKey !== afterKey, activeTag: await keyboardPage.evaluate(() => document.activeElement?.tagName) });
await keyboard.close();

const reduced = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const reducedPage = await reduced.newPage();
await reducedPage.goto(base, { waitUntil: 'networkidle' });
checks.push({ label: 'reduced-motion', mediaMatches: await reducedPage.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), hiddenStageElements: await reducedPage.locator('[data-stage-enter]').evaluateAll((elements) => elements.filter((element) => getComputedStyle(element).opacity === '0').length) });
await reduced.close();

await writeFile(path.join(output, 'checks.json'), `${JSON.stringify(checks, null, 2)}\n`);
await writeFile(path.join(output, 'console.txt'), issues.length ? `${issues.join('\n')}\n` : 'No console warnings or errors.\n');
await browser.close();

if (issues.length) throw new Error(`Browser QA found ${issues.length} console issue(s).`);
console.log(`Production browser QA completed with ${checks.length} recorded checks.`);
