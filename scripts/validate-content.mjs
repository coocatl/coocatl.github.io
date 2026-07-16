import fs from 'node:fs';
import path from 'node:path';

const projectFile = fs.readFileSync(new URL('../src/data/projects.ts', import.meta.url), 'utf8');
const profileFile = fs.readFileSync(new URL('../src/data/profile.ts', import.meta.url), 'utf8');
const configFile = fs.readFileSync(new URL('../src/config.ts', import.meta.url), 'utf8');
const profilePageFile = fs.readFileSync(new URL('../src/pages/ProfilePage.tsx', import.meta.url), 'utf8');
const expected = ['tailo','kebike','bamboo-dream','haoshi','speaking-world','portrait-photography','poster-experiments'];
const slugs = [...projectFile.matchAll(/^\s{4}slug:\s*'([^']+)'/gm)].map((match) => match[1]);

if (JSON.stringify(slugs) !== JSON.stringify(expected)) {
  throw new Error(`Expected ${expected.join(', ')}, found ${slugs.join(', ')}.`);
}

for (const forbidden of [['After','image'].join(''), ['Field',' Notes'].join(''), ['Blue',' Interval'].join(''), ['Balance',' Study'].join(''), ['Independent',' study'].join(''), ['Noise',' Studio'].join(''), ['/de','mo/'].join('')]) {
  if (`${projectFile}\n${profileFile}\n${configFile}`.includes(forbidden)) {
    throw new Error(`Forbidden demo content remains: ${forbidden}`);
  }
}

if (!configFile.includes('showPhone: false')) {
  throw new Error('Public phone visibility must remain disabled.');
}

if (!configFile.includes("pdf: 'files/cv/li-jiaying-resume.pdf'")) {
  throw new Error('Missing base-relative PDF config.');
}

if (!profilePageFile.includes('assetUrl(siteConfig.cv.pdf)')) {
  throw new Error('Resume PDF link must use assetUrl.');
}

if (profilePageFile.includes('siteConfig.cv.docx') || profilePageFile.includes('下载简历（DOCX）')) {
  throw new Error('Old DOCX download reference remains.');
}

if (profilePageFile.includes('profile.portrait') || profileFile.includes('portrait:')) {
  throw new Error('Public profile portrait reference remains.');
}

const manifest = JSON.parse(fs.readFileSync(path.resolve('media-sources/li-jiaying/manifest.json'), 'utf8'));

if (manifest.sources.length !== 34) {
  throw new Error(`Expected 34 media sources, found ${manifest.sources.length}.`);
}

for (const source of manifest.sources) {
  for (const variant of source.variants) {
    if (!fs.existsSync(path.resolve('public', variant.file))) {
      throw new Error(`Missing media: ${variant.file}`);
    }
  }
}

for (const slug of expected) {
  if (!projectFile.includes(`slug: '${slug}'`)) {
    throw new Error(`Missing project data: ${slug}`);
  }
}

for (const snippet of ["stage: media('tailo'", "stage: media('kebike'", "stage: media('speaking-world'", "stage: media('portrait-photography'"]) {
  if (!projectFile.includes(snippet)) {
    throw new Error(`Missing dedicated stage media: ${snippet}`);
  }
}

const resume = path.resolve('public/files/cv/li-jiaying-resume.pdf');

if (!fs.existsSync(resume)) {
  throw new Error('Missing real resume PDF.');
}

const resumeBytes = fs.statSync(resume).size;

if (resumeBytes <= 10_000) {
  throw new Error(`Resume PDF is unexpectedly small: ${resumeBytes} bytes.`);
}

const signature = fs.readFileSync(resume).subarray(0, 5).toString('utf8');

if (signature !== '%PDF-') {
  throw new Error('Resume file is not a valid PDF document.');
}

if (fs.existsSync(path.resolve('public/files/README.txt'))) {
  throw new Error('README resume substitute remains.');
}

if (fs.existsSync(path.resolve('public/media/profile/portrait.webp'))) {
  throw new Error('Public profile portrait remains.');
}

console.log(`Validated ${expected.length} projects, ${manifest.sources.length} sources, ${manifest.sources.length * 3} optimized media files and ${resumeBytes}-byte resume PDF.`);
