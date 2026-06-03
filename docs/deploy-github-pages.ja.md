# GitHub Pages デプロイ

> 🌐 [English](./deploy-github-pages.en.md) · [简体中文](./deploy-github-pages.zh.md) · **日本語**

## 初回設定

1. リポジトリ **Settings → Pages**
2. **Build and deployment → Source** で **GitHub Actions** を選択
3. `main` に push（または workflow **Deploy GitHub Pages** を手動実行）

## 公開 URL（リポジトリ名 `bioscope3d`）

| パス | アプリ |
|------|--------|
| `https://<user>.github.io/bioscope3d/` | Lab Hub |
| `…/studio/` | BioScope3D |
| `…/heritage/` | 華夏古代 + 名剣 |

## GLB モデル

GLB は Git に含まれません。Pages ビルドは UI のみ。モデルが無い細胞は hero 画像表示のままです。  
3D を有効にするには Release や CDN に GLB を置き、`modelPath` をその URL に向けてください。

## ローカル確認

```bash
pnpm build:pages
# 出力: page-dist/
```
