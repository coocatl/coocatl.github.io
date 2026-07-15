import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const projectSeo = {
  tailo: ['尾焰 TAILO｜李佳颖作品集', 'IP 形象与 UI 设计作品。', 'media/projects/tailo/tailo-brand-board-01-thumbnail.webp'],
  kebike: ['可比克品牌线下快闪｜李佳颖作品集', '品牌策划、线下活动与新媒体传播实践。', 'media/projects/kebike/kebike-strategy-01-thumbnail.webp'],
  'bamboo-dream': ['竹梦百千万｜李佳颖作品集', '乡村与文化传播品牌策划方案。', 'media/projects/bamboo-dream/bamboo-dream-01-thumbnail.webp'],
  haoshi: ['豪士品牌策划案｜李佳颖作品集', '市场分析与营销传播策划练习。', 'media/projects/haoshi/haoshi-strategy-01-thumbnail.webp'],
  'speaking-world': ['用说话，造世界｜李佳颖作品集', '阿里云与千问主题系列视觉提案。', 'media/projects/speaking-world/speaking-world-01-thumbnail.webp'],
  'portrait-photography': ['创意人像摄影｜李佳颖作品集', '概念、造型与情绪人像摄影选辑。', 'media/projects/portrait-photography/portrait-concept-01-thumbnail.webp'],
  'poster-experiments': ['平面与海报实验｜李佳颖作品集', '海报、字体与视觉练习选辑。', 'media/projects/poster-experiments/poster-study-04-thumbnail.webp']
};
const routeSeo = {
  '': ['李佳颖｜品牌策划、视觉内容与新媒体运营作品集', '李佳颖个人作品集：品牌策划、视觉内容、新媒体运营与线下活动实践。', projectSeo.tailo[2]],
  projects: ['作品｜李佳颖个人作品集', '李佳颖的品牌策划、IP 与 UI、摄影和海报作品。', projectSeo.tailo[2]],
  profile: ['关于李佳颖｜经历与简历', '李佳颖的教育背景、实践经历、能力与联系方式。', 'favicon.svg'],
  ...Object.fromEntries(Object.entries(projectSeo).map(([slug, value]) => [`projects/${slug}`, value]))
};

const [owner, repository] = (process.env.GITHUB_REPOSITORY ?? 'USERNAME/REPOSITORY').split('/');
const isGitHubUserSite = repository.toLowerCase() === `${owner.toLowerCase()}.github.io`;
const defaultPublicUrl = isGitHubUserSite
  ? `https://${owner}.github.io/`
  : `https://${owner}.github.io/${repository}/`;
const base = process.env.VITE_PUBLIC_URL ?? defaultPublicUrl;
const index = path.resolve('dist/index.html');
const template = await readFile(index, 'utf8');
const escapeAttribute = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
function renderMeta(html, [title, description, image]) {
  const imageUrl = new URL(image, base).href;
  let rendered = html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(" \/>)/, `$1${escapeAttribute(description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(" \/>)/, `$1${escapeAttribute(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(" \/>)/, `$1${escapeAttribute(description)}$2`);
  rendered = rendered.replace('</head>', `    <meta property="og:image" content="${escapeAttribute(imageUrl)}" />\n  </head>`);
  return rendered;
}

await writeFile(index, renderMeta(template, routeSeo['']));
for (const [route, seo] of Object.entries(routeSeo)) {
  if (!route) continue;
  const folder = path.resolve('dist', route);
  await mkdir(folder, { recursive: true });
  await writeFile(path.join(folder, 'index.html'), renderMeta(template, seo));
}
await copyFile(index, path.resolve('dist/404.html'));
const routes = Object.keys(routeSeo);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${new URL(route ? `${route}/` : '', base)}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(path.resolve('dist/sitemap.xml'), sitemap);
const robots = await readFile(path.resolve('dist/robots.txt'), 'utf8');
await writeFile(path.resolve('dist/robots.txt'), `${robots.trim()}\nSitemap: ${new URL('sitemap.xml', base)}\n`);
console.log(`Generated ${routes.length} static route entries with route-specific SEO and sitemap.xml.`);
