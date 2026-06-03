# Cell GLB models (GitHub Pages — scheme A)

Place downloaded `.glb` files in the repo-root **`models/`** directory (see `scripts/sync-models.mjs` for filenames), then:

```bash
pnpm sync:models
git lfs install   # once per machine, if any file is large
git add models/ apps/bioscope3d/public/models/
git commit -m "assets: add cell GLBs for Pages deploy"
git push
```

Vite copies this folder to `dist/models/` on build. CI runs `sync:models` then `verify-pages-models` before deploy.

**Limits:** GitHub rejects single files **> 100 MB**; use [Git LFS](https://git-lfs.com/) (see root `.gitattributes`). Pages site size should stay under ~1 GB.
