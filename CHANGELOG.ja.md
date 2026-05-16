# Changelog

> 🌐 [English](./CHANGELOG.md) · [简体中文](./CHANGELOG.zh.md) · **日本語**

このプロジェクトの注目すべき変更をすべて記録します。
形式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) におおむね従い、
バージョン番号は [SemVer](https://semver.org/lang/ja/) に従います。

---

## [未リリース]

### 追加

- **pnpm monorepo** — ルート `package.json` + `pnpm-workspace.yaml`；新規 `apps/lab-hub`（ランディング、リンクは環境変数）と `apps/stellar-expanse`（船プロダクトの足場）。既定の開発ポート: hub **5170**、BioScope3D **5173**、Stellar **5174**。BioScope3D の `build` / `typecheck` / `lint` は `pnpm exec` 経由で `tsc` を解決。

### 変更

- **ワークスペース識別子** — ルート `package.json` の `name` を `3d2-monorepo` から **`bioscope3d-workspace`** に変更。README と `tech.md` のツリーは **`bioscope3d/`** をルート表記に統一（ローカルがまだ **`3D2/`** なら都合のよいときに `mv` か再 clone；venv やスクリプトの絶対パスは各自更新）。

### 修正

- **macOS での Vite 開発 URL** — 各 `apps/*/vite.config.ts` で `root` を設定ファイルのディレクトリに固定（誤った `cwd` や `apps/lab-hub/#` のようなフォルダでパスに **`#`** が入り警告・解決失敗するのを避ける）、`server.host` を **`127.0.0.1`** にし、既定で **`http://127.0.0.1:<port>/`** を開く。lab-hub のカードの既定 URL も同じホストに合わせた。
- **余計な `#` が Vite に渡る問題** — 一部環境で `pnpm dev:hub # http://…` がそのまま引数化され、`#` が Vite の `[root]`（`lab-hub/#`）になりポートがずれる。各アプリの `dev` / `preview` を `node ./scripts/run-vite-cli.mjs` 経由に変更し、それらの token を転送しない。README のクイックスタートはコメントを行頭の別行に分離。

### 修正（v0.4.0 以降）

- **細胞中心付近がカラフルなトゲ状ジオメトリに崩壊（Chrome で顕著）**。根本原因 —— `CellModel` のワールド正規化の代数が間違っていた：`scene.position -= center` のあと **`scene.position.multiplyScalar(k)`** と **`scene.scale` に `k`** を両方適用していた。質心を原点へ寄せるルート並進は **係数 `k` で縮めるべきではない**；縮めるのは子メッシュだけ。両方やるとワールド行列が壊れ、NaN に近い破片三角形が原点付近へ集約される。**修正**：drei のキャッシュ `scene` に触れず **`source.clone(true)`** してから正規化、**detach 済みマテリアル**で loader 状態を守る、二段 `Box3`（`position.sub(center)`→再計算→`scale.multiplyScalar(1/r)`）、`<primitive dispose={null}>`。**`lib/pbr`** は **`instanceof THREE.MeshStandardMaterial`** で判定し Tripo がよく使う **`MeshPhysicalMaterial`** でも AO／增强が効くようにした。

- **AO 除去後も中心がトゲ状のまま（SkinnedMesh の境界が小さすぎるケース）。** 既定の `Box3.setFromObject` は bind-pose 基準で `sphere.radius` がほぼ 0 になり得、根 `scale` が爆発。先に **`skeleton.pose()`**、測定は **`setFromObject(scene, true)`**、**`MathUtils.clamp(1/r, …)`** でスケール上限を抑える。

- **Bloom を切っても中心にトゲ状が残る：`InstancedMesh` のインスタンスが precise 統合 AABB に入らない。** 殻だけ極小・インスタンスが遠方だと **`1/r`** が再び爆発。`setFromObject` を二回踏むのと同じタイミングで **`unionInstancedMeshWorldBounds`** を二回走らせる。

- **Bloom オフでも中心のザラつきは、正規化ではなくセルフシャドウのアクネが原因のことが多い。** Tripo の超高密度メッシュは低解像度シャドウマップで自己投影し、シルエット付近に砂粒状のスパイクに見える。`CellScene` で R3F **`shadows`** を止め、キー **`directionalLight`** の **`castShadow`** も外す。環境光 + 平行光 + HDRI **`Environment`** で立体は十分読める。

- **`N8AO` を標準スタックから外した**。`needsDepthTexture` が true のパスがあると、`RenderPass` のあと pmndrs `EffectComposer` が毎フレーム `glBlitFramebuffer` で深度を別ターゲットへコピーする。Chrome + ANGLE では **`multisampling={0}`** でも **`GL_INVALID_OPERATION: … same image`** が起きうる。**`Bloom`** は深度を読まないのでこのコピー経路が走らない。**F2** は Bloom のみ toggles。AO を戻すなら安全な統合経路まで `PostFx.tsx` のコメントを参照。

- **`@react-three/postprocessing` の `<EffectComposer>` は既定で `multisampling=8`**。内部 MSRTT の `glBlitFramebuffer` で ANGLE が不安定になりうるので **`multisampling={0}`** と **`stencilBuffer={false}`** を維持。メイン `<Canvas>` の `antialias` は変更なし。

### 追加（診断用）

- **F2 ホットキー** —— ランタイムで post-processing（Bloom のみ）の On/Off。

### v0.5 予定 —— "磨き上げとデータの厚み"

- カメラ距離で駆動するリアル µm スケールバー
- Research モードのワールド空間 2 点定規（測距ツール）
- 細胞ごとの専用 hero シーン（現在は 7 種類すべてが植物細胞の hero PNG を共有）
- クイズモードのループ、Notebooks ページ

---

## [0.4.0] — 2026-05-13 — "Tier 1：ツアー / カメラ / シネマ / スクリーンショット"

### 追加 —— Tier 1 機能（[F02][F03][F05][F08][F12][F17][F18][F19][F23][F28][F60]）

- **F05 細胞ごとのカメラプリセット + F23 リセット（R キー）**：すべての細胞に `cameraPreset`（position + target + fov）を持たせた。細胞切替時 / R キー押下時に `CameraRig` がダンプド lerp でプリセットへ寄る。`CellModel` は Tripo 出力 GLB を読み込み時に「中心を原点へ + 単位球半径へ」と一度だけ正規化するため、プリセットの距離値（≈2.6）が全細胞で揃って効く。
- **F02 / F03 / F12 / F17–19 / F60 自動ツアー**：各細胞に `dwellSeconds`（参考動画のセグメント時間と一致）を付与。新規 `useTour()` の RAF ループが store 内のクロックを進めて `tourIndex` を自動推移させる。`TourBar` を書き直し：◀ 再生/一時停止 ⏸/▶ · 7 セグメントのドット（クリックでジャンプ）· 退出 ✕、リアルタイムの `経過 / 滞在時間` 表示。ホットキー：Space でツアー On/Off、K で再生/一時停止、←/→ で前後セグメント、Esc で退出。
- **F08 シネマモード（F キー）**：`body.cinema` クラスがすべての chrome（topbar、左右サイドバー、ツールバー、canvas head、底部カード、付箋、ビューモードパネル、HUD コーナー、tour-bar）を隠し、stage がビューポート全面を占める。Esc で解除。
- **F28 実スクリーンショット**：`Canvas gl={{ preserveDrawingBuffer: true }}` と `captureStage()` ヘルパーを追加。`canvas.toBlob()` を呼んで `bioscope3d-{cellId}-{yyyyMMdd-HHmmss}.png` をダウンロード。Stage ツールバーのカメラボタンに結線済み。

### 追加 —— 関連インフラ

- 型 `CameraPreset` と `CellMeta.dwellSeconds / cameraPreset`（必須化）
- Zustand store：`tourIndex / tourElapsedMs / tourPlaying` とアクション群（`startTour / stopTour / toggleTourPlay / jumpTourTo / tickTour`）、`cinema + toggleCinema`、`screenshotTick + requestScreenshot`
- `hooks/useTour.ts` RAF エンジン（`App.tsx` に一度だけマウント）
- `lib/screenshot.ts` ユーティリティ（タイムスタンプ付きファイル名 / 透明背景 PNG / コンソールフォールバック）
- `scripts/screenshot_v0.4.mjs`：puppeteer + swiftshader でヘッドレス Chrome 上に Tier-1 4 機能をすべて走らせて証跡スクショを残すドライバー

### 変更

- **`CellScene`** から drei の `<Bounds>` を撤去 —— カメラプリセットと衝突するため。代わりに `CellModel` でマウント時 1 回だけ正規化する。
- **`StageToolbar`**：Reset を `resetCamera` に、Screenshot を `captureStage` に結線。Screenshot と Author Tour の間に「Cinema」トグルボタンを追加。
- **`useGlobalHotkeys`**：F は Cinema 切替に変更（以前は Reset の重複だった）。R は引き続き Reset。Esc はカスケード：エクスポート抽斗を閉じる → シネマ解除 → ツアー退出。
- **i18n**：`tour.{play,pause,prev,next,jumpToTitle,exit,timecode(fn)}`、`cinema.{enter,exit,hintEsc}`、`screenshot.{title,successAria,failure,notAvailable}` に加え `toolbar.cinema / cinemaOff` と対応する `titles.*` を追加。English / 简体中文 / 日本語 すべて同期。
- **CSS**：`.tour-bar` に制御ボタン（prev / play / next / exit）、リアルタイム進捗バー、より大きなクリック領域のドットを実装。新規 `body.cinema` ルールセットがすべての chrome を隠し、`.stage` をビューポート全面に拡張。
- **永続化**：スキーマを **v5** にバンプし、新規 tour/cinema フィールドを収容（既存セッションは初回ロード時にリセット）。

### ファイル

- `apps/bioscope3d/src/types/index.ts`
- `apps/bioscope3d/src/data/cells.ts`
- `apps/bioscope3d/src/stores/useAppStore.ts`
- `apps/bioscope3d/src/hooks/useTour.ts`（新規）
- `apps/bioscope3d/src/hooks/useKeyboard.ts`
- `apps/bioscope3d/src/3d/CameraRig.tsx`
- `apps/bioscope3d/src/3d/CellModel.tsx`
- `apps/bioscope3d/src/3d/CellScene.tsx`
- `apps/bioscope3d/src/lib/screenshot.ts`（新規）
- `apps/bioscope3d/src/components/stage/TourBar.tsx`
- `apps/bioscope3d/src/components/stage/StageToolbar.tsx`
- `apps/bioscope3d/src/App.tsx`
- `apps/bioscope3d/src/i18n/types.ts`
- `apps/bioscope3d/src/i18n/locales/{en,zh,ja}.ts`
- `apps/bioscope3d/src/styles/globals.css`
- `apps/bioscope3d/scripts/screenshot_v0.4.mjs`（新規）

---

## [0.2.1] — 2026-05-13 — "BioScope3D へ改名"

### 変更
- **製品名**：`Cell Architecture Studio` → **`BioScope3D`**
- **アプリフォルダ**：`apps/cell-architecture-studio/` → `apps/bioscope3d/`
- `package.json::name`、`package.json::description`
- HTML `<title>` + meta description
- `Topbar.tsx` のブランド：`<em>Cell</em> Architecture Studio` → `<em>BioScope</em>3D`（タグライン保持）
- エクスポートドロワーの透かしオプション文字列
- localStorage キー：`cas:app-state` → `bioscope3d:app-state`（永続化 schema を v3 にバンプ。既存セッションは初回ロードでリセット）
- LICENSE の著作権者
- README（ルート + アプリ）、AGENTS.md、すべての前向きドキュメント

### 意図的に保持
- `design/v2/index.html`、`design/v3/index.html` —— 凍結したプロトタイプは元の `<title>` をデザイン血脈の記録として残す
- `docs/01-video-analysis.md`、`docs/02-design-gap.md`、`docs/05-open-questions.md` の "Cell Architecture Studio" 参照 —— あれはユーザー提供のリファレンス画像名に関する事実陳述
- リポジトリ最上位フォルダ名 `3D2` —— ローカルクローンの絶対パスを壊さないように保持

理由は `AGENTS.md` § 8 を参照。

---

## [0.2.0] — 2026-05-13 — "3D が現実に"

> **マイルストーン：ライブ PBR レンダリング。** Stage は実際の R3F Canvas になり、アクティブな GLB を HDRI ライティングとポスト処理付きで描画します。v3.2 の手描き hero 画像はバックドロップ / フォールバックとして残ります。

### 新規
- **`src/3d/CellScene.tsx`** —— R3F `<Canvas>` ルート：ACES Filmic トーンマッピング、sRGB 出力、ローカルクリッピング有効、アルファ透過 —— GLB のストリーミング中も、GLB を持たない細胞でも、水彩 hero が透けて見える。
- **`src/3d/CellModel.tsx`** —— `useGLTF` ローダー。PBR パスを自動適用、影を投影 / 受光、断面トグルに応じてワールド空間クリッピング平面を反応的に切替。
- **`src/3d/SceneEnvironment.tsx`** —— drei `<Environment>` の 3 つの HDRI プリセット：
  - `studio`（クリーンな中性ホワイトボックス）—— デフォルト
  - `lab`（warehouse / 冷色系クリニカル）
  - `sunset`（暖色系シネマティック）
  - `<Suspense>` でラップしているため、オフライン / CDN ブロックされたセッションでも、ambient + directional ライトでグレースフルに劣化し、シーンが壊れない。
- **`src/3d/PostFx.tsx`** —— N8AO（16 サンプル）+ 控えめな Bloom；`store.postFxEnabled` でゲート、低スペック端末は劣化可能。
- **`src/3d/CameraRig.tsx`** —— `OrbitControls` にダンピング、パン禁止、ズーム範囲クランプ、ストア駆動の `autoRotate` + ワンショット `cameraResetTick` 消費。
- **`src/lib/pbr.ts`** —— `enhancePBR(scene, on)` と `setClippingPlane(scene, plane | null)`。可逆切替：元の PBR 値は初回タッチ時に `material.userData.__pbrOriginal` にスナップショットされるので、"Re-bake" ↔ "Original" は純粋な往復。
- 既知の GLB をモジュール読み込み時に `useGLTF.preload(...)` —— 初回セッションのウォームアップ後の細胞切替が瞬時。

### Store（`useAppStore.ts` schema v2）
- `hdriPreset: "studio" | "lab" | "sunset"`（永続化）
- `autoRotate: boolean`（永続化、デフォルト `true`）
- `pbrEnhanced: boolean`（永続化、デフォルト `true`）
- `postFxEnabled: boolean`（永続化、デフォルト `true`）
- `cameraResetTick: number`（短命、インクリメントでカメラリセットを発火）
- Actions：`setHdriPreset` · `toggleAutoRotate` · `togglePbrEnhanced` · `togglePostFx` · `resetCamera`

### キーボードショートカット
- `F1` —— アイドル自動回転の切替
- `R` —— カメラをデフォルトリグへリセット
- `F` —— 現在の選択にフォーカス（v0.2 は R と同じ；v0.3 でアクティブな小器官をフレーミング）

### Stage CSS
- z-index レイヤー：`.hero`（z 1）→ `.cell-scene`（z 2）→ `.vignette`（z 3）→ callouts / overlays（z 4+）
- Canvas は `.stage` の `overflow: hidden` を介してステージの角丸を継承

### 検証
- `npm run typecheck` —— 通過
- `npm run build` —— 通過（app 52 kB + R3F チャンク 715 kB + three.js チャンク 689 kB、gzip 後それぞれ 14 · 253 · 177 kB）
- `npm run dev` + ヘッドレススクリーンショット —— Tripo の plant-cell GLB が HDRI 反射付きでライブレンダー、影を投じ、自動回転、callouts / Post-it / ViewMode / StageToolbar / Microscope / Compare がライブ Canvas の上で正常動作することを確認

### v0.2 既知の制約（v0.3 で追跡）
- HDRI プリセットは drei の CDN からフェッチ；オフラインセッションは ambient + directional のみにフォールバック。
- GLB を持つのは `plant` と `animal` のみ。残り 5 細胞は専用モデルが揃うまで水彩 hero が主視覚。
- PBR ポップオーバーの "Re-bake" / "Original" ボタン UI は v0.1 のまま。ただしストアアクションは配線済みで、`togglePbrEnhanced()` をコードまたはキーボードで呼べばライブ切替が動く。
- `F`（フォーカス）は現在 `resetCamera` を再実行；適切な小器官対象フレーミングはワールド空間アンカー位置が必要で、v0.3 にスケジュール。

---

## [0.1.0] — 2026-05-13

> **マイルストーン：スキャフォールド + ピクセル単位の UI。** ライブ 3D はまだ —— Stage は AI 生成の断面画像を表示。すべてのインタラクション、レイアウト、モード切替、アセットパイプラインは実動作。

### 新規
- プロジェクトルートをクリーンアップ（3.9 GB → 1.3 GB）—— 分析の中間生成物と古い再現アーティファクトをすべて削除
- `apps/bioscope3d/`（当時の名前は `cell-architecture-studio` —— [0.2.1] 参照）を **React 19 + Vite 6 + TypeScript 5** でスキャフォールド
- React Three Fiber 9 + Drei 10 + Postprocessing 3（3D 層は配線済み、v0.2 までプレースホルダ）
- Zustand 5 + `persist` ミドルウェア —— `mode` / `activeCell` / `favorites` / `viewMode` フラグを `localStorage` に自動保存
- `react-hotkeys-hook` 経由のグローバルホットキー：
  - `1`–`7` —— 細胞タイプの切替
  - `L` —— ラベル切替
  - `X` —— 断面切替
  - `Space` —— オートツアー切替
  - `E` —— エクスポートドロワーを開く
  - `Esc` —— 開いているドロワー / ポップオーバーを閉じる
- `design/v3/index.html`（v3.2 静的プロトタイプ）を 28 個の React コンポーネントに **1:1** 移植：
  - **topbar/** —— Brand · Nav（Quiz 含む 5 タブ、NEW ドット付き）· ModeSwitch（Explore / Teach / Research）· UserMenu
  - **sidebar-left/** —— Cell Types（7 件）· Organelles（細胞別リスト、アクティブ chevron 表示）
  - **sidebar-right/** —— Organelle Details · Biological Notes · Where It Occurs（AI 生成の風景画）
  - **canvas-head/** —— Breadcrumb · `<h1>` タイトル · PipelineBadge（"PBR Enhanced" ポップオーバーに Re-bake / Original）
  - **stage/** —— Hero · Callouts（Caveat ラベル付き 6 本の SVG 引き出し線）· Post-it · ViewMode パネル（Labels スイッチ含む 4 トグル）· 4 隅 HUD specimen タグ · µm スケールバー · Tour bar · エクスポートドロワー（4 カテゴリ 16 オプション）· StageToolbar（Measure / Author Tour / 3D Export）
  - **bottom/** —— Microscope View（3 倍率）· Compare Cells（円形 swap ボタンと差分ヒント付き）
- 9 件の AI 生成水彩アセット —— 7 件の細胞サムネイル + 1 件のステージ hero + 1 件の "WHERE IT OCCURS" 風景画、すべて `/public/assets/` 配下
- モード駆動 UI（`body[data-mode="…"]`）：
  - **Research** は HUD · µm スケールバー · Measure ボタン · 完全エクスポートドロワーを表示
  - **Teach** は Author Tour ボタン · 大ヒット領域を表示、HUD 透過度を下げる
  - **Explore** は精度コントロールを隠し、親しみやすさを保つ
- セル色フロー（`body[data-cell="…"]` → `--cell-current` のカスケード）が pill / トグル / dot / 枠線へ
- データ層：7 細胞 × 細胞別の小器官 + 引き出し線座標が組み込み済み
- TypeScript ビルドパイプライン：`tsconfig.node.json` に `composite: true` を設定した `tsc -b`、全域 `strict: true`、`any` ゼロ
- Vite パスエイリアス：`@/`、`@components/`、`@data/`、`@stores/`、`@hooks/`、`@lib/`、`@3d/`、`@styles/`、`@types/`
- `vite.config.ts` の手動チャンク分割で R3F + Drei + postprocessing を独立キャッシュ可能なバンドルに

### ドキュメント
- ルート：`README.md` · `AGENTS.md` · `LICENSE`（MIT）· `.editorconfig` · `.gitignore` · `CHANGELOG.md`
- アプリレベル：`apps/bioscope3d/README.md`
- 分析：`docs/01-video-analysis.md`（7 セグメント自動ツアー構造）· `docs/02-design-gap.md`（v1 → v2 → リファレンス比較）· `docs/03-features.md`（63 機能 F01–F63）· `docs/04-mvp-roadmap.md`（v0 → v1.0 計画）· `docs/05-open-questions.md`（意思決定ログ）

### 検証
- `npm install` —— クリーンインストール、peer 解決時の脆弱性ゼロ
- `npm run typecheck` —— 通過
- `npm run build` —— 本番バンドル生成
- `npm run dev` —— `http://localhost:5173` で配信、スクリーンショットが v3.2 静的プロトタイプと一致

---

## [0.0.x] — スキャフォールド以前の調査フェーズ

正式リリースしていない —— 来歴のためにここに残す。

### 行ったこと
- Hunyuan3D（`20260512200414_6dc31f15.glb`、約 82 MB）と Tripo3D（`tripo-plant-cell-test.glb`、約 85 MB）から GLB モデルをダウンロード
- Hunyuan のオリジナルレンダリングを `<model-viewer>` で再現（R2 ルート）。ソース動画に対する SSIM 約 0.78
- GLB の品質問題を診断：normal map が平坦、AO 欠落、roughness が均一 —— v0.2 の PBR 強化計画の根拠
- 静的デザインプロトタイプを反復 v0 → v1 → v2 → v3 → v3.1 → **v3.2**（最終版）
- ユーザーのフィードバック後、3 オーディエンス製品戦略（Explore / Teach / Research）を確立

### 廃棄
- `apps/aeris/` —— 初期の SF テーマ React スキャフォールド、水彩美学に合わなかった。削除
- Python ベースのレンダリングパイプライン（pyrender / VTK）—— `<model-viewer>` を経て R3F に置換
- 「動画を 100% 再現」という字義通りの解釈 —— ユーザーの明確化により「インタラクティブアプリ」に再定義
