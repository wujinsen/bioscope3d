# GitHub Pages 部署

> 🌐 [English](./deploy-github-pages.en.md) · **简体中文** · [日本語](./deploy-github-pages.ja.md)

## 一次性设置

1. 打开仓库 **Settings → Pages**
2. **Build and deployment → Source** 选 **GitHub Actions**
3. 推送 `main` 分支（或手动运行 workflow **Deploy GitHub Pages**）

## 线上地址（仓库名 `bioscope3d`）

| 路径 | 应用 |
|------|------|
| `https://<你的用户名>.github.io/bioscope3d/` | Lab Hub 入口 |
| `…/studio/` | BioScope3D |
| `…/heritage/` | 华夏古文明 + 古剑录 |

## 模型（GLB）

GLB **不在 Git** 里，Pages 构建不会带上大模型。站点可正常打开，无 GLB 的细胞会显示水彩 hero 图。  
若需 3D 模型：将 GLB 放到 [GitHub Release](https://docs.github.com/en/repositories/releasing-projects-on-github) 或对象存储，再改 `cells.ts` 中的 URL（或使用 `publicUrl` + 外链）。

## 本地预演

```bash
pnpm build:pages
# 产物在 page-dist/，可用 npx serve page-dist 预览
```
