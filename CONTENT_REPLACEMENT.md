# 内容替换说明

- 所有项目只维护 `src/data/projects.ts`，不要建立第二份中文数据。
- 项目图片放入 `public/media/projects/<slug>/`，路径通过 `assetUrl()` 生成。
- 新作品应同时准备 thumbnail、detail、zoom 三档 WebP，并写明准确 alt。
- Profile 只维护 `src/data/profile.ts`；公开邮箱及电话开关位于 `src/config.ts`。
- 当前没有 PDF 或 PPTX 原文件，因此页面不显示伪造下载按钮。将来加入正式文件时再增加真实入口。
- 发布前运行 `npm run qa`，并重新执行浏览器与 Pages 子路径检查。
