# 李佳颖个人作品集

面向 HR 浏览的中文个人作品集，内容涵盖品牌策划、视觉内容、摄影、新媒体运营和线下活动实践。

## 本地运行

```bash
npm ci
npm run dev
```

或在 Windows 解压后双击 `OPEN_PORTFOLIO.bat`。

## 验证

```bash
npm run media:optimize
npm run qa
npm run qa:round2
npm run qa:production
npm run qa:pages
```

媒体重新生成需要设置 `LI_JIAYING_MEDIA_SOURCE` 指向作品原始素材目录；原始约 80 MB 素材不会进入部署仓库。

## 内容位置

- 项目：`src/data/projects.ts`
- Profile：`src/data/profile.ts`
- 公开邮箱与电话开关：`src/config.ts`
- 真实简历下载：`public/files/cv/li-jiaying-resume.docx`
- 优化媒体：`public/media/`
- 素材映射：`media-sources/li-jiaying/manifest.json`

Round 2 视觉与下载验收证据位于 `visual-review/round-2/`，包括首页四种媒体、移动端、Profile、作品卡片、方案板图库、两种部署路径的 DOCX 下载记录，以及 Microsoft Word 实际打开记录。

部署步骤见 `DEPLOY_GITHUB_PAGES.md`，替换说明见 `CONTENT_REPLACEMENT.md`。
