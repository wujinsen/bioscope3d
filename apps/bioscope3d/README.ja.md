# BioScope3D

> 🌐 [English](./README.md) · [简体中文](./README.zh.md) · **日本語**

> インタラクティブな 3D 細胞ビューア —— 顕微鏡スケールで生命を探索。

**生徒・教師・研究者**のための Web アプリ。高品質な GLB モデルの上で、観察・比較・断面切り出しを行い、3 層構造の体験モードを 1 つのトグルで切り替えます。

---

## 3 つのモード、1 つの製品

| モード | 対象 | 強調する要素 |
|---|---|---|
| **Explore** | K-12・愛好家・好奇心旺盛な一般層 | 水彩ビジュアル · Caveat 引き出し線 · クイズ · 控えめなヒント |
| **Teach** | 教育者 | プロジェクション対応 · ガイドツアー作成 · 大きなヒット領域 |
| **Research** | 生物学者・論文執筆者 | µm 精度 · 計測 · HUD 表示 · 完全なエクスポートドロワー |

切り替えは上部バー右上のセグメントコントロールで。

---

## クイックスタート

**リポジトリルート**から（推奨 — pnpm ワークスペース）:

```bash
pnpm install
# http://127.0.0.1:5173
pnpm dev:bioscope3d
```

またはこのフォルダだけ npm:

```bash
cd apps/bioscope3d
npm install
# http://127.0.0.1:5173
npm run dev
```

```bash
npm run build        # 本番ビルド → dist/
npm run preview      # 本番成果物をローカルでプレビュー
npm run typecheck    # tsc -b
npm run lint         # eslint --max-warnings 0
```

---

## スタック

| 関心事 | 選定 | 理由 |
|---|---|---|
| **ビルド** | Vite 6 + TypeScript 5 | 即時 HMR、ネイティブ ESM |
| **UI** | React 19 | Server actions、transitions、useOptimistic |
| **状態** | Zustand 5 + persist | 軽量、プロバイダ不要、localStorage 連携 |
| **3D** | three.js 0.171 + R3F 9 + Drei 10 | 業界標準のシーングラフ + React DSL |
| **後処理** | @react-three/postprocessing 3 | Bloom（N8AO は削除。`PostFx.tsx` 参照） |
| **アニメーション** | framer-motion 11 | ドロワーのスライド、画面遷移 |
| **アイコン** | lucide-react | tree-shake 可・水彩と相性の良いストローク |
| **キーボード** | react-hotkeys-hook | 1-7 細胞 / L ラベル / X 断面 / F1 自動回転 / **F2** Bloom / R リセット |
| **Lint** | eslint 9 + typescript-eslint | flat config |

---

## キーボードショートカット

| キー | 動作 |
|---|---|
| `1` – `7` | 細胞タイプの切替 |
| `L` | 細胞小器官ラベルの切替 |
| `X` | 断面クリッピングの切替 |
| `Space` | オートツアー切替 |
| `E` | エクスポートドロワーを開く |
| `F1` | アイドル自動回転の切替 |
| `F2` | Bloom を切替 — **最上段の物理キー F2**（数字の「2」とは別）；Mac は **Fn+F2** が必要なことも／キーボード設定で F キーを標準に設定 |
| `R` | カメラリセット |
| `F` | 現在の選択にフォーカス（v0.2 では R と同等） |
| `Esc` | ドロワー / ポップオーバーを閉じる |

---

## ディレクトリ構成

```
apps/bioscope3d/
├── public/
│   ├── models/                    /models/*.glb のコピー（/models/… で配信）
│   ├── env_maps/                  HDRI 環境マップ（v0.3+ ローカル .hdr）
│   └── assets/
│       ├── cells/                 7 つの円形水彩サムネイル（192²）
│       └── scenes/                Stage hero と WHERE IT OCCURS 画像
├── src/
│   ├── main.tsx                   エントリ —— tokens.css → reset.css → globals.css の順で読み込み
│   ├── App.tsx                    トップレベルレイアウト + グローバルキーボード + body[data-*] 同期
│   ├── layouts/
│   │   └── StudioLayout.tsx       3 カラム CSS grid（top / left / main / right）
│   ├── components/
│   │   ├── topbar/                Brand · Nav · ModeSwitch · UserMenu
│   │   ├── sidebar-left/          CellTypes · Organelles
│   │   ├── sidebar-right/         OrganelleDetails · BiologicalNotes · WhereItOccurs
│   │   ├── canvas-head/           Breadcrumb · Title · PipelineBadge（PBR ポップオーバー）
│   │   ├── stage/                 3D ステージ + あらゆる DOM オーバーレイ
│   │   │   ├── Stage.tsx          すべてを組み合わせ、<CellScene /> をマウント
│   │   │   ├── Callouts.tsx       SVG 引き出し線 + Caveat ラベル
│   │   │   ├── PostIt.tsx · ViewModePanel.tsx · ScaleBar.tsx · HudCorners.tsx · PostFxToast.tsx
│   │   │   ├── StageToolbar.tsx · TourBar.tsx · ExportDrawer.tsx
│   │   ├── bottom/                MicroscopePanel · ComparePanel
│   │   └── ui/                    （計画中）Switch / Pill / Drawer / IconButton 等のプリミティブ
│   ├── 3d/                        ライブ R3F シーングラフ
│   │   ├── CellScene.tsx          <Canvas> ルート · ACES トーンマップ · sRGB · 透過クリア
│   │   ├── CellModel.tsx          useGLTF · PBR パス · クリッピング平面
│   │   ├── SceneEnvironment.tsx   HDRI プリセット（Studio · Lab · Sunset）
│   │   ├── PostFx.tsx             HDR Bloom
│   │   └── CameraRig.tsx          OrbitControls + autoRotate + reset
│   ├── data/
│   │   ├── cells.ts               7 細胞のメタデータ
│   │   └── organelles.ts          細胞別の小器官 + 引き出し線座標
│   ├── stores/
│   │   └── useAppStore.ts         Zustand 単一ストア · localStorage 永続化
│   ├── hooks/
│   │   └── useKeyboard.ts         グローバルホットキー
│   ├── lib/
│   │   └── pbr.ts                 enhancePBR() · setClippingPlane() · 可逆トグル
│   ├── styles/
│   │   ├── tokens.css             CSS カスタムプロパティ（色 / フォント / シャドウ）
│   │   ├── reset.css              CSS リセット
│   │   └── globals.css            レイアウトとコンポーネントスタイル（design/v3 からの移植）
│   └── types/
│       └── index.ts               共有 TypeScript 型
```

---

## 機能ロードマップ

| フェーズ | 範囲 | 状態 |
|---|---|---|
| **v0.1** | 足場 + v3.2 デザインを React コンポーネント化 | ✅ 完了 |
| **v0.2** | R3F Canvas + GLB ロード + HDRI + PBR 強化 + 自動回転 | ✅ 完了 |
| v0.3 | 実測ツール · µm アンカー · ドラッグ可能な断面ハンドル | 次 |
| v0.4 | プロセスタイムライン —— 光合成（W1 初版） | – |
| v0.5 | エクスポートドロワー配線（GLB · PNG · 引用） | – |
| v0.6 | クイズモード | – |
| v0.7 | 7 細胞すべての専用 GLB（現状 plant + animal のみ） | – |
| v0.8 | URL ハッシュ同期（共有可能なビュー） | – |
| v1.0 | 仕上げ + レスポンシブ + a11y + i18n | – |
| v1.x | Powers-of-Ten ズーム（W2）· 注釈共有（Pro4）· GLB インポート（Pro2） | 将来 |

---

## ソースアセット

キュレーション済み **`models/*.glb`** は Git に含まれません。**Google Drive**（リンクはリポジトリ外で共有）から取得し、ワークスペースルートの **`models/`** に置いてから **`pnpm sync:models`** を実行してください。`data/*.mp4` は分析用にリポジトリルートに残します。シーン PNG は引き続き `public/assets/scenes/` へ手動ミラー。それ以外の一括同期は v0.3 の `scripts/sync-assets.sh` を予定しています。

Vite の HMR 開発中は、`/models/...` と `/assets/...` の URL から `public/` 配下が直接解決されます。

---

## 関連リンク

- [`../../README.md`](../../README.md) —— リポジトリ全体の概要
- [`../../AGENTS.md`](../../AGENTS.md) —— AI コーディングエージェント規約（意思決定履歴、命名ルール、「細胞の追加方法」プレイブック）
- [`../../CHANGELOG.md`](../../CHANGELOG.md) —— バージョン履歴
- [`../../docs/`](../../docs/) —— デザイン分析と機能仕様
