# 李佳颖作品集内容落地与 GitHub Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有 Hybrid Studio 工程内，将演示站完整替换为李佳颖的中文个人作品集，并形成可由 GitHub Actions 稳定部署到子路径的 GitHub Pages 源码包。

**Architecture:** 保留现有 React、Router、GSAP、数据驱动页面与样式系统，只维护一份 `projects.ts` 和一份 `profile.ts`。正式素材在本地归档后通过 Sharp 生成 base-safe WebP，项目详情按结构化 section 渲染；构建后为每条路由生成静态入口。

**Tech Stack:** React 18、TypeScript、Vite、React Router、GSAP、Sharp、Playwright、GitHub Actions Pages。

---

### Task 1: 基线与输入证据

**Files:**
- Create: `audit/before/`
- Create: `CONTENT_SOURCE_MAP.md`

- [ ] 从锁文件安装依赖并运行 `npm run qa`，记录当前构建证据。
- [ ] 以生产预览捕获首页、作品、详情与 Profile 基线截图。
- [ ] 解压作品素材到工作区外的 `_inputs`，记录原始文件尺寸、像素和分组。
- [ ] 从 DOCX 的 OOXML 文本框提取事实与证件照，明确不公开字段。

### Task 2: 正式媒体流水线

**Files:**
- Modify: `scripts/optimize-media.mjs`
- Create: `media-sources/li-jiaying/manifest.json`
- Create: `public/media/projects/**`
- Create: `public/media/profile/portrait.webp`

- [ ] 将用户素材复制到本地媒体归档并用安全 slug 建立映射。
- [ ] 为每张选用图片生成 thumbnail、detail，PPT/UI/海报另生成 zoom WebP。
- [ ] 校验输出尺寸、体积、方向和 7 个项目素材覆盖率。
- [ ] 删除 `public/demo` 与 `media-sources/demo`，确认源码无 demo 媒体引用。

### Task 3: 唯一内容模型与中文数据

**Files:**
- Modify: `src/types/content.ts`
- Modify: `src/data/projects.ts`
- Modify: `src/data/profile.ts`
- Modify: `src/config.ts`
- Modify: `scripts/validate-content.mjs`

- [ ] 将项目类型扩展为 text、image、gallery、presentation 与 quote section。
- [ ] 创建 tailo、kebike、bamboo-dream、haoshi、speaking-world、portrait-photography、poster-experiments 七个项目。
- [ ] 首页仅将 tailo、kebike、speaking-world、portrait-photography 标为精选。
- [ ] Profile 写入已核实的教育、实践、校园经历、能力与奖项；隐藏手机号、出生年月、性别、政治面貌和籍贯。
- [ ] 校验七个 slug、媒体存在性、中文字段、无虚构下载链接和无 demo 文本。

### Task 4: 中文界面、项目详情与 Lightbox

**Files:**
- Modify: `src/components/SiteHeader.tsx`
- Modify: `src/components/ProjectStage.tsx`
- Modify: `src/components/ProjectCard.tsx`
- Modify: `src/components/MediaSupport.tsx`
- Create: `src/components/Lightbox.tsx`
- Modify: `src/pages/ProjectsPage.tsx`
- Modify: `src/pages/ProjectPage.tsx`
- Modify: `src/pages/ProfilePage.tsx`
- Modify: `src/pages/NotFoundPage.tsx`
- Modify: `src/styles/*.css`

- [ ] 将导航、按钮、标签、标题、页脚和错误状态改为中文并设置 `lang=zh-CN`。
- [ ] 首页沿用方向 C 构图，只展示四个精选项目与李佳颖定位文案。
- [ ] 完整作品页展示七个项目，卡片继续由数据布局驱动。
- [ ] 详情页按 section 顺序呈现正文、图片、画廊和方案板。
- [ ] Lightbox 支持点击、Esc、方向键、焦点恢复和适当尺寸原图。
- [ ] Profile 使用编辑式时间轴，提供打印入口但不伪造 CV 下载文件。

### Task 5: GitHub Pages、SEO 与静态路由

**Files:**
- Create: `src/lib/assetUrl.ts`
- Modify: `src/App.tsx`
- Modify: `src/RouteEffects.tsx`
- Modify: `vite.config.ts`
- Modify: `index.html`
- Create: `scripts/generate-static-routes.mjs`
- Create: `.github/workflows/deploy.yml`
- Create: `public/.nojekyll`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`
- Delete: `public/_redirects`
- Delete: `vercel.json`

- [ ] 所有资源通过 `assetUrl()` 使用 `import.meta.env.BASE_URL`。
- [ ] BrowserRouter basename 与 Vite base 同时支持本地根路径和 Actions 仓库子路径。
- [ ] 构建后生成 projects、profile、七个详情页与 404 静态入口。
- [ ] 增加官方 Pages Actions、SEO 描述、favicon、robots、sitemap 与 `.nojekyll`。

### Task 6: 验证、文档与交付

**Files:**
- Modify: `scripts/qa-production.mjs`
- Create: `scripts/qa-pages.mjs`
- Create: `DEPLOY_GITHUB_PAGES.md`
- Create: `CONTENT_REPLACEMENT.md`
- Modify: `README.md`
- Create: `TEST_RESULTS.md`
- Create: `visual-review/final/`

- [ ] 运行媒体生成、lint、typecheck、内容校验与生产构建。
- [ ] 在 6 个视口验证首页、七个详情页、Lightbox、返回、刷新、404、reduced-motion 与打印。
- [ ] 以模拟仓库子路径构建并验证所有静态入口与资源请求。
- [ ] 扫描 Noise Studio、四个旧 slug、demo、绝对媒体路径和敏感字段。
- [ ] 写入中文部署与内容替换说明，记录媒体优化前后体积。
- [ ] 打包不含 node_modules、原始 80MB 素材和敏感信息的最终源码 ZIP，并校验哈希与条目。
