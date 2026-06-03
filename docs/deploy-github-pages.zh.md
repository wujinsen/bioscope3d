# GitHub Pages 部署

> 🌐 [English](./deploy-github-pages.en.md) · **简体中文** · [日本語](./deploy-github-pages.ja.md)

## 一次性设置

1. 打开仓库 **Settings → Pages**
2. **Build and deployment → Source** 选 **GitHub Actions**
3. 完成下方 **方案 A：提交 GLB**，再推送 `main`（或手动运行 **Deploy GitHub Pages**）

## 线上地址（仓库名 `bioscope3d`）

| 路径 | 应用 |
|------|------|
| `https://<你的用户名>.github.io/bioscope3d/` | Lab Hub 入口 |
| `…/studio/` | BioScope3D |
| `…/heritage/` | 华夏古文明 + 古剑录 |

## 方案 A：把细胞 GLB 打进 Pages（推荐）

CI 会在构建前执行 `pnpm sync:models`，并检查 7 个细胞 GLB 是否齐全。缺文件时部署会**失败**（避免线上只有水彩图）。

### 1. 下载模型

从维护者提供的 **Google Drive**（或 README 中的链接）下载到仓库根目录：

```text
bioscope3d/models/
  tripo-plant-cell-test.glb
  animal-cell.glb
  cancer-cell.glb
  tripo-bacteria-cell.glb
  neuron-cell.glb
  白血球.glb
  肌肉细胞.glb
```

### 2. 同步并提交

```bash
pnpm sync:models
git lfs install          # 首次使用；单文件 > 50MB 建议用 LFS
git add models/ apps/bioscope3d/public/models/
git commit -m "assets: add cell GLBs for GitHub Pages"
git push origin main
```

根目录 `.gitattributes` 已配置 `*.glb` 走 **Git LFS**。单文件不能超过 **100 MB**（Git 硬限制）。

### 3. 验证

推送后 Actions 里 **Deploy GitHub Pages** 应变绿。浏览器打开：

`https://<用户名>.github.io/bioscope3d/studio/`

Network 里 `/studio/models/*.glb` 应为 **200**，不再是 404。

## 本地预演

```bash
pnpm sync:models
pnpm build:pages
npx serve page-dist
```

## 若暂时不想提交大文件

不要推送空仓库触发 Pages；或临时改 workflow 去掉 `verify-pages-models` 步骤（线上仍无 3D）。
