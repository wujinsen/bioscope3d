# GitHub Pages deployment

> 🌐 **English** · [简体中文](./deploy-github-pages.zh.md) · [日本語](./deploy-github-pages.ja.md)

## One-time setup

1. Open **Settings → Pages** in the repo.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Complete **Scheme A: commit GLBs** below, then push to `main` (or run **Deploy GitHub Pages** manually).

## Live URLs (repo name `bioscope3d`)

| Path | App |
|------|-----|
| `https://<user>.github.io/bioscope3d/` | Lab Hub |
| `…/studio/` | BioScope3D |
| `…/heritage/` | Chinese heritage + swords |

## Scheme A: ship cell GLBs with Pages

CI runs `pnpm sync:models` and `verify-pages-models` before build. Deploy **fails** if any of the seven cell GLBs are missing (avoids a live site with hero images only).

### 1. Download models

Copy from maintainer storage (e.g. Google Drive) into the repo root:

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

### 2. Sync and commit

```bash
pnpm sync:models
git lfs install          # once per machine; use LFS for large files
git add models/ apps/bioscope3d/public/models/
git commit -m "assets: add cell GLBs for GitHub Pages"
git push origin main
```

Root `.gitattributes` tracks `*.glb` with **Git LFS**. Git rejects any single file **> 100 MB**.

### 3. Verify

**Deploy GitHub Pages** should go green. Open:

`https://<user>.github.io/bioscope3d/studio/`

`/studio/models/*.glb` requests should return **200**, not 404.

## Local dry-run

```bash
pnpm sync:models
pnpm build:pages
npx serve page-dist
```

## Without committing GLBs

Do not rely on Pages for 3D until GLBs are in the repo, or remove the verify step from the workflow (heroes only).
