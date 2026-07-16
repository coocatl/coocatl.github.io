# GitHub Pages 部署

1. 新建 GitHub 仓库并上传本源码。
2. 确保默认分支为 `main`。
3. 在仓库 `Settings → Pages → Build and deployment → Source` 选择 `GitHub Actions`。
4. 推送到 `main`，或在 Actions 中手动运行 `Deploy portfolio to GitHub Pages`。
5. 工作流会自动根据仓库名生成 Vite base、静态路由入口和 sitemap。

构建后会生成首页、作品页、关于页、七个项目详情入口及 `404.html`。所有图片使用 `import.meta.env.BASE_URL`，适配 `https://<username>.github.io/<repo>/`。

简历下载同样通过 `assetUrl` 适配仓库子路径。部署产物必须包含：

```text
files/cv/li-jiaying-resume.pdf
```

上线后请确认下载文件名为：

```text
李佳颖个人简历.pdf
```

并确认响应是有效 PDF，而不是 HTML 或 404 页面。

正式上线后请测试：首页、七个详情直达与刷新、移动端、微信内置浏览器、邮件链接和分享预览。若使用自定义域名，可在 Actions 中设置 `VITE_BASE_PATH=/` 与 `VITE_PUBLIC_URL`。
