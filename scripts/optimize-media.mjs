import { mkdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sourceRoot = path.resolve(process.env.LI_JIAYING_MEDIA_SOURCE ?? '../_inputs/li-jiaying-assets/李佳颖作品集/李佳颖作品集');
const outputRoot = path.resolve('public/media');
const manifestRoot = path.resolve('media-sources/li-jiaying');

const sources = [
  ['tailo', '海报/IP形象-尾焰1.jpg', 'tailo-brand-board-01'], ['tailo', '海报/IP形象-尾焰2.jpg', 'tailo-brand-board-02'],
  ['tailo', '海报/UI1.png', 'tailo-ui-research'], ['tailo', '海报/UI2.png', 'tailo-ui-system'], ['tailo', '海报/UI3.png', 'tailo-ui-screens'],
  ['kebike', 'PPT/可比克1.png', 'kebike-strategy-01'], ['kebike', 'PPT/可比克2.png', 'kebike-strategy-02'],
  ['bamboo-dream', 'PPT/竹梦百千万1.png', 'bamboo-dream-01'], ['bamboo-dream', 'PPT/竹梦百千万2.png', 'bamboo-dream-02'], ['bamboo-dream', 'PPT/竹梦百千万3.png', 'bamboo-dream-03'],
  ['haoshi', 'PPT/豪士ppt1.png', 'haoshi-strategy-01'], ['haoshi', 'PPT/豪士PPT2.png', 'haoshi-strategy-02'], ['haoshi', 'PPT/豪士ppt3.png', 'haoshi-strategy-03'],
  ['speaking-world', '海报/阿里云1.jpg', 'speaking-world-01'], ['speaking-world', '海报/阿里云2.jpg', 'speaking-world-02'], ['speaking-world', '海报/阿里云3.jpg', 'speaking-world-03'], ['speaking-world', '海报/阿里云4.png', 'speaking-world-04'],
  ['portrait-photography', '摄影/1.jpg', 'portrait-concept-01'], ['portrait-photography', '摄影/2.png', 'portrait-concept-02'], ['portrait-photography', '摄影/3.jpg', 'portrait-concept-03'], ['portrait-photography', '摄影/4 .jpg', 'portrait-concept-04'], ['portrait-photography', '摄影/5.jpg', 'portrait-concept-05'], ['portrait-photography', '摄影/6.jpg', 'portrait-concept-06'], ['portrait-photography', '摄影/8.jpg', 'portrait-concept-07'],
  ['poster-experiments', '海报/形状1.jpg', 'shape-study-01'], ['poster-experiments', '海报/形状2.jpg', 'shape-study-02'],
  ...Array.from({ length: 8 }, (_, index) => ['poster-experiments', `海报/海报${index + 1}.${[4, 8].includes(index + 1) ? 'png' : 'jpg'}`, `poster-study-${String(index + 1).padStart(2, '0')}`])
];

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });
await mkdir(manifestRoot, { recursive: true });

const records = [];
for (const [project, relative, slug] of sources) {
  const input = path.join(sourceRoot, relative);
  const output = path.join(outputRoot, 'projects', project);
  await mkdir(output, { recursive: true });
  const metadata = await sharp(input).metadata();
  const originalBytes = (await stat(input)).size;
  const variants = [];
  for (const [name, width, quality] of [['thumbnail', 760, 78], ['detail', 1800, 84], ['zoom', 2600, 88]]) {
    const target = path.join(output, `${slug}-${name}.webp`);
    await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality, effort: 5 }).toFile(target);
    const generated = await sharp(target).metadata();
    variants.push({ name, file: path.relative(path.resolve('public'), target).replaceAll('\\', '/'), width: generated.width, height: generated.height, bytes: (await stat(target)).size });
  }
  records.push({ project, source: relative, slug, original: { width: metadata.width, height: metadata.height, bytes: originalBytes }, variants });
}

await writeFile(path.join(manifestRoot, 'manifest.json'), JSON.stringify({ generatedAt: new Date().toISOString(), sources: records }, null, 2));

const before = records.reduce((sum, record) => sum + record.original.bytes, 0);
const after = records.flatMap((record) => record.variants).reduce((sum, variant) => sum + variant.bytes, 0);
console.log(`Optimized ${records.length} source images: ${before} bytes -> ${after} bytes across ${records.length * 3} WebP variants.`);
