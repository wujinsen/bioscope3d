# lab-hub

> 🌐 [English](./README.md) · [简体中文](./README.zh.md) · **日本語**

Monorepo のランディング。**BioScope3D**、**Stellar Expanse**、将来用のプレースホルダー（ロボット・惑星など）へのリンク。

## 開発

**リポジトリルート**で（[pnpm](https://pnpm.io/) 9+ が必要）:

```bash
pnpm install
pnpm dev:hub
```

既定: [http://127.0.0.1:5170](http://127.0.0.1:5170)

別ターミナルで兄弟アプリを起動してからカードを開いてください:

```bash
# BioScope3D → http://127.0.0.1:5173
pnpm dev:bioscope3d
# Stellar → http://127.0.0.1:5174
pnpm dev:stellar-expanse
```

**`pnpm` と同じ行に `# …` を貼り付けない**（ルートの `README.md` 参照）。Vite がパスに **`#`** と出る場合は `apps/lab-hub/` 直下の誤った **`#` フォルダ**を削除する。ブラウザで `localhost` が使えないときは **`http://127.0.0.1:ポート`** を使う。

## 環境変数

`.env.example` を `.env` にコピーし、本番やポート変更時に URL を調整。

## ビルド

```bash
pnpm --filter lab-hub build
```

出力: `apps/lab-hub/dist/`
