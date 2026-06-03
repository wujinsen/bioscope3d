# GitHub Pages deployment

> 🌐 **English** · [简体中文](./deploy-github-pages.zh.md) · [日本語](./deploy-github-pages.ja.md)

## One-time setup

1. Open **Settings → Pages** in the repo.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main` (or run the **Deploy GitHub Pages** workflow manually).

## Live URLs (repo name `bioscope3d`)

| Path | App |
|------|-----|
| `https://<user>.github.io/bioscope3d/` | Lab Hub |
| `…/studio/` | BioScope3D |
| `…/heritage/` | Chinese heritage + swords |

## GLB models

GLBs are **not** in Git; the Pages build ships UI only. Cells without a reachable model keep the watercolor hero image.  
To enable 3D: host GLBs on a Release or CDN and point `modelPath` at those URLs.

## Local dry-run

```bash
pnpm build:pages
# Output: page-dist/ — preview with npx serve page-dist
```
