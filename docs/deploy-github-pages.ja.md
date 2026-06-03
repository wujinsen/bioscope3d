# GitHub Pages デプロイ

> 🌐 [English](./deploy-github-pages.en.md) · [简体中文](./deploy-github-pages.zh.md) · **日本語**

## 初回設定

1. リポジトリ **Settings → Pages**
2. **Build and deployment → Source** で **GitHub Actions**
3. 下記 **方案 A（GLB コミット）** のあと `main` に push（または **Deploy GitHub Pages** を手動実行）

## 公開 URL（リポジトリ名 `bioscope3d`）

| パス | アプリ |
|------|--------|
| `https://<user>.github.io/bioscope3d/` | Lab Hub |
| `…/studio/` | BioScope3D |
| `…/heritage/` | 華夏古代 + 名剣 |

## 方案 A：細胞 GLB を Pages に同梱

CI はビルド前に `pnpm sync:models` と `verify-pages-models` を実行します。7 つの細胞 GLB が揃わないとデプロイは**失敗**します（hero 画像だけの公開を防ぐため）。

### 1. モデルを取得

メンテナー配布（Google Drive 等）からリポジトリルートへ:

```text
bioscope3d/models/
  tripo-plant-cell-test.glb
  animal-cell.glb
  …（他 5 ファイル、英語版 doc 参照）
```

### 2. 同期してコミット

```bash
pnpm sync:models
git lfs install
git add models/ apps/bioscope3d/public/models/
git commit -m "assets: add cell GLBs for GitHub Pages"
git push origin main
```

ルート `.gitattributes` で **Git LFS** を利用。単一ファイル **100 MB 超**は Git に push 不可。

### 3. 確認

**Deploy GitHub Pages** が成功したら:

`https://<user>.github.io/bioscope3d/studio/`

`/studio/models/*.glb` が **200** になることを確認。

## ローカル確認

```bash
pnpm sync:models
pnpm build:pages
npx serve page-dist
```

## GLB をコミットしない場合

3D は公開されません。workflow から verify を外すと hero のみになります。
