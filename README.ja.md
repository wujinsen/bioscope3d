# BioScope3D

> 🌐 [English](./README.md) · [简体中文](./README.zh.md) · **日本語**

> オープンソースのインタラクティブな 3D 細胞ビューア。**生徒・教師・研究者**のために設計。
> React 19 + React Three Fiber + Vite で構築、水彩 / 生物学教科書風のデザイン。

![v0.2 スクリーンショット](apps/bioscope3d/screenshot_v0.2.png)

---

## これは何か

**BioScope3D** は、AI 3D サービス（Hunyuan3D、Tripo3D）から取得した GLB 細胞モデルを、インタラクティブな学習体験に変える Web アプリケーションです：

- 厳選した 7 種類の細胞 —— 植物・動物・細菌・赤血球・ニューロン・白血球・筋肉
- 上部バー右上の単一セグメントコントロールで切り替える、3 層構造の体験モード
- 手描きの引き出し線、水彩のサムネイル、ふせん風ヒント、Caveat 手書きフォント
- 本格 PBR レンダリング —— HDRI 環境光、N8AO、Bloom、ワールド空間クリッピング
- ロードマップにある研究者向けツール: カメラ距離に連動する µm スケールバー、計測、GLB / glTF / USDZ / FBX エクスポート

3 つのモード：

| モード | 対象 | 強調する要素 |
|---|---|---|
| **Explore**（デフォルト） | K-12・愛好家 | 楽しさ・引き出し線・クイズ |
| **Teach** | 教育者 | プロジェクション対応・ガイド付きツアー |
| **Research** | 生物学者 | µm 精度・計測・HUD・エクスポートドロワー |

---

## クイックスタート

このリポジトリは **pnpm monorepo**（`apps/*`）です。**ルート**で一度インストール:

```bash
pnpm install
# ラボ入口 → http://127.0.0.1:5170
pnpm dev:hub
# BioScope3D → http://127.0.0.1:5173
pnpm dev:bioscope3d
# 宇宙船スキャフォールド → http://127.0.0.1:5174
pnpm dev:stellar-expanse
```

**キュレーション済み GLB**は Git に含まれていません。保守者の **Google Drive**（リンクは別途共有 — リリースノートや wiki など）から取得し、リポジトリルートの **`models/`** に置いたあと、**`pnpm sync:models`** を実行して各アプリの `public/models/` を Vite 用に接続してください。

**`pnpm` と同じ行に `#` コメントを付けたまま一括貼り付けないでください**（Cursor / Windows 等では `#` や `http://…` が Vite に引数として渡り、プロジェクトルートが `lab-hub/#` のように誤解され、ポートもずれます）。

**ブラウザが開かない / 真っ白なとき:** **`http://127.0.0.1:<port>`** を使う（`localhost` だけに頼らない）—— 一部の macOS / IPv6 では `localhost` が `::1` になり、Vite が IPv4 のみに bind していると不一致になる。Vite がパスに **`#`** と出る場合は、`apps/lab-hub/` 直下の **`#` フォルダ**を削除する。各 `vite.config.ts` は明示的な `root` を設定済みです。

単一アプリだけ npm で続行しても構いません:

```bash
cd apps/bioscope3d
npm install
# http://127.0.0.1:5173
npm run dev
```

ルートから全アプリ向け:

```bash
pnpm build           # "build" スクリプトがあるパッケージをすべてビルド
pnpm typecheck       # 全アプリの TypeScript
```

リポジトリルートには **pnpm 9+** が必要（`corepack enable pnpm` または `npm i -g pnpm`）。ロックファイル: `pnpm-lock.yaml`。

`apps/bioscope3d` 内（npm または pnpm）:

```bash
npm run build        # 本番ビルド → dist/
npm run preview      # 本番ビルドをローカルでプレビュー
npm run typecheck    # tsc -b
npm run lint         # eslint
```

---

## リポジトリ構成

```
bioscope3d/                           リポジトリルート（clone 先は `bioscope3d/` を推奨）
├── package.json                     pnpm ワークスペースルート（pnpm-workspace.yaml 参照）
├── apps/
│   ├── bioscope3d/                  BioScope3D — Web アプリ（React + R3F + Vite）
│   ├── lab-hub/                     ラボ入口（兄弟アプリへのリンク）
│   └── stellar-expanse/             Stellar Expanse — 宇宙船（別プロダクトの足場）
├── models/                          ソース GLB モデル（3 細胞、約 195 MB）
├── data/                            ソース参考動画（4 mp4、約 85 MB）
├── design/                          静的なデザインプロトタイプ
│   ├── ref/                         ユーザー提供のリファレンス画像
│   ├── v2/  v3/                     反復版（履歴 —— 改名前で "Cell Architecture Studio" 名義のまま）
│   └── v3/index.html                最終 v3.2 —— React アプリのピクセル単位の真実
├── docs/                            プロジェクト分析 + ロードマップ
│   ├── 01-video-analysis.md         7 セグメントの自動ツアー構造
│   ├── 02-design-gap.md             v1 → v2 → リファレンス比較
│   ├── 03-features.md               63 件の機能要件 F01–F63
│   ├── 04-mvp-roadmap.md            v0 → v1.0 段階計画
│   └── 05-open-questions.md         意思決定ログ
├── tech.md                          確定したスタック（React 19、R3F、Drei、…）
├── AGENTS.md                        AI コーディングエージェント向け規約（AI なら最初に読む）
├── CHANGELOG.md                     バージョン履歴
├── LICENSE                          MIT
└── README.md                        英語版（あなたが今見ているファイルの英語版）
```

---

## 何をどこで見るか

| 知りたいこと | 読む先 |
|---|---|
| 何を作っているか | `docs/03-features.md` |
| なぜこのデザインか | `design/ref/cell_architecture_studio.png` + `docs/02-design-gap.md` |
| 作業を拾う | `apps/bioscope3d/README.md` → "Feature roadmap" |
| アプリの内部構造 | `AGENTS.md` |
| アプリを動かす | ルート `README.md`（pnpm）· `apps/bioscope3d/README.md` |
| ラボ入口 | `apps/lab-hub/README.md` |
| 何がいつ出たか | `CHANGELOG.md` |

---

## ステータス

| フェーズ | 内容 | 進捗 |
|---|---|---|
| 調査 | 動画 / モデル / テクスチャ分析 | ✅ 完了 —— `docs/` 参照 |
| 設計 | v0 → v3.2 静的プロトタイプ | ✅ 完了 —— `design/v3/` 参照 |
| 足場 | React + Vite + R3F + Zustand | ✅ v0.1 出荷 |
| **3D 実装** | ライブ R3F Canvas + HDRI + PBR パイプライン | ✅ **v0.2 出荷** |
| インタラクション | µm スケール・計測・ドラッグ可能な断面ハンドル | ◐ v0.3 次の対象 |
| 機能 | タイムライン / エクスポート / クイズ / 細胞別 GLB | ◐ v0.4–v0.7 |
| 仕上げ | レスポンシブ · アクセシビリティ · 国際化 | ◐ v1.0 |

---

## リポジトリのフォルダ名

**BioScope3D** と揃えるため、clone 先は **`bioscope3d/`** を推奨します。古い作業ディレクトリ名 **`3D2/`** のままでも動きますが、`mv 3D2 bioscope3d` で揃え、ワークスペースを開き直してください。Python venv など絶対パスを埋め込んだツールは要更新です。詳細は [`AGENTS.md`](./AGENTS.md) の意思決定履歴。

---

## License

MIT —— [LICENSE](./LICENSE) を参照。

ソース 3D モデルは [Tripo3D](https://www.tripo3d.ai/) と [Hunyuan3D](https://3d.hunyuan.tencent.com/) からそれぞれの利用規約に従ってダウンロードしています。
