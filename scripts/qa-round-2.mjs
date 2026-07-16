import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const localBase = (process.env.QA_URL ?? 'http://127.0.0.1:4323').replace(/\/$/, '');
const pagesBase = (process.env.QA_PAGES_URL ?? 'http://127.0.0.1:4325/portfolio').replace(/\/$/, '');
const output = path.resolve('visual-review/round-2');
const sourceResume = path.resolve('public/files/cv/li-jiaying-resume.pdf');
const sourceBytes = await readFile(sourceResume);
const sourceHash = createHash('sha256').update(sourceBytes).digest('hex').toUpperCase();

await mkdir(output, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
});

const issues = [];
const checks = [];

const bindIssues = (page, label) => {
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type())) {
      issues.push(`[${label}] ${message.type()}: ${message.text()}`);
    }
  });
  page.on('pageerror', (error) => issues.push(`[${label}] pageerror: ${error.message}`));
};

const waitForStage = (page) => page.waitForFunction(() => {
  const image = document.querySelector('.stage-media img');
  return image && image.complete && image.naturalWidth > 0 && getComputedStyle(image).opacity !== '0';
});

const stageGeometry = (page) => page.evaluate(() => {
  const media = document.querySelector('.stage-media');
  const artwork = document.querySelector('.stage-artwork');
  const image = document.querySelector('.stage-media img');
  const ticket = document.querySelector('.stage-ticket');

  if (!(media instanceof HTMLElement) || !(artwork instanceof HTMLElement) || !(image instanceof HTMLImageElement) || !(ticket instanceof HTMLElement)) {
    return null;
  }

  const m = media.getBoundingClientRect();
  const a = artwork.getBoundingClientRect();
  const t = ticket.getBoundingClientRect();
  const naturalRatio = image.naturalWidth / image.naturalHeight;
  const renderedRatio = a.width / a.height;

  return {
    fit: media.dataset.fit,
    frame: media.dataset.frame,
    ticketBelow: t.top >= m.bottom - 1,
    imageWithinMedia: a.top >= m.top - 1 && a.right <= m.right + 1 && a.bottom <= m.bottom + 1 && a.left >= m.left - 1,
    naturalRatio,
    renderedRatio,
    ratioDelta: Math.abs(naturalRatio - renderedRatio)
  };
});

const desktop = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  acceptDownloads: true
});

const page = await desktop.newPage();
bindIssues(page, 'desktop');

await page.goto(localBase, { waitUntil: 'networkidle' });
await waitForStage(page);
await page.screenshot({ path: path.join(output, 'home-desktop.png') });

checks.push({
  label: 'home-tailo',
  geometry: await stageGeometry(page),
  headlineLines: await page.locator('.stage-copy h1 > span').allInnerTexts()
});

for (const [index, filename, label] of [
  [1, 'home-kebike.png', 'kebike'],
  [2, 'home-speaking-world.png', 'speaking-world'],
  [3, 'home-photography.png', 'photography']
]) {
  await page.locator('.stage-project-tabs button').nth(index).click();
  await waitForStage(page);
  await page.waitForTimeout(950);
  await page.screenshot({ path: path.join(output, filename) });
  checks.push({ label: `home-${label}`, geometry: await stageGeometry(page) });
}

await page.goto(`${localBase}/projects`, { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(output, 'projects-idle.png') });
await page.locator('[data-project-card]').nth(1).locator('a').focus();
await page.waitForTimeout(650);
await page.screenshot({ path: path.join(output, 'projects-focus.png') });

checks.push({
  label: 'cards',
  count: await page.locator('[data-project-card]').count(),
  presentation: await page.locator("[data-media-frame='presentation']").count(),
  poster: await page.locator("[data-media-frame='poster']").count(),
  photography: await page.locator("[data-media-frame='photography']").count()
});

await page.goto(`${localBase}/profile`, { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(output, 'profile-top.png') });
await page.screenshot({ path: path.join(output, 'profile-full.png'), fullPage: true });

checks.push({
  label: 'profile',
  portraitFigures: await page.locator('.profile-hero figure').count(),
  downloadVisible: await page.getByText('下载简历（PDF）').isVisible(),
  columns: await page.locator('.profile-hero').evaluate((element) => getComputedStyle(element).gridTemplateColumns)
});

await page.goto(`${localBase}/projects/tailo`, { waitUntil: 'networkidle' });
await page.locator('.content-gallery').first().scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(output, 'project-presentation-gallery.png') });
await page.locator('.content-gallery button').first().click();
await page.locator('.lightbox').waitFor();

checks.push({
  label: 'lightbox',
  visible: await page.locator('.lightbox').isVisible(),
  loaded: await page.locator('.lightbox img').evaluate((image) => image.complete && image.naturalWidth > 0)
});

await page.keyboard.press('Escape');

async function validateDownload(base, label) {
  await page.goto(`${base}/profile/`, { waitUntil: 'networkidle' });

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByText('下载简历（PDF）').click()
  ]);

  const downloadPath = await download.path();

  if (!downloadPath) {
    throw new Error(`${label} download path unavailable.`);
  }

  const bytes = await readFile(downloadPath);
  const hash = createHash('sha256').update(bytes).digest('hex').toUpperCase();
  const response = await page.request.get(`${base}/files/cv/li-jiaying-resume.pdf`);
  const contentType = response.headers()['content-type'] ?? '';

  const result = {
    label,
    suggestedFilename: download.suggestedFilename(),
    bytes: bytes.length,
    sha256: hash,
    sourceBytes: sourceBytes.length,
    sourceSha256: sourceHash,
    status: response.status(),
    contentType,
    pdfSignature: bytes.subarray(0, 5).toString('utf8'),
    isHtml: bytes.subarray(0, 64).toString('utf8').toLowerCase().includes('<!doctype')
  };

  checks.push({ label: `cv-${label}`, ...result });
  return result;
}

const downloads = [
  await validateDownload(localBase, 'local'),
  await validateDownload(pagesBase, 'github-pages-subpath')
];

await desktop.close();

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true
});

const mobilePage = await mobile.newPage();
bindIssues(mobilePage, 'mobile');
await mobilePage.goto(localBase, { waitUntil: 'networkidle' });
await waitForStage(mobilePage);
await mobilePage.screenshot({ path: path.join(output, 'home-mobile.png') });

checks.push({
  label: 'mobile',
  overflow: await mobilePage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
  headlineLines: await mobilePage.locator('.stage-copy h1 > span').count()
});

await mobile.close();
await browser.close();

const failures = [];

for (const item of checks.filter((item) => item.label.startsWith('home-'))) {
  if (!item.geometry?.ticketBelow) failures.push(`${item.label}: ticket overlaps artwork`);
  if (!item.geometry?.imageWithinMedia) failures.push(`${item.label}: image overflows media frame`);
  if (item.geometry?.fit === 'contain' && item.geometry.ratioDelta > .03) failures.push(`${item.label}: contained media is cropped`);
}

if (checks.find((item) => item.label === 'home-tailo')?.headlineLines?.join('|') !== '把内容从|创意推进|到真实落地。') {
  failures.push('home headline is not the required three-line structure');
}

if (checks.find((item) => item.label === 'profile')?.portraitFigures !== 0) {
  failures.push('profile portrait remains');
}

if (!checks.find((item) => item.label === 'profile')?.downloadVisible) {
  failures.push('resume PDF download is not visible');
}

if (checks.find((item) => item.label === 'mobile')?.overflow > 1) {
  failures.push('mobile horizontal overflow');
}

for (const item of downloads) {
  if (
    item.status !== 200 ||
    item.bytes !== item.sourceBytes ||
    item.sha256 !== item.sourceSha256 ||
    item.pdfSignature !== '%PDF-' ||
    item.isHtml ||
    !item.suggestedFilename.includes('李佳颖') ||
    !item.suggestedFilename.toLowerCase().endsWith('.pdf')
  ) {
    failures.push(`${item.label}: invalid resume PDF download`);
  }
}

await writeFile(
  path.join(output, 'cv-download-check.json'),
  `${JSON.stringify({ downloads }, null, 2)}\n`
);

await writeFile(
  path.join(output, 'checks.json'),
  `${JSON.stringify(checks, null, 2)}\n`
);

await writeFile(
  path.join(output, 'console.txt'),
  issues.length ? `${issues.join('\n')}\n` : 'No console warnings or errors.\n'
);

if (issues.length || failures.length) {
  throw new Error(`Round 2 QA failed: ${[...issues, ...failures].join('; ')}`);
}

console.log(`Round 2 browser QA passed with ${checks.length} checks and ${downloads.length} verified PDF downloads.`);
