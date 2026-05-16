# AGENTS.md —— BioScope3D の AI コーディングエージェント向け規約

> 🌐 [English](./AGENTS.md) · [简体中文](./AGENTS.zh.md) · **日本語**

> **コードに触れる前に、これを読んでください。**
> このファイルは、プロジェクトと AI コーディングアシスタント（Cursor、Claude Code、GitHub Copilot Workspace など）の間の契約です。ファイルツリーからは見えない決定 —— なぜこう作ったのか、何は変えないのか、新しいものをどこに置くのか —— を記録しています。

> **命名についての注意。** 製品名は **BioScope3D** です。以前は "Cell Architecture Studio" と呼ばれていましたが、その名前は `design/v2/index.html` と `design/v3/index.html`（凍結したプロトタイプ）および `docs/` 内の歴史的記述にのみ残っています。新しいコード、新しいドキュメント、新しいコミットでは **BioScope3D** を使ってください。

---

## 1. ミッション

**Web 上で最高のオープンソース細胞ビューア**を作る。3 つのオーディエンス、**1 つの製品**（重ね合わせた階層構造であり、3 つの別アプリではない）：

| ユーザー | モード | 重視するもの |
|---|---|---|
| K-12 の生徒 | `Explore`（デフォルト） | 楽しさ · 引き出し線 · クイズ · Caveat 手書き |
| 教師 | `Teach` | プロジェクション · 自作ツアー · 大きなヒット領域 |
| 研究者 | `Research` | µm 精度 · 計測 · HUD 表示 · GLB / USDZ / 引用エクスポート |

上部バー右上のセグメントコントロール（`Topbar.tsx::ModeSwitch`）で切り替えます。モードは `body[data-mode]` 属性を駆動し、要素の表示/非表示は CSS で制御します。

**作らないもの：**
- Sketchfab のクローン（モデルマーケットプレイスは作らない）
- 研究用顕微鏡データのストア（DICOM 非対応、PACS 非対応、大容量アップロードはしない）
- 汎用 3D エディタ（任意のオブジェクトのトランスフォーム gizmo は作らない）
- Notion の競合（Notebooks タブはエクスポート先であって、主役の画面ではない）

---

## 2. ビジュアルの北極星

| 真実 | ファイル |
|---|---|
| リファレンスデザイン | `design/ref/cell_architecture_studio.png` |
| ピクセル単位の HTML 実装 | `design/v3/index.html`（ブラウザで開ける；自己完結） |
| 並列比較 | `design/v3/compare_ref_v3_v31.png` |

「ここは Caveat ？ Inter ？」「これで合ってる？」と迷ったら、**`design/v3/index.html` を開いてください。それが正典です**。

ビジュアル語彙：
- 水彩 · ビンテージ植物図鑑 · 生物学教科書
- **Caveat**（手書き）—— セクション見出し、引き出し線、ふせん
- **DM Serif Display** —— ページタイトル、細胞名
- **Inter** —— UI ラベルとボタン
- **JetBrains Mono** —— 数字、ファイル拡張子、µm 値
- クリームペーパー背景 `#f2ece0`、オリーブ + ライラックのアクセント
- 各細胞に固有色（`--cell-plant`、`--cell-rbc` 等）があり、`--cell-current` を通じて pill / 枠線 / トグルなどに反映される

---

## 3. スタック（確定 —— `tech.md` を参照）

| 層 | 採用 | 代替不可 |
|---|---|---|
| ビルド | Vite 6 | Webpack · Next.js |
| フレームワーク | React 19 | Vue · Svelte · SolidJS |
| 状態 | Zustand 5 + `persist` ミドルウェア | Redux · Recoil · Jotai · useContext + Provider |
| 3D | three.js 0.171 + R3F 9 + Drei 10 | babylon.js · 素の three.js |
| ポスト処理 | `@react-three/postprocessing` 3 | 自作 pass |
| アニメーション | framer-motion 11 | react-spring（基本） |
| アイコン | `lucide-react` | インライン SVG（brand mark のみ可） |
| キーボード | `react-hotkeys-hook` | 手書き keydown |
| スタイル | 単一の `globals.css` —— 足りなくなるまで | CSS-in-JS · Tailwind · styled-components |
| Lint | typescript-eslint flat config | tslint |

**厳格ルール：**
- **状態ライブラリを追加しない**。Zustand が UI + ドメイン状態すべてを担う。
- **CSS フレームワークを追加しない**。デザイントークンは `tokens.css` —— トークンを使う。
- **`tsconfig.json::strict` を無効化しない**、`any` を使わない。
- **コードを言い換えただけのコメントを書かない**。コメントは**なぜ**を語り、**何をしているか**は語らない。

---

## 4. ディレクトリ構成（ADR なしに再編しないこと）

```
apps/bioscope3d/
├── src/
│   ├── main.tsx              エントリ：<App /> をマウント、3 つの CSS を順序通りインポート
│   ├── App.tsx               トップレベル：<StudioLayout /> + グローバルホットキー + body[data-*] 同期
│   ├── layouts/              ページレベルのグリッド
│   │   └── StudioLayout.tsx
│   ├── components/           UI コンポーネント、**画面領域別**に整理（機能別ではない）
│   │   ├── topbar/           Brand + Nav + ModeSwitch + UserMenu（全部 Topbar.tsx 内）
│   │   ├── sidebar-left/     CellTypes + Organelles リスト
│   │   ├── sidebar-right/    OrganelleDetails + BiologicalNotes + WhereItOccurs
│   │   ├── canvas-head/      Breadcrumb + <h1> + PipelineBadge（PBR ポップオーバー）
│   │   ├── stage/            3D 領域 + 全てのオーバーレイ（10 ファイル）
│   │   ├── bottom/           MicroscopePanel + ComparePanel
│   │   └── ui/               再利用可能なプリミティブ（Switch、Pill、Drawer、IconButton）
│   ├── 3d/                   R3F シーングラフ（CellScene、CellModel、ClippingHandle、…）
│   ├── data/                 純粋データ：cells.ts · organelles.ts · tour.ts
│   ├── stores/               useAppStore.ts（Zustand）
│   ├── hooks/                共有 hooks（useKeyboard、useTour、useUrlState）
│   ├── lib/                  純粋ヘルパー（export.ts、pbr.ts、persistence.ts）
│   ├── styles/               tokens.css → reset.css → globals.css（この順でロード）
│   └── types/                共有 TypeScript 型
```

上記 BioScope3D の画面マップに**含まれない** `apps/*`（pnpm ワークスペース）:

```
apps/lab-hub/              Vite + React のランディング。カードは兄弟 dev サーバー / デプロイ URL（`VITE_*`）へリンク。
apps/stellar-expanse/      独立した船選択プロダクト（Vite + React 足場）。高忠実度の静的参照: `design/v4-stellar-expanse/`。**ADR なしに** `apps/bioscope3d` へ UI を統合しない。
```

ルール：
- コンポーネントは**画面領域**（`topbar/`、`sidebar-left/`、…）でフォルダ分けする。機能別（`auth/`、`profile/` のような）にはしない。UI は単一ページの studio。
- 純粋データは `data/`。**絶対にコンポーネント内に細胞メタデータをインラインで書かない**。
- シーン / 3D ロジックは `3d/` に。**`components/stage/` には置かない**。
- 「stage オーバーレイ」（Post-it、ViewMode panel、Tour bar、…）は R3F `<Canvas>` の DOM 兄弟であって、Three.js のメッシュではない。

---

## 5. 状態の規約

ストアは**ひとつだけ**：`stores/useAppStore.ts`。

UI トグル、選択中の細胞、選択中の小器官、お気に入り、ドロワーの開閉 —— すべてこれを経由する。

```ts
const cell = useAppStore((s) => s.activeCell);  // ✓ 1 スライスをサブスクライブ
const all  = useAppStore();                      // ✗ あらゆる変更で再レンダー
```

`persist` ミドルウェアは `localStorage` に key `bioscope3d:app-state` で書き出す（schema v3）。`partialize` 関数で何を永続化するかを制御（`pbrPopoverOpen` のような短命 UI は除外）。

第二のストアが必要な場合は `stores/useUiStore.ts` を短命 UI 専用に作る。**ストア数を増殖させない**。

---

## 6. CSS の規約

v3.2 の HTML/CSS を `styles/globals.css` に **1:1** で移植しました。**セレクタとクラス名は完全に一致しています**。React コンポーネントは className をそのまま渡すだけ：

```tsx
<div className="stage">     {/* .studio-stage にリネームしない */}
<div className="callout-label">  {/* .annotation にリネームしない */}
```

ルール：
- 新クラス名は `lowercase-with-hyphens`、所属領域内でスコープ（`.stage-toolbar`、`.callout-label`）。
- トークン（`var(--olive-dk)`）—— **必ず使う、HEX をハードコードしない**。
- 細胞に属するように見える新色は `tokens.css` に `--cell-xxx` として追加。決してインラインしない。
- モード駆動の可視性：`body[data-mode="research"] .foo { … }` を、React の条件レンダリングよりも優先。
- 細胞色のフロー：`body[data-cell="…"]` からカスケードする `--cell-current` に依存。細胞色を React props で渡さない。

CSS Modules への切替時期：あるクラスが他の領域と衝突したとき、もしくはスコープ漏れが観測できたとき。**それまでは切らない**。

---

## 7. 何かを追加する手順

### 新しい細胞を追加

1. `src/types/index.ts` → `CellId` リテラル union に新 id を追加。
2. `src/data/cells.ts` → `CELLS` マップに `CellMeta` を追加、id を `CELL_ORDER` に push。
3. `src/data/organelles.ts` → `ORGANELLES_BY_CELL[id]` に `Organelle` 配列を追加。
4. `public/assets/cells/{id}.png` —— 192² の円形水彩サムネイル（必要なら AI 生成）。
5. `public/assets/scenes/hero_{id}.png` —— hero 断面（とりあえず plant のフォールバックでも可）。
6. `public/models/{id}.glb` —— ソース GLB（v0.2 まではオプション）。
7. `src/styles/tokens.css` → `--cell-{id}: #RRGGBB;` を追加。
8. `body[data-cell="{id}"] { --cell-current: var(--cell-{id}); }` を追加（既に `tokens.css` でやっています）。

以上 —— 左サイドバーリスト、パンくず、色フロー、顕微鏡バリアント、比較パネルが自動で拾います。

### 既存細胞に新しい小器官を追加

`data/organelles.ts` のその細胞の配列にエントリを 1 件追加するだけ。左サイドバーの Organelles リストも右サイドバーの Organelle Details パネルも、このデータからレンダーします。

### 新しいキーボードショートカットを追加

`hooks/useKeyboard.ts` を編集 → `useHotkeys` 呼び出しを追加。チートシート（TODO：v0.3 でチートシート UI を作る）にも記載。

### 新しい機能フラグを追加

- `.env.example` → `VITE_ENABLE_FOO=true` を追加
- `import.meta.env.VITE_ENABLE_FOO === "true"` で読む
- フラグはデフォルト**オン**；本番で問題のある機能を切るためにフラグが存在する。

### 新しいエクスポート形式を追加

`components/stage/ExportDrawer.tsx::CATEGORIES` の適切なカテゴリに push。実装時にクリックハンドラを `lib/export.ts` の関数に接続。

### 新しいモードを追加（やらないでほしいけど、どうしても必要なら）

現在のモード：`Explore` / `Teach` / `Research`。4 番目はにおいがします —— 普通は新モードではなく設定でゲートすべき。

どうしても避けられない場合：
1. `types/index.ts` → `Mode` リテラルを拡張。
2. `components/topbar/Topbar.tsx::MODES` → エントリを追加。
3. `globals.css` → `body[data-mode="…"]` の可視性ルールを追加。

---

## 8. 意思決定の履歴

新しいものが上。**ここにない判断を下したら、追加してください**。

### 2026-05-14 · clone 先フォルダ名の推奨 **`bioscope3d/`**
歴史的にローカルは **`3D2`**（初期の作業タイトル）でした。ドキュメントとツリー図は **BioScope3D** に揃えるため、ルート表記を **`bioscope3d/`** に統一します。都合がついたら `mv 3D2 bioscope3d` か再 clone し、スクリプトや Python venv に埋めた絶対パスを更新してください。ルート `package.json::name` は **`bioscope3d-workspace`**（`apps/` 配下の **`bioscope3d`** パッケージと区別）。

### 2026-05-14 · pnpm monorepo · 複数 `apps/*`
リポジトリルートを **pnpm ワークスペース**（`pnpm-workspace.yaml` + ルート `package.json`）にした。`apps/bioscope3d` は BioScope3D の成果物のまま。**`apps/lab-hub`** は薄いランディング（ポート / URL は環境変数）。**`apps/stellar-expanse`** は**別プロダクト**の足場（船 — 細胞ではない）。各アプリは独自の Vite・依存関係・`apps/<name>/dist/` を持つ。無関係な 3D デモは**遅延読み込みまたは別デプロイ**を優先し、hub はリンクのみ — 明示的な決定がない限り、各 GLB スタックを 1 つの JS entry に束ねない。

**これまで `bioscope3d` だけで npm を使っていた場合:** `apps/bioscope3d/node_modules` を削除してからルートで `pnpm install` し、pnpm がワークスペースを正しくリンクできるようにする。

### 2026-05-14 · GLB の単一ソース + **外部配布** + `pnpm sync:models`
大型 `.glb` はこの Git リポジトリに**含めない**（サイズと帯域）。保守者が別途配布（現状 **Google Drive**）し、取得後にリポジトリルートの **`models/`**（gitignore）へ置いて **`pnpm sync:models`** を実行する。**`scripts/sync-models.mjs`** がリストを各アプリの `public/models/` にミラーし、Vite が `/models/…` で配信できるようにする：**macOS/Linux は相対 symlink**、**Windows は `copyFile`**。新しいアプリやファイル名の対応が増えたら **`scripts/sync-models.mjs::ENTRIES`** を拡張する。デザイン素材と MP4 は §9 の **`scripts/sync-assets.sh`** ロードマップのまま。

### 2026-05-13 · 製品名変更："Cell Architecture Studio" → **BioScope3D**
仮タイトルがユーザー提供のリファレンス画像名と同じだった。製品が独自のアイデンティティ（3 モード、階層型 UX、PBR パイプライン）を持つようになると、リファレンス画像と同じ名前は混乱を招くようになった —— "Cell Architecture Studio" はインスピレーション元なのか、成果物なのか？

リネーム範囲：
- アプリフォルダ：`apps/cell-architecture-studio/` → `apps/bioscope3d/`
- `package.json::name`：`cell-architecture-studio` → `bioscope3d`
- HTML `<title>` + meta description
- `Topbar.tsx` ブランド：`<em>Cell</em> Architecture Studio` → `<em>BioScope</em>3D`
- localStorage 永続化 key：`cas:app-state` → `bioscope3d:app-state`（schema を v3 にバンプ；既存ユーザーは初回ロード時に UI 状態がリセット —— pre-v1 なら許容）
- エクスポートドロワーの透かし文字列
- LICENSE の著作権者
- README / AGENTS / CHANGELOG / アプリ README —— すべて更新

**意図的にリネームしないもの：**
- `design/v2/index.html` と `design/v3/index.html` —— 凍結プロトタイプ；`<title>Cell Architecture Studio</title>` はデザイン血脈の記録として残す。
- `docs/01-video-analysis.md`、`docs/02-design-gap.md`、`docs/05-open-questions.md` 内でユーザー提供リファレンス画像を元の名前で参照している文 —— あれはソース成果物に関する事実陳述であり、製品名の陳述ではない。

### 2026-05-13 · v0.2 · Hero `<img>` はライブ Canvas の下に残す
Canvas は `alpha: true` で `.hero` の上に z スタックしています。これにより：
- GLB ストリーミング中、水彩 hero がロード状態を担う —— "空のステージのちらつき" がない。
- GLB を持たない細胞は hero のみを表示 —— `cell.modelPath` が undefined のとき `CellScene` は `null` を返す。
- vignette オーバーレイは両者の**上**にあり、全体のトーンが崩れない。

新しい細胞に R3F を組み込む際、hero `<img>` を取り除かないでください。重ね合わせは意図的です。

### 2026-05-13 · v0.2 · PBR は可逆かつストア駆動
`enhancePBR(scene, on)` はマテリアルに初めて触れた時に元値を `material.userData.__pbrOriginal` にスナップショットします。これにより "Re-bake" / "Original" の切替が GLB の再ロード無しで往復可能になります。今後マテリアルを変えるどんなエフェクト（emission boost、x-ray モードなど）も、このテンプレートに従ってください。

### 2026-05-13 · v0.2 · CDN 依存があっても drei `<Environment preset>` を採用
HDRI プリセットは drei の CDN から HDR テクスチャをロードします。v0.2 では許容：
- `<Suspense fallback={null}>` でラップしているので、CDN がブロックされてもシーンは壊れない —— ambient + directional ライトでマテリアルは光り続ける（IBL 反射はないが）。
- v0.3 でローカル `.hdr` ファイルを `public/env_maps/` に配置し、`<Environment files={...}>` に切替予定。

### 2026-05-13 · 単一のグローバル CSS、CSS Modules ではない
v3.2 の HTML/CSS をそのまま移植しました。コンポーネント別 modules に分割するとすべてのクラスをリネームする必要があります。決定：実際に衝突やパフォーマンス問題が出るまで `globals.css` を保持。

### 2026-05-13 · R3F 9、R3F 8 ではない
R3F 8 の peer dep は `react@>=18 <19`。`tech.md` は React 19 を確定しています。だから R3F → 9、Drei → 10、Postprocessing → 3 にバンプ。

### 2026-05-13 · 横断的状態には React Context ではなく `body[data-*]`
v3.2 の静的 CSS は `body[data-mode]` と `body[data-cell]` を使用しています。`App.tsx` がストアの状態を body 属性にミラーします。これにより、v3.2 の CSS が**そのまま動きます** —— セレクタを JS 駆動の className 文字列に書き換える必要がない。

### 2026-05-13 · ステージに静的 hero プレースホルダ
`Stage.tsx` は v0.2 までライブ R3F Canvas ではなく静的な AI 断面画像を描画します。これにより UI 作業と 3D 作業が互いをブロックせずに並行できる。置き換え先は `src/3d/CellScene.tsx`。

### 2026-05-13 · 3 モード階層（3 個別アプリではない）
当初は K-12 の生徒のみを対象とする案。ユーザー補正：3 つのオーディエンスを**同一サーフェスの階層 UI** で全部担う。だから Mode スイッチャーは HUD / Export / Measure の可視性をルーティングではなく CSS でゲートする。

### 2026-05-12 · 「100% 再現」を「インタラクティブアプリ」に再定義
当初のブリーフは「動画を 100% 再現」。ユーザーの説明：再現すべきは 3D の**周囲のアプリ**であって、レンダーそのものではない。これにより、レンダリング / 動画パイプラインよりも R3F が優先になった。

### 2026-05-12 · 水彩スタイル、SF ではない
初期探索（AERIS、PIONEERS）は SF 風 HUD を使った。ユーザー提供のリファレンス（`design/ref/cell_architecture_studio.png`）は手描き生物学教科書風。スタイルロック。

---

## 9. アセットの場所

| アセット | 真実のソース | ミラー先 |
|---|---|---|
| GLB モデル | 保守者のクラウド（例: Google Drive）→ ローカル `/models/*.glb`（gitignore） | `apps/bioscope3d/public/models/` と `apps/stellar-expanse/public/models/`（`pnpm sync:models` 経由） |
| 細胞サムネイル | `/design/v3/img/cells/*.png` | `apps/bioscope3d/public/assets/cells/` |
| ステージ hero / シーン画像 | `/design/v3/img/scenes/*.png` | `apps/bioscope3d/public/assets/scenes/` |
| 参考動画 | `/data/*.mp4` | ミラーしない —— 分析ソースのみ |
| HDRI マップ | （まだない） | `apps/bioscope3d/public/env_maps/` |

`models/*.glb` を更新したらルートで **`pnpm sync:models`** を実行（§8 参照）。デザイン素材と MP4 は今も手動ミラー。**v0.3+：** それらは引き続き `scripts/sync-assets.sh` を予定。

---

## 10. やってはいけないこと

- **UI ライブラリを入れない**（Material、Chakra、Mantine、shadcn）。v3.2 のデザインは固有すぎる。手作りする。
- **「現代的だから」と per-component CSS Modules を入れない**。今は `globals.css` で十分。
- **水彩スタイルをより「プロっぽい」見た目に置き換えない**。このスタイルこそが差別化要素。
- **SSR を入れない**（Next.js、Remix）。これは純粋なクライアントアプリ —— Vite 静的デプロイ。
- **巨大な `.glb` を Git にコミットしない**（プレーンでも LFS でも）。外部ストレージ（例: Google Drive）に置き、ローカルは **`models/`** + **`pnpm sync:models`** のみ。
- **コードを言い換えるだけのコメントを書かない**。コードは「何を」、コメントは「なぜ」を語る。
- **Tailwind を入れない**。デザインには 600 件ほどのカスタムセレクタがある —— 変換は後退。
- **`<img>` プレースホルダから「半端な R3F Canvas」へ移行しない**。R3F を本気で着地させる（v0.2）か、プレースホルダのままにする、どちらか。

---

## 11. PR / コミット規約

（正式な git ワークフローが確立するまで —— ここはリマインダ）

- **1 機能 = 1 コミット**。Mode スイッチャー全体で 1 コミット。バンドルしない。
- **件名：** `<area>: <imperative verb> <noun>`
  - ✓ `stage: add organelle callouts overlay`
  - ✓ `store: persist mode and active cell across refresh`
  - ✓ `data: add muscle cell organelles`
  - ✗ `WIP fixes` / `update some stuff`
- **本文：**「なぜ」を説明し、「何を」は説明しない。diff がすでに「何を」を見せている。

---

## 12. 詰まったら

1. **ブラウザで `design/v3/index.html` を開く**。静的プロトタイプが既に求めるものを見せているか？　その場合、仕様はそこにある —— 一致させる。
2. **`docs/03-features.md` を読む** —— その機能はおそらくリスト（F01–F63）に載っている。
3. **判断が欠けているなら**、判断を下して、§ 8 の「意思決定の履歴」に追加する。
4. **A が明らかに勝っているなら、A か B かをユーザーに尋ねない**。A を採用し、1 行で説明して進む。
5. **サンドボックスで失敗したら**、本当に必要だと確認したうえで `required_permissions: ["all"]` で再実行する。

---

## 13. ファイル状態の規約

プレースホルダファイル（今日の `3d/CellScene.tsx` のような）には、ファイル先頭にブロックコメントを置く：

```ts
/**
 * R3F scene wrapper — TODO v0.2
 *
 * This file is a placeholder. In v0.2 we will:
 *  - Mount <Canvas> with proper sRGB output
 *  - Load the active GLB via useGLTF
 *  - ...
 */
```

この慣習を守ってください。次のエージェントがこのファイルを「廃棄か？」と疑わずに済みます。

---

## 14. 新規 AI セッションのオンボーディング

このリポジトリをコンテキストゼロで開いた場合、次の順序で：

1. **このファイル（AGENTS.md）を読む** —— もう読んでいる。特に § 15（ドキュメント言語規約）に注意 —— このリポジトリは三言語制でハードルール、あって嬉しいレベルの話ではない。
2. ブラウザで **`design/v3/index.html`** を開く。60 秒クリックしてみる。それが製品。
3. **`docs/03-features.md`** を流し読み —— 63 機能とその優先度のリスト。
4. **`docs/04-mvp-roadmap.md`** を流し読み —— 何がいつ予定されているか。
5. **`apps/bioscope3d/src/App.tsx`** を開く —— React のエントリポイント。
6. **`apps/bioscope3d/src/stores/useAppStore.ts`** を流し読み —— 実行時状態の唯一の真実。

以上の 6 ステップで、生産的に動けるはずです。

---

## 15. ドキュメント言語規約

### 15.0 三つのルール（一息で言うと）

このリポジトリは三言語で出荷します：**English** / **简体中文** / **日本語**。ルールは三つ。ドキュメントを 1 行でも書く前に体に入れてください。

1. **ユーザーへの返答は既定で 中文**。主要メンテナーは中国語で作業しています。計画文・進捗報告・タスク終わりの総括 —— すべて中国語。コード識別子、コンソールログ、エラーメッセージ、コード内コメントは英語のまま（これはコードスタイル規約で、ローカライズの話ではない）。ユーザーが明示的に切替を求めない限り、変えない。

2. **新規ドキュメントは英語で書き始める**。英語が **今後あなたが作るすべてのドキュメントの canonical 言語** です：先に `foo.md`（英語）を書き、続いて同じコミットで `foo.zh.md` と `foo.ja.md` の翻訳を追加する。中国語版・日本語版は英語版を真理の基準として追従する —— 真理の向きはそれ。（歴史的例外が一つ：`docs/0*-*.md` は最初から中国語で書かれているため、中国語 canonical のまま残します —— これは原稿言語に関する事実であって、修正すべき退行ではない。）

3. **3 つの兄弟ファイルのうち 1 つを触ったら 3 つ全部触る**。翻訳の乖離（ドリフト）は許さない。1 言語しか直す時間がない —— ならその作業はまだ未完です。同じコミットで 3 ファイル揃えるか、出荷しない、どちらか。

多言語ファイルは上部にバナーを置き、**現在の言語を太字**、その他はリンク：

```md
> 🌐 **English** · [简体中文](./README.zh.md) · [日本語](./README.ja.md)
```

### 15.1 ファイルごとの canonical 言語（現状）

今後新規作成するファイルの既定は **canonical = 英語**（上記 Rule 2）。リポジトリ内に既存のファイルの対照表：

| ファイル群 | Canonical | サフィックス翻訳版 |
|---|---|---|
| ルート `README.md` · `AGENTS.md` · `CHANGELOG.md` · `LICENSE` | **English** | `*.zh.md` · `*.ja.md` |
| `apps/bioscope3d/README.md` | **English** | `README.zh.md` · `README.ja.md` |
| `tech.md` | **English** | `tech.zh.md` · `tech.ja.md` |
| `docs/*.md` | **简体中文**（歴史的経緯 —— 分析フェーズの成果物が中国語で書かれた） | `*.en.md` · `*.ja.md` |

### 15.2 三言語ファイル一覧（公式リスト）

以下のファイルは**3 つで 1 セット**として扱います。1 つを編集したら、残り 2 つを同じコミットで更新するのが必須です：

| グループ | ファイル |
|---|---|
| ルート README | `README.md` · `README.zh.md` · `README.ja.md` |
| ルート AGENTS | `AGENTS.md` · `AGENTS.zh.md` · `AGENTS.ja.md` |
| ルート CHANGELOG | `CHANGELOG.md` · `CHANGELOG.zh.md` · `CHANGELOG.ja.md` |
| 技術スタック | `tech.md` · `tech.zh.md` · `tech.ja.md` |
| アプリ README | `apps/bioscope3d/README.md` · `apps/bioscope3d/README.zh.md` · `apps/bioscope3d/README.ja.md` |
| アプリ README · lab-hub | `apps/lab-hub/README.md` · `apps/lab-hub/README.zh.md` · `apps/lab-hub/README.ja.md` |
| アプリ README · stellar-expanse | `apps/stellar-expanse/README.md` · `apps/stellar-expanse/README.zh.md` · `apps/stellar-expanse/README.ja.md` |
| Docs · README | `docs/README.md` · `docs/README.en.md` · `docs/README.ja.md` |
| Docs · 動画解析 | `docs/01-video-analysis.md` · `docs/01-video-analysis.en.md` · `docs/01-video-analysis.ja.md` |
| Docs · 設計ギャップ | `docs/02-design-gap.md` · `docs/02-design-gap.en.md` · `docs/02-design-gap.ja.md` |
| Docs · 機能一覧 | `docs/03-features.md` · `docs/03-features.en.md` · `docs/03-features.ja.md` |
| Docs · MVP ロードマップ | `docs/04-mvp-roadmap.md` · `docs/04-mvp-roadmap.en.md` · `docs/04-mvp-roadmap.ja.md` |
| Docs · オープンクエスチョン | `docs/05-open-questions.md` · `docs/05-open-questions.en.md` · `docs/05-open-questions.ja.md` |

**新しく多言語ファイルを追加するときは、同じコミットでこの一覧にも登録**してください。

### 15.3 コミット前のセルフチェック（ハードルール）

ドキュメント作業を「完了」と宣言する前に：

1. 自分が編集したファイルを列挙する。
2. § 15.2 に載っている編集済みファイルそれぞれについて、**残り 2 つの兄弟ファイルも編集したか確認**する。
3. 3 つのうち 1 つしか触っていなければ、その作業は未完。差分を残り 2 言語に今すぐ翻訳する。
4. あるセクションが**意図的に 1 言語のみ**（作業中、その言語特有の注記など）の場合、`(EN-only)` / `(ZH-only)` / `(JA-only)` と明示し、次のエージェントが「ドリフト」と誤読しないようにする。

三言語ファイルに 1 言語分しかコミットしていないことに気付いたら、それは退行であって機能ではない —— その場で直してから先へ進む。

### 15.4 やってはいけないこと

- `LICENSE` を翻訳しない（法的文書は英語のまま）。
- `docs/0*-*.md` の中国語 canonical を、後から「統一のため」と英語 canonical に反転させない —— 原稿が中国語なのは事実であって、後退ではない。
- 翻訳をドリフトさせない。`*.zh.md` の段落が `*.md` と一致しなくなっていたら、それはバグ。気付いたコミットで直す。
- トップレベルの新規ドキュメントを中国語や日本語から書き始めて「あとで翻訳する」、をやらない。Rule 2 に従い、英語から書き、3 つの兄弟ファイルを同じコミットで出すこと。

---

## 16. 謝辞

ソース 3D モデルは [Tripo3D](https://www.tripo3d.ai/) と [Hunyuan3D](https://3d.hunyuan.tencent.com/) から取得しています。
AI 生成の水彩アセットは Cursor agent + Imagen で生成。
v3.2 を駆動したリファレンスデザインはユーザー提供のモックアップ（元のタイトルは "Cell Architecture Studio"）。製品自体は 2026-05-13 に BioScope3D へリネーム（§ 8 を参照）。
