# 04 · MVP ロードマップ

> 🌐 [English](./04-mvp-roadmap.en.md) · [简体中文](./04-mvp-roadmap.md) · **日本語**

## ロードマップ全体像

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  MVP v0     │    │  MVP v1     │    │  MVP v2     │    │  MVP v3     │
│  静的版     │ →  │  コアループ │ →  │  完全 UX    │ →  │  高度機能   │
│  ~1 日      │    │  ~3–4 日    │    │  ~3–4 日    │    │  ~5+ 日     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## MVP v0 — 静的デザイン v2（現フェーズ）

> **目標**：リファレンス画像のすべての視覚的 / インタラクションのアンカーを静的 HTML として再現し、レビューとトーン確定に利用する。実 3D も R3F もまだ書かない。

**含むもの**：
- 上部バー：ロゴ + ブランド + タグライン + 4 タブ + アバター
- 左バー：CELL TYPES（サムネイル付き 7 項目）+ ORGANELLES（折り畳み可能）
- 中央：タイトル + Post-it ヒント + 3D キャンバス（動画クリップでプレースホルダ）+ ツールバー
- 中下：MICROSCOPE VIEW + COMPARE CELLS の 2 カード
- 右バー：ORGANELLE DETAILS + BIOLOGICAL NOTES + WHERE IT OCCURS

**成果物**：`design/v2/index.html`（ブラウザレビュー用）

**受け入れ基準**：
- ✅ リファレンス `docs/img/reference_studio.png` に対し 1024×640 ビューポートでピクセル diff
- ✅ フィールドレベルカバレッジ 100%（[02-design-gap.md](./02-design-gap.md) の 11 項修正リストすべて完了）

---

## MVP v1 — コアループ（P0 13 機能）

> **目標**：「開く → 細胞を 1 つ見る → 別の細胞へ切替 → 自動ツアー開始 → スクリーンショット」というメインフローを通す。レンダリングは Tripo 動画水準に到達。

| 機能 | 説明 |
|---|---|
| F01 複数細胞ライブラリ（7 種） | データ + GLB アセット準備 |
| F02 自動ツアー | カメラステートマシン |
| F03 細胞別駐留時間 | 設定ファイル |
| F04 ハードカット遷移 | useEffect で GLB スワップ |
| F05 細胞別カメラプリセット | `{ theta, phi, radius, target, fov }` |
| F06 最上級 PBR レンダリング | R3F + Drei `<Environment>` + `@react-three/postprocessing`（N8AO + Bloom + ToneMapping） |
| F07 静止表示 / ゆっくり自転 | `useFrame` で 0.001 rad/フレーム加算 |
| F08 Cinema モード | F キーでフルスクリーン / Esc で抜ける |
| F09 左バー選択 | onClick → setCellId |
| F10 OrbitControls | `<OrbitControls enableDamping />` |
| F11 モード切替 | `<motion>` でクロームを隠す |
| F12 一時停止 / ジャンプ / プログレス | State + Slider |
| F15 サムネイル | 事前に `ffmpeg -ss <t> -frames:v 1` で 7 枚生成 |
| F17/F18 再生コントロール | ◀ ⏸ ▶ |
| F19 タイムライン | `<Progress />` |
| F23 カメラリセット | `controls.reset()` |
| F28 スクリーンショット | `renderer.domElement.toBlob` |
| F31/F32/F34 メタデータ | `data/cells.json` |
| F46 キーボードショートカット | useHotkeys |

**テックスタック**（tech.md と整合）：
```
React 19 + Vite + TypeScript
@react-three/fiber + @react-three/drei
@react-three/postprocessing
framer-motion         (UI 動き)
lucide-react          (アイコン)
zustand               (軽量状態管理)
react-hotkeys-hook    (ショートカット)
```

**アセット準備**：
- 7 細胞分の GLB（手元に plant cell + epithelial cell；残りは当面プロシージャル / プレースホルダ）
- HDRI 1 枚（Tripo と同系のクリームグラデーション）
- サムネイル 7 枚（動画の各セグメントから 1 フレーム抽出）

**完了定義**：
- ブラウザで開く → デフォルトで Studio モードに入る
- 左バーで細胞をクリック → 中央のモデルとカメラプリセットが切り替わる
- Space を押す → Auto Tour に入り、4.5–7 秒のリズムで自動切替
- F を押す → Cinema モード（クローム完全消失、3D のみ）
- スクリーンショットボタンで PNG ワンクリックエクスポート
- Tripo 動画とのレンダリング品質 SSIM ≥ 0.7（100×100 パッチ評価）

---

## MVP v2 — 完全 UX（P1 追加）

### リファレンス画像機能（13 項目）

| 追加 | 説明 |
|---|---|
| F13 駐留時間調整 | 設定パネルでスライダー |
| F14 HDRI 切替 | 3 プリセット（クリーム / 暗紫 / 灰青） |
| F16 PBR 強化パイプライン | スタンドアロン Python スクリプト `enhance_glb.py`、オフラインで一度実行 |
| F24 View Mode 3 段階 | 実体 / Cross-Section / Exploded |
| F25 Cross-Section | clipping plane シェーダ |
| F29 30 秒 MP4 録画 | Puppeteer + ffmpeg バックエンド |
| F36 Where it Occurs | 静的シチュエーション画像 + オプション動画クリップ |
| F37 Microscope View | NIH / Cell Image Library から実写 4 枚 |
| F38 Compare Cells | 双 canvas を同期させた controls |
| F43 Notebooks | localStorage にビューポート + テキストを保存（F62 とマージ） |
| F49 PBR 強化トグル | baseGlb / enhancedGlb を切替 |
| F50 品質階層 | GPU 自動検出 → low / mid / high |
| F52 中英切替 | i18next |

### v1 翻案の新機能（7 P1）

| 追加 | 説明 |
|---|---|
| **F54 Specimen Card 学術 HUD** | キャンバス 4 隅オーバーレイ、スクリーンショットにデータ埋込 |
| **F55 Curator Attribution** | 細胞ごとの出典 / 貢献者 / 引用形式 |
| **F56 Mastery Progress** | 閲覧 / 注釈 / クイズ通過の累計 |
| **F57 Pipeline Status Indicator** | Raw → Baking → Enhanced → Compare の状態パルス |
| **F58 Taxonomy Breadcrumb** | Domain · Kingdom · Cell type 3 段階 |
| **F60 Tour Progress Bar** | `Cell 3 of 7 · 0:14 / 0:42` ドラッグでジャンプ（F19 とマージ） |
| **F62 Field Notes ユーザー注釈** | 説明エリアをノート化 |

**完了定義**：
- リファレンス画像で見える UI 要素すべてに実機能が乗っている（プレースホルダではない）
- v1 で気に入っていた視覚要素（HUD / パルス / 学術的質感）は科学的に翻案され F54–F60 になった
- 7 細胞すべてが PBR 強化後に視覚的改善
- 30 秒ツアーが MP4 で書き出せ、オリジナル Tripo 動画とほぼ区別不可

---

## MVP v3 — 高度機能（残り P2/P3）

### 元 P2 / P3

| 追加 | 説明 |
|---|---|
| F26 Isolate / F27 Hide Others | F35 に依存 |
| F33 hover ハイライト | F35 に依存 |
| F35 **細胞小器官の自動分離** | 色クラスタリング + 幾何アイランド + UV 領域分割 |
| F44 Guided Tour | ナレーションスクリプト + 自動カメラフライ |
| F45 Quiz Mode | 教育的付加価値 |
| F47 ドラッグアンドドロップアップロード | drop-zone + リアルタイム強化 |
| F48 Tripo / Hunyuan API | 実 API 接続（key 必要） |
| F53 PDF 解剖図エクスポート | jsPDF + 注釈合成 |

### v1 翻案 P2（3 項目）

| 追加 | 説明 |
|---|---|
| **F59 Render Budget Meter** | FPS / 三角面 / GPU 使用率のリアルタイム表示 |
| **F61 Model Quality Grade** | A/B/C/D 評価（normal SNR / UV 利用率 / 面数 / テクスチャ） |
| **F63 Onboarding Sequence** | 初回 5 ステップガイド |

---

## 工数見積（1 人フルタイム）

| ステージ | 工数 | 主リスク |
|---|---|---|
| v0 静的 v2 | 0.5–1 日 | なし |
| **v1 コアループ** | **3–4 日** | F06 レンダリング調整 / F05 カメラプリセット仕上げ |
| v2 完全 UX | 3–4 日 | F35 はスコープ外だが参照あり、調整が必要 |
| v3 高度機能 | 5+ 日 | F35 アルゴリズムは反復する可能性 |
| **合計** | **12–14 日** | F35 が最大の不確実性 |

---

## ステージごとの納品物

| ステージ | 納品物 | 受け入れ |
|---|---|---|
| v0 | `design/v2/index.html` | ブラウザでリファレンスと比較 |
| v1 | `apps/cell-studio/` がメインフローを通す | デモ画面録画 |
| v2 | Tripo 動画の 1:1 再現 + 完全 UI | ピクセル diff + フィールドカバレッジ |
| v3 | 小器官インタラクション + AI 生成 + ノート | 完全プロダクトデモ |
