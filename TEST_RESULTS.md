# 测试结果

## 静态、内容与构建

2026-07-15 最终执行 `npm run qa` 通过：ESLint 零警告、TypeScript、内容校验及根路径生产构建均成功。

内容校验确认：7 个正式项目、34 个媒体来源、102 个优化 WebP 文件，以及 126,522-byte 的真实简历 DOCX。公开目录中不存在旧证件照或 README 简历占位文件。

根路径构建：JavaScript 289.83 kB（gzip 100.94 kB），CSS 25.18 kB（gzip 6.01 kB）。生成 10 个独立静态路由入口及 sitemap。

`npm run preview` 已实际启动并返回 HTTP 200。

## Round 2 视觉验收

`npm run qa:round2` 通过 10 组检查并生成 `visual-review/round-2/`：

- 首页标题固定为三行，移动端无横向溢出；
- TAILO、可比克和“用说话，造世界”使用完整 contain 画布，摄影使用 4:5 cover 框；
- 四种首页媒体均位于媒体边界内，项目票签位于作品下方；
- Profile hero 中证件照数量为 0，真实 DOCX 下载操作可见；
- 7 张作品卡片具有 presentation、poster、photography 分类边界；
- 方案板图库与 Lightbox 均正常。

## 简历下载与 Word 打开

本地生产预览与模拟 GitHub Pages `/portfolio/` 子路径均通过真实点击下载：HTTP 200、建议文件名 `李佳颖个人简历.docx`、126,522 bytes、OOXML ZIP 签名、非 HTML，且 SHA-256 与原文件一致：

`543A0DA5F7F55DB92E1CC873B0A5265594634A4C220D2A5A0048280AEA5F2B29`

Microsoft Word 实际打开成功，窗口标题为 `li-jiaying-resume.docx - Word`。证据见 `visual-review/round-2/word-open-check.json` 与 `word-open-check.png`；汇总见 `cv-download-check.json`。

## 生产浏览器与 GitHub Pages

`npm run qa:production` 通过 26 项记录：六个视口、作品聚焦、详情、Lightbox、双向焦点循环、刷新、返回、Profile、打印、404、触摸、键盘、reduced-motion 及七个详情直达。控制台无警告或错误。打印模式验证 header 和 Profile 操作区均隐藏，证件照数量为 0。

以 `/portfolio/` 模拟仓库子路径构建，`npm run qa:pages` 验证首页、作品、Profile 和七个详情共 10 条路由：全部 HTTP 200、单一 h1、无破图、无控制台错误，hydration 后浏览器标题与静态标题一致。
