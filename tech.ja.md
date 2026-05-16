# テックスタック

> 🌐 [English](./tech.md) · [简体中文](./tech.zh.md) · **日本語**

BioScope3D の確定済みテック選定。逸脱する場合は `AGENTS.md` § 8（意思決定の履歴）にエントリが必要です。

## レイヤー別

| レイヤー | ツール |
|---|---|
| **アプリ** | React 19, TypeScript 5, Vite 6 |
| **3D** | three.js 0.171, @react-three/fiber 9, @react-three/drei 10 |
| **ポスト処理** | @react-three/postprocessing 3（N8AO、Bloom）|
| **UI** | 単一 `globals.css`, lucide-react アイコン |
| **状態** | Zustand 5 + `persist` ミドルウェア |
| **アニメーション** | framer-motion 11 |
| **キーボード** | react-hotkeys-hook |
| **アセット** | GLB モデル、透過 PNG サムネイル、NIH プレビュー画像 |
| **検証** | Playwright Core、PNG ピクセル diff メトリクス（v1.0 で計画中）|

## リポジトリ構成

**bioscope3d** ワークスペース（clone ルートは **`bioscope3d/`**）は **pnpm ワークスペース**（ルートの `pnpm-workspace.yaml`）。各 Web アプリは **`apps/<name>/`** に置き、独自の `package.json` と Vite 設定を持つ。**`apps/bioscope3d`** が BioScope3D。**`apps/lab-hub`** は薄いランディング（リンクは環境変数）。**`apps/stellar-expanse`** は別プロダクトの船選択足場（細胞製品ではない）。

## コアライブラリ

- React 19
- Vite 6
- three.js
- React Three Fiber
- Drei
- Framer Motion
- Zustand
- Lucide React
- react-hotkeys-hook

## オプションのバックエンド（未接続）

- **Tripo API** —— GLB 生成のリモートバックエンド（v0.x はモック、本接続は v1.0 以降）
- **Hunyuan3D ローカル API** —— GLB 生成のローカルバックエンド（状態は同上）

## なぜこれで、別のものではないのか

制約（「代替不可」）は `AGENTS.md` § 3、実際の意思決定の記録（React 19 対応で R3F 9 を採用した理由、Redux / Recoil / Jotai ではなく Zustand を採用した理由など）は § 8 を参照。
