# stellar-expanse

> 🌐 [English](./README.md) · [简体中文](./README.zh.md) · **日本語**

別プロダクト: **Stellar Expanse** の船選択 UI。本パッケージは **Vite + React** で、`pnpm dev:stellar-expanse` の画面は凍結した高忠実度プロトタイプ `design/v4-stellar-expanse/index.html` にレイアウト・トークン・操作感を揃えています。オフライン用に `public/stellar/` に軽量 SVG を同梱しています。写真版に合わせる場合は `design/v4-stellar-expanse/assets/` の画像を `public/stellar/` へコピーし、`src/data/ships.ts` のパスを差し替えてください。

明示的な判断がない限り、`apps/bioscope3d` へ統合しないでください。

## 開発

リポジトリルートで:

```bash
pnpm install
pnpm dev:stellar-expanse
```

[http://127.0.0.1:5174](http://127.0.0.1:5174)

## ビルド

```bash
pnpm --filter stellar-expanse build
```
