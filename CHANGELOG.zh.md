# Changelog

> 🌐 [English](./CHANGELOG.md) · **简体中文** · [日本語](./CHANGELOG.ja.md)

本文档记录项目所有值得记录的变更。
格式大致遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)；
版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)。

---

## [未发布]

### 新增

- **pnpm monorepo** — 根目录 `package.json` + `pnpm-workspace.yaml`；新增 `apps/lab-hub`（入口页，链接走环境变量）与 `apps/stellar-expanse`（飞船产品脚手架）。默认开发端口：hub **5170**、BioScope3D **5173**、Stellar **5174**。BioScope3D 的 `build` / `typecheck` / `lint` 使用 `pnpm exec`，以便在 pnpm 链接布局下正确找到 `tsc`。

### 变更

- **工作区标识** — 根 `package.json` 的 `name` 由 `3d2-monorepo` 改为 **`bioscope3d-workspace`**；README 与 `tech.md` 的目录树以 **`bioscope3d/`** 为仓库根（本地若仍为 **`3D2/`** 可择机 `mv` 改名；venv、脚本中的绝对路径需自行更新）。

### 修复

- **macOS 上 Vite 开发地址** — 各 `apps/*/vite.config.ts` 将 `root` 设为配置文件所在目录（避免错误 `cwd` 例如误建的 `apps/lab-hub/#` 触发路径含 **`#`** 的警告并导致解析异常），`server.host` 绑定 **`127.0.0.1`**，默认用 **`http://127.0.0.1:<port>/`** 打开浏览器。lab-hub 卡片默认链接与之一致。
- **误把 `#` 传给 Vite** — 部分环境会把 `pnpm dev:hub # http://…` 整行当成带参数执行，`#` 被当成 Vite 的 `[root]`（`lab-hub/#`）且端口错乱。各应用 `dev` / `preview` 改为 `node ./scripts/run-vite-cli.mjs` 拉起 Vite，不再转发这些多余 token；README 快速开始里注释独占上一行。

### 修复（自 v0.4.0 起）

- **细胞中心一团彩色尖刺 / 炸裂几何**。根因 —— `CellModel` 在世界空间归一时写错了代数：在 `scene.position -= center` 之后又执行了 **`scene.position.multiplyScalar(k)`**，同时再给 `scene.scale` 乘以 `k`。把质心平移到原点用到的根节点平移向量 **不能** 再乘以缩放因子 `k`，否则世界矩阵会与「先平移再创缩」的正确顺序不一致，顶点坐标变成碎片，在核周围聚成一团三角尖刺。**修复**：改用 **`source.clone(true)`**，不再污染 drei 的 loader 缓存；克隆后 **detach 材质副本**（PBR/剖切换不碰源码）；两步 `Box3`：**`position.sub(center)` → 重新求包围球 → `scale.multiplyScalar(1/radius)`**；`<primitive dispose={null}>`。**`lib/pbr`**：`instanceof THREE.MeshStandardMaterial` 判型，Tripo 常用的 **`MeshPhysicalMaterial`** 也会走 AO / 增强逻辑。

- **去掉 AO 后中心仍一团毛刺（常见：SkinnedMesh 包围盒偏小）。** `Box3.setFromObject` 默认走 bind-pose 几何体，`sphere.radius` 可趋近 0，根 `scale` 被乘到极大。先 **`skeleton.pose()`**，再用 **`setFromObject(scene, true)`** 按蒙皮后顶点测界，**`MathUtils.clamp(1/r, …)`** 限制缩放。

- **Bloom 全关仍毛刺：`InstancedMesh` 未并入精确包围盒。** `precise` 路径不把每个实例变换并入整体 AABB；部分 GLB 壳体极小、实例在外围时 **`1/r`** 仍会爆。增加 **`unionInstancedMeshWorldBounds`**，与两次 `setFromObject` 对齐各并一次。

- **Bloom 已关、中心仍像颗粒/毛刺：多为阴影痤疮而非归一化。** Tripo 网格极密，低分辨率阴影贴图下自体投影在曲面上呈碎斑。`CellScene` 关闭 R3F **`shadows`**，主方向光不再 **`castShadow`**；环境光 + 平行光 + HDRI **`Environment`** 仍足以表现体积。

- **`N8AO` 已从默认后处理链路移除**。`needsDepthTexture` 的通道会迫使 pmndrs `EffectComposer` 每帧在 `RenderPass` 后经 `glBlitFramebuffer` 把场景深度拷到独立的稳定深度纹理；在 Chrome + ANGLE 上即使在 **`multisampling={0}`** 仍可能报错 `GL_INVALID_OPERATION: … same image`，帧缓冲进入未定义状态。**`Bloom`** 不采样深度因而不会启用该拷贝路径。**F2** 现为仅切换 Bloom；若需 AO 可参考 `PostFx.tsx` 中的说明再行集成。

- **`@react-three/postprocessing` 的 `<EffectComposer>` 默认 `multisampling=8`**，内部 MSRTT 会引入额外 `glBlitFramebuffer`，部分 ANGLE 环境易出问题。我们继续使用 **`multisampling={0}`** 且 **`stencilBuffer={false}`**；主 `<Canvas>` 仍保留 `antialias`。

### 新增（诊断用）

- **F2 快捷键** —— 运行时切换 post-processing（仅 Bloom）。

### 计划中 v0.5 —— "打磨与数据深度"

- 真 µm 比例尺，绑定相机距离
- Research 模式 2 点世界坐标测距尺
- 各细胞独立的 hero 画面（目前 7 种细胞共用植物细胞 hero PNG）
- Quiz 模式循环、Notebooks 页

---

## [0.4.0] — 2026-05-13 — "Tier 1：导览 / 镜头 / 影院 / 截图"

### 新增 —— Tier 1 特性（[F02][F03][F05][F08][F12][F17][F18][F19][F23][F28][F60]）

- **F05 每细胞镜头预设 + F23 重置（R 键）**：每种细胞都带 `cameraPreset`（position + target + fov）。切换细胞或按 R 时，`CameraRig` 阻尼 lerp 到预设；`CellModel` 在加载时把 Tripo 导出的 GLB 归一化到原点 + 单位半径球，使所有细胞的预设可预测。
- **F02 / F03 / F12 / F17–19 / F60 自动导览**：每种细胞配 `dwellSeconds`（对齐参考视频各段时长）。新建 `useTour()` RAF 循环驱动 store 内的时钟，自动推进 `tourIndex`。`TourBar` 重写：◀ 播放/暂停 ⏸/▶ · 7 段圆点（可点击跳段）· 退出 ✕，并实时显示 `已耗 / 总时`。快捷键：Space 切换导览，K 播放/暂停，←/→ 上一段/下一段，Esc 退出。
- **F08 影院模式（F 键）**：`body.cinema` 类隐藏所有 chrome（topbar、左右栏、工具条、画布头、底部卡片、便签、视图模式面板、HUD 角标、tour-bar），让 stage 占满视口；Esc 退出。
- **F28 真截图**：`Canvas gl={{ preserveDrawingBuffer: true }}` 加 `captureStage()` 工具函数，调 `canvas.toBlob()` 触发 `bioscope3d-{cellId}-{yyyyMMdd-HHmmss}.png` 下载。已接到 Stage 工具条相机按钮。

### 新增 —— 配套基建

- 类型 `CameraPreset` 与 `CellMeta.dwellSeconds / cameraPreset`（现为必填）
- Zustand store：`tourIndex / tourElapsedMs / tourPlaying` + 动作（`startTour / stopTour / toggleTourPlay / jumpTourTo / tickTour`）、`cinema + toggleCinema`、`screenshotTick + requestScreenshot`
- `hooks/useTour.ts` RAF 引擎（在 `App.tsx` 挂一次）
- `lib/screenshot.ts` 工具函数（带时间戳文件名、alpha PNG、控制台兜底）
- `scripts/screenshot_v0.4.mjs`：用 puppeteer + swiftshader 在 headless Chrome 跑全 4 项 Tier-1 验证，并产出佐证截图

### 变更

- **`CellScene`** 去掉 drei `<Bounds>` —— 它会与镜头预设打架。`CellModel` 改为加载时一次性归一化（外接球 → 单位半径，质心 → 原点）。
- **`StageToolbar`**：Reset 接 `resetCamera`，Screenshot 接 `captureStage`，Screenshot 和 Author Tour 之间新增 "Cinema" 切换按钮。
- **`useGlobalHotkeys`**：F 改为切换 Cinema（之前是重复的 Reset），R 仍是 Reset；Esc 级联：先关导出抽屉 → 退出影院 → 退出导览。
- **i18n**：新增 `tour.{play,pause,prev,next,jumpToTitle,exit,timecode(fn)}`、`cinema.{enter,exit,hintEsc}`、`screenshot.{title,successAria,failure,notAvailable}`，以及 `toolbar.cinema / cinemaOff` 与对应 `titles.*`。英 / 简中 / 日 三语同步更新。
- **CSS**：`.tour-bar` 重做，加入控制按钮（上一段 / 播放 / 下一段 / 退出）、实时进度条、更大可点击圆点；新增 `body.cinema` 规则集隐藏所有 chrome 并让 `.stage` 撑满视口。
- **持久化**：schema 升到 **v5**，容纳新增 tour/cinema 字段（既有 session 首次打开会重置）。

### 文件

- `apps/bioscope3d/src/types/index.ts`
- `apps/bioscope3d/src/data/cells.ts`
- `apps/bioscope3d/src/stores/useAppStore.ts`
- `apps/bioscope3d/src/hooks/useTour.ts`（新）
- `apps/bioscope3d/src/hooks/useKeyboard.ts`
- `apps/bioscope3d/src/3d/CameraRig.tsx`
- `apps/bioscope3d/src/3d/CellModel.tsx`
- `apps/bioscope3d/src/3d/CellScene.tsx`
- `apps/bioscope3d/src/lib/screenshot.ts`（新)
- `apps/bioscope3d/src/components/stage/TourBar.tsx`
- `apps/bioscope3d/src/components/stage/StageToolbar.tsx`
- `apps/bioscope3d/src/App.tsx`
- `apps/bioscope3d/src/i18n/types.ts`
- `apps/bioscope3d/src/i18n/locales/{en,zh,ja}.ts`
- `apps/bioscope3d/src/styles/globals.css`
- `apps/bioscope3d/scripts/screenshot_v0.4.mjs`（新）

---

## [0.2.1] — 2026-05-13 — "改名为 BioScope3D"

### 已变更
- **产品名**：`Cell Architecture Studio` → **`BioScope3D`**
- **应用目录**：`apps/cell-architecture-studio/` → `apps/bioscope3d/`
- `package.json::name` 与 `package.json::description`
- HTML `<title>` 与 meta description
- `Topbar.tsx` 品牌：`<em>Cell</em> Architecture Studio` → `<em>BioScope</em>3D`（标语保留）
- 导出抽屉的水印选项文案
- localStorage key：`cas:app-state` → `bioscope3d:app-state`（持久化 schema 升到 v3；既有 session 首次打开会重置）
- LICENSE 版权人
- README（根 + 应用）、AGENTS.md、所有前向文档

### 故意保留
- `design/v2/index.html`、`design/v3/index.html` —— 冻结原型保留原 `<title>` 作为设计血脉记录
- `docs/01-video-analysis.md`、`docs/02-design-gap.md`、`docs/05-open-questions.md` 中提到 "Cell Architecture Studio" 的句子 —— 那是对用户提供的参考图本名的事实陈述
- 仓库顶层目录名 `3D2` —— 保留以免破坏本地克隆里的绝对路径

理由详见 `AGENTS.md` § 8。

---

## [0.2.0] — 2026-05-13 — "3D 落地"

> **里程碑：真 PBR 渲染上线。** Stage 现在是真的 R3F Canvas，加载当前 GLB，配 HDRI 照明、后处理；v3.2 的手绘 hero 留作底衬 / 回退。

### 新增
- **`src/3d/CellScene.tsx`** —— R3F `<Canvas>` 根：ACES Filmic tone mapping、sRGB 输出、本地 clipping 开启、alpha 透明，让水彩 hero 在加载期间与无 GLB 细胞场景下都可见。
- **`src/3d/CellModel.tsx`** —— `useGLTF` 加载器，自动应用 PBR pass、投影并接收阴影、随剖切开关在世界空间应用 clipping plane。
- **`src/3d/SceneEnvironment.tsx`** —— drei `<Environment>` 三档 HDRI 预设：
  - `studio`（干净中性 whitebox）—— 默认
  - `lab`（warehouse / 冷色调临床）
  - `sunset`（暖色调电影感）
  - 包了 `<Suspense>`，离线 / CDN 屏蔽时优雅降级到 directional + ambient 照明而不是整个场景挂掉。
- **`src/3d/PostFx.tsx`** —— N8AO（16 samples）+ 柔光 Bloom；由 `store.postFxEnabled` gating，低端机器可降级。
- **`src/3d/CameraRig.tsx`** —— `OrbitControls` 配 damping、禁 pan、缩放区间限制、store 驱动的 `autoRotate` + 一次性 `cameraResetTick`。
- **`src/lib/pbr.ts`** —— `enhancePBR(scene, on)` 和 `setClippingPlane(scene, plane | null)`。可逆切换：原始 PBR 值首次触碰时快照到 `material.userData.__pbrOriginal`，"Re-bake" ↔ "Original" 是纯往返。
- 已知 GLB 在模块加载时 `useGLTF.preload(...)`，session 暖机后切细胞瞬时。

### Store（`useAppStore.ts` schema v2）
- `hdriPreset: "studio" | "lab" | "sunset"`（持久化）
- `autoRotate: boolean`（持久化，默认 `true`）
- `pbrEnhanced: boolean`（持久化，默认 `true`）
- `postFxEnabled: boolean`（持久化，默认 `true`）
- `cameraResetTick: number`（短暂，递增以触发相机复位）
- Actions：`setHdriPreset` · `toggleAutoRotate` · `togglePbrEnhanced` · `togglePostFx` · `resetCamera`

### 快捷键
- `F1` —— 切换怠速自转
- `R` —— 相机复位
- `F` —— 聚焦当前选择（v0.2 等同于 R；v0.3 会框住当前细胞器）

### Stage CSS
- z-index 分层：`.hero`（z 1）→ `.cell-scene`（z 2）→ `.vignette`（z 3）→ callouts / overlays（z 4+）
- Canvas 通过 `.stage` 的 `overflow: hidden` 继承舞台圆角

### 验证
- `npm run typecheck` —— 通过
- `npm run build` —— 通过（app 52 kB + R3F 715 kB + three.js 689 kB，gzip 后各 14 · 253 · 177 kB）
- `npm run dev` + 无头截图 —— 确认 Tripo plant-cell GLB 实时渲染、有 HDRI 反射、投影、自转，且 callouts / Post-it / ViewMode / StageToolbar / Microscope / Compare 在实时 Canvas 之上仍正常工作

### 已知 v0.2 短板（已挂到 v0.3）
- HDRI 预设走 drei 的 CDN；离线 session 回退到 ambient + directional。
- 只有 `plant` 和 `animal` 有 GLB。其余 5 种细胞继续用水彩 hero 作主视觉，等专属模型。
- PBR popover 的 "Re-bake" / "Original" 按钮 UI 仍是 v0.1 状态，但 store action 已经接通，从代码或键盘触发 `togglePbrEnhanced()` 实时生效。
- `F`（聚焦）当前重跑 `resetCamera`；要做"框住当前细胞器"需要 3D 世界坐标锚点，v0.3 项目。

---

## [0.1.0] — 2026-05-13

> **里程碑：脚手架 + 像素级 UI。** 还没有实时 3D —— Stage 显示一张 AI 生成的剖面图。所有交互、布局、模式切换、资源管线都已经在跑。

### 新增
- 仓库根清理（3.9 GB → 1.3 GB）—— 删掉所有分析中间产物和旧的还原伪品
- 在 `apps/bioscope3d/`（当时还叫 `cell-architecture-studio` —— 见 [0.2.1]）搭起 **React 19 + Vite 6 + TypeScript 5**
- React Three Fiber 9 + Drei 10 + Postprocessing 3（3D 层布线就位，占位至 v0.2）
- Zustand 5 + `persist` middleware —— `mode` / `activeCell` / `favorites` / `viewMode` 等开关自动落盘到 `localStorage`
- 全局快捷键（通过 `react-hotkeys-hook`）：
  - `1`–`7` —— 切换细胞类型
  - `L` —— 切换标签
  - `X` —— 切换剖切
  - `Space` —— 切换自动巡游
  - `E` —— 打开导出抽屉
  - `Esc` —— 关闭任何已打开的抽屉 / 弹层
- 把 `design/v3/index.html`（v3.2 静态原型）**1:1** 迁成 28 个 React 组件：
  - **topbar/** —— Brand · Nav（5 个 tab 含 Quiz · NEW 红点）· ModeSwitch（Explore / Teach / Research）· UserMenu
  - **sidebar-left/** —— Cell Types（7 条）· Organelles（按细胞列表、活动行 chevron 指示）
  - **sidebar-right/** —— Organelle Details · Biological Notes · Where It Occurs（AI 生成的横向风景）
  - **canvas-head/** —— Breadcrumb · `<h1>` 标题 · PipelineBadge（"PBR Enhanced" popover 含 Re-bake / Original）
  - **stage/** —— Hero · Callouts（6 条 SVG 引出线带 Caveat 标签）· Post-it · ViewMode 面板（4 个 toggle 含 Labels 开关）· 4 角 HUD 水彩标本牌 · µm 比例尺 · Tour bar · 导出抽屉（4 分类 16 选项）· StageToolbar（Measure / Author Tour / 3D Export）
  - **bottom/** —— Microscope View（3 个倍率）· Compare Cells（含圆形 swap 按钮与差异提示）
- 9 张 AI 生成的水彩资源 —— 7 张细胞缩略图 + 1 张 stage hero + 1 张 "WHERE IT OCCURS" 风景，都在 `/public/assets/`
- 模式驱动 UI（`body[data-mode="…"]`）：
  - **Research** 显示 HUD · µm 比例尺 · Measure 按钮 · 完整导出抽屉
  - **Teach** 显示 Author Tour 按钮 · 大点击区 · 降低 HUD 不透明度
  - **Explore** 藏起精度控件，保持友好
- 细胞色级联（`body[data-cell="…"]` → `--cell-current`），自动洇到药丸、开关肌、原点、边框
- 数据层：7 种细胞 × 各自的细胞器和引出线坐标已就位
- TypeScript 构建管线：`tsc -b` 配 `tsconfig.node.json` 的 `composite: true`、全程 `strict: true`、零 `any`
- Vite 路径别名：`@/`、`@components/`、`@data/`、`@stores/`、`@hooks/`、`@lib/`、`@3d/`、`@styles/`、`@types/`
- `vite.config.ts` 里手动 chunk 切分，把 R3F + Drei + postprocessing 切到独立可缓存 chunk

### 文档
- 根：`README.md` · `AGENTS.md` · `LICENSE`（MIT）· `.editorconfig` · `.gitignore` · `CHANGELOG.md`
- 应用级：`apps/bioscope3d/README.md`
- 分析：`docs/01-video-analysis.md`（7 段自动巡游结构）· `docs/02-design-gap.md`（v1 → v2 → 参考图对照）· `docs/03-features.md`（63 项 F01–F63）· `docs/04-mvp-roadmap.md`（v0 → v1.0 计划）· `docs/05-open-questions.md`（决策日志）

### 验证
- `npm install` —— 干净安装，peer 解析阶段 0 漏洞
- `npm run typecheck` —— 通过
- `npm run build` —— 生产构建产出
- `npm run dev` —— `http://localhost:5173`，截图与 v3.2 静态原型像素一致

---

## [0.0.x] — 脚手架前的调研阶段

未正式发版 —— 留在这里供溯源。

### 做了
- 从 Hunyuan3D 下载 GLB（`20260512200414_6dc31f15.glb`，约 82 MB）和 Tripo3D（`tripo-plant-cell-test.glb`，约 85 MB）
- 用 `<model-viewer>` 复刻 Hunyuan 原始渲染（R2 路径）。对源视频 SSIM 约 0.78
- 诊断 GLB 质量问题：normal map 平、缺 AO、roughness 均一 —— 这些发现进了 v0.2 的 PBR 增强计划
- 静态设计原型迭代 v0 → v1 → v2 → v3 → v3.1 → **v3.2**（终版）
- 用户反馈后确立 3 受众产品策略（Explore / Teach / Research）

### 丢弃
- `apps/aeris/` —— 早期的科幻主题 React 脚手架，跟水彩美学不合。删了
- 基于 Python 的渲染管线（pyrender / VTK）—— 被 `<model-viewer>` 然后 R3F 取代
- "100% 视频还原"的字面解读 —— 按用户澄清重定义为"做交互 app"
