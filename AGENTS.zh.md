# AGENTS.md —— BioScope3D 给 AI 协作者的约定

> 🌐 [English](./AGENTS.md) · **简体中文** · [日本語](./AGENTS.ja.md)

> **动代码前先读这个。**
> 这份文件是项目与 AI 助理（Cursor、Claude Code、GitHub Copilot Workspace 等）之间的合同，记录了那些**从文件树里看不出来的决策** —— 我们为什么这么搭、不会动什么、新东西放哪里。

> **命名说明**。产品叫 **BioScope3D**。之前曾叫 "Cell Architecture Studio"，那个名字现在只保留在 `design/v2/index.html` 与 `design/v3/index.html`（冻结的原型）和 `docs/` 里的历史叙述中。新代码、新文档、新提交一律使用 **BioScope3D**。

---

## 1. 使命

做出 **Web 上最好的开源可交互细胞观察器**。三类受众，**一个产品**（叠加分层、不分成三个 app）：

| 用户 | 模式 | 关心的 |
|---|---|---|
| K-12 学生 | `Explore`（默认） | 趣味 · 标注 · 小测验 · Caveat 手写 |
| 教师 | `Teach` | 投影 · 自定义讲解路径 · 大点击区 |
| 研究者 | `Research` | µm 精度 · 测距 · HUD 读数 · GLB / USDZ / 引用导出 |

通过顶栏右上分段控件切换（`Topbar.tsx::ModeSwitch`）。模式驱动 `body[data-mode]` 属性，由 CSS 控制元素的显隐。

**我们不做的：**
- Sketchfab 山寨版（不做模型市场）
- 科研显微数据仓（不做 DICOM、不做 PACS、不做大体积上传）
- 通用 3D 编辑器（不为任意物体提供变换 gizmo）
- Notion 竞品（Notebooks tab 只是导出目的地，不是主舞台）

---

## 2. 视觉北极星

| 真值 | 文件 |
|---|---|
| 参考设计 | `design/ref/cell_architecture_studio.png` |
| 像素级 HTML 实现 | `design/v3/index.html`（浏览器打开即可；自包含） |
| 并排对照 | `design/v3/compare_ref_v3_v31.png` |

任何时候你拿不准 "这里应该 Caveat 还是 Inter？" 或 "这看起来对不对？" —— **打开 `design/v3/index.html`，那个是真理**。

视觉词汇：
- 水彩 · 复古植物图鉴 · 生物学教材
- **Caveat**（手写）—— 区块标题、标注、便签
- **DM Serif Display** —— 页面标题、细胞名
- **Inter** —— UI 标签和按钮
- **JetBrains Mono** —— 数字、文件后缀、µm 数值
- 奶油纸背景 `#f2ece0`，橄榄绿 + 淡紫点缀
- 每种细胞有个专属色（`--cell-plant`、`--cell-rbc`…），通过 `--cell-current` 流到药丸、边框、开关肌、原点等

---

## 3. 技术栈（锁定 —— 见 `tech.md`）

| 层 | 选型 | 不要换成 |
|---|---|---|
| 构建 | Vite 6 | Webpack · Next.js |
| 框架 | React 19 | Vue · Svelte · SolidJS |
| 状态 | Zustand 5 + `persist` middleware | Redux · Recoil · Jotai · useContext-with-providers |
| 3D | three.js 0.171 + R3F 9 + Drei 10 | babylon.js · 原生 three.js |
| 后处理 | `@react-three/postprocessing` 3 | 手写 pass |
| 动画 | framer-motion 11 | react-spring（大多数情况） |
| 图标 | `lucide-react` | inline SVG（只允许 brand mark） |
| 键盘 | `react-hotkeys-hook` | 手写 keydown 监听 |
| 样式 | 一份 `globals.css`，直到证明不够用 | CSS-in-JS · Tailwind · styled-components |
| Lint | typescript-eslint flat config | tslint |

**硬约束：**
- **不要**新增状态库。Zustand 包揽所有 UI 与领域状态。
- **不要**加 CSS 框架。设计 token 在 `tokens.css` —— 用 token。
- **不要**关闭 `tsconfig.json::strict` 或使用 `any`。
- **不要**写"复述代码"的注释。注释解释**为什么**，从不解释**做了什么**。

---

## 4. 目录映射（没有 ADR 不要重组）

```
apps/bioscope3d/
├── src/
│   ├── main.tsx              入口：挂载 <App />，按顺序引入 3 份 CSS
│   ├── App.tsx               顶层：<StudioLayout /> + 全局快捷键 + body[data-*] 同步
│   ├── layouts/              页面级 grid
│   │   └── StudioLayout.tsx
│   ├── components/           UI 组件，按**屏幕区域**组织（不是按功能）
│   │   ├── topbar/           Brand + Nav + ModeSwitch + UserMenu（都在 Topbar.tsx 里）
│   │   ├── sidebar-left/     CellTypes + Organelles 列表
│   │   ├── sidebar-right/    OrganelleDetails + BiologicalNotes + WhereItOccurs
│   │   ├── canvas-head/      Breadcrumb + <h1> + PipelineBadge（PBR popover）
│   │   ├── stage/            3D 区域 + 所有 overlay（10 个文件）
│   │   ├── bottom/           MicroscopePanel + ComparePanel
│   │   └── ui/               可复用原语（Switch、Pill、Drawer、IconButton）
│   ├── 3d/                   R3F 场景图（CellScene、CellModel、ClippingHandle、…）
│   ├── data/                 纯数据：cells.ts · organelles.ts · tour.ts
│   ├── stores/               useAppStore.ts（Zustand）
│   ├── hooks/                共享 hooks（useKeyboard、useTour、useUrlState）
│   ├── lib/                  纯辅助（export.ts、pbr.ts、persistence.ts）
│   ├── styles/               tokens.css → reset.css → globals.css（按这个顺序加载）
│   └── types/                共享 TypeScript 类型
```

同属 `apps/*`、但**不属于**上面 BioScope3D 屏幕映射的包（pnpm workspace）：

```
apps/lab-hub/              Vite + React 入口页；卡片链到兄弟 dev 服务器 / 部署 URL（`VITE_*`）。
apps/stellar-expanse/      独立飞船选型产品（Vite + React 脚手架）。高保真静态参照：`design/v4-stellar-expanse/`。**未经 ADR 不要**把其 UI 并入 `apps/bioscope3d`。
```

规则：
- 组件按**屏幕区域**（`topbar/`、`sidebar-left/`…）放，不按功能（没有 `auth/`、`profile/`）。UI 是一个 single-page studio。
- 纯数据放 `data/`。**绝不**在组件里 inline 细胞元数据。
- 场景 / 3D 逻辑放 `3d/`，**绝不**放 `components/stage/`。
- "stage overlay"（Post-it、ViewMode panel、Tour bar…）是 R3F `<Canvas>` 的 DOM 兄弟节点，不是 Three.js mesh。

---

## 5. 状态约定

只有**一个** store：`stores/useAppStore.ts`。

所有 UI 切换、当前细胞、当前细胞器、收藏、抽屉开/关 —— 都走它。

```ts
const cell = useAppStore((s) => s.activeCell);  // ✓ 订阅一片
const all  = useAppStore();                      // ✗ 任何变更都会重渲
```

`persist` middleware 写入 `localStorage`，key 是 `bioscope3d:app-state`（schema v3）。`partialize` 函数控制持久化哪些字段（短暂 UI 状态如 `pbrPopoverOpen` 不持久）。

如果需要第二个 store，加 `stores/useUiStore.ts` 给纯短暂 UI 状态用。**不要扩张 store 数量。**

---

## 6. CSS 约定

v3.2 HTML 的 CSS **1:1** 迁到了 `styles/globals.css`。**选择器和类名完全一致**，React 组件直接照搬：

```tsx
<div className="stage">     {/* 不要改名成 .studio-stage */}
<div className="callout-label">  {/* 不要改名成 .annotation */}
```

规则：
- 新类名用 `lowercase-with-hyphens`，作用域限定在所属区域内（`.stage-toolbar`、`.callout-label`）。
- token（`var(--olive-dk)`）—— **必用，绝不硬编码十六进制**。
- 看起来归属某细胞的新颜色 → 加进 `tokens.css` 作 `--cell-xxx`，绝不内联。
- 模式驱动可见性：优先用 `body[data-mode="research"] .foo { … }`，避免在 React 里加条件渲染。
- 细胞色级联：靠 `--cell-current` 从 `body[data-cell="…"]` 顺着 CSS 级联 —— 不要把细胞色作为 React props 传递。

什么时候切到 CSS Modules：当一个类与其他区域冲突，或作用域泄漏可观测时。**在此之前不要。**

---

## 7. 加东西的操作手册

### 加一种新细胞

1. `src/types/index.ts` → 把新 id 加到 `CellId` 字面量 union。
2. `src/data/cells.ts` → 在 `CELLS` map 里加一条 `CellMeta`，并 push id 到 `CELL_ORDER`。
3. `src/data/organelles.ts` → 加一条 `ORGANELLES_BY_CELL[id]`（一个 `Organelle` 数组）。
4. `public/assets/cells/{id}.png` —— 放一张 192² 圆形水彩缩略图（必要时用 AI 生成）。
5. `public/assets/scenes/hero_{id}.png` —— 放一张 hero 剖面（或暂时回退到 plant）。
6. `public/models/{id}.glb` —— 放源 GLB（v0.2 前可选）。
7. `src/styles/tokens.css` → 加 `--cell-{id}: #RRGGBB;`。
8. 追加一条 `body[data-cell="{id}"] { --cell-current: var(--cell-{id}); }`（`tokens.css` 已经在做了）。

完事 —— 左边栏列表、面包屑、颜色级联、显微镜变体、对比面板会自动捡起。

### 给已存在的细胞加一个新细胞器

往那个细胞的数组（`data/organelles.ts`）追加一条即可。左边栏 Organelles 列表和右边栏 Organelle Details 面板都会从这份数据渲染。

### 加一个新键盘快捷键

改 `hooks/useKeyboard.ts` → 加一条 `useHotkeys` 调用。把它登记进 cheatsheet（TODO：v0.3 做 cheatsheet UI）。

### 加一个新功能开关

- `.env.example` → 加 `VITE_ENABLE_FOO=true`
- 通过 `import.meta.env.VITE_ENABLE_FOO === "true"` 读
- 开关默认**开**；开关只是为了在生产里关掉问题功能。

### 加一种新导出格式

`components/stage/ExportDrawer.tsx::CATEGORIES` → push 到合适的类别。真正实现时把点击处理函数挂到 `lib/export.ts` 里。

### 加一个新 Mode（拜托别加，但如果非得加）

当前 3 个模式：`Explore` / `Teach` / `Research`。第 4 个是个气味 —— 通常该用一个 setting 而不是新 mode 来 gating。

如果躲不开：
1. `types/index.ts` → 扩 `Mode` 字面量。
2. `components/topbar/Topbar.tsx::MODES` → 加条目。
3. `globals.css` → 加 `body[data-mode="…"]` 的可见性规则。

---

## 8. 决策历史

由新到旧。**当你做了一个不在这里的决策，把它加进来。**

### 2026-05-16 · Tripo PBR 闪点治理（B4–B3 + C1 + A1）
短期 **B4+C1** 见 `pbr.ts` / `SceneEnvironment` / Tripo `<model-viewer>` 曝光。中期 **B1–B2** 与 Research **B3** 见 `tripoDebug.ts`（R3F `CellModel` 挂载时）。只读批量审计：`apps/bioscope3d/scripts/audit-tripo-gltf.mjs`（`pnpm -C apps/bioscope3d audit:gltf`）。三语文档：`docs/06-pbr-tripo-mitigation.md`（及 `.en.md`、`.ja.md`）。

### 2026-05-14 · 约定 clone 目录名 **`bioscope3d/`**
历史上本地目录常叫 **`3D2`**（早期工作代号）。文档与目录树现在以 **`bioscope3d/`** 作为仓库根标签，与 **BioScope3D** 产品一致。有空时把本地目录改名（`mv 3D2 bioscope3d` 或重新 clone），并检查个人脚本、Python venv 等是否写死旧绝对路径。根工作区 `package.json::name` 为 **`bioscope3d-workspace`**，与 `apps/` 下的 **`bioscope3d`** 应用包名区分。

### 2026-05-14 · pnpm monorepo · 多个 `apps/*`
仓库根为 **pnpm 工作区**（`pnpm-workspace.yaml` + 根 `package.json`）。`apps/bioscope3d` 仍是 BioScope3D 交付物。**`apps/lab-hub`** 为薄入口页（端口 / URL 走环境变量）。**`apps/stellar-expanse`** 为**另一条产品线**的脚手架（飞船，非细胞）。各 app 自有 Vite、依赖与 `apps/<name>/dist/` 构建产物。无关的 3D demo 优先**懒加载或分开展示**；hub 只负责链接，除非明确决策，否则不把每套 GLB 栈打进一个 JS entry。

**若此前只在 `bioscope3d` 里用过 npm：**删掉 `apps/bioscope3d/node_modules`，再在仓库根执行 `pnpm install`，以便 pnpm 正确链接工作区。

### 2026-05-14 · GLB 单一源 + **外链分发** + `pnpm sync:models`
大型 `.glb` **不进**本 Git 仓库（体积与流量）。维护者另发下载（目前为 **Google Drive**）；下载到仓库根 **`models/`**（gitignore）后执行 **`pnpm sync:models`**。**`scripts/sync-models.mjs`** 把清单镜像到各应用的 `public/models/`，供 Vite 以 `/models/…` 提供：**macOS/Linux 写相对 symlink**，**Windows 用 `copyFile`**。有新应用或文件名映射时扩展 **`scripts/sync-models.mjs::ENTRIES`**。设计资源与 MP4 仍按 §9 里规划的 **`scripts/sync-assets.sh`** 处理。

### 2026-05-13 · 产品改名 "Cell Architecture Studio" → **BioScope3D**
工作代号撞了用户提供的参考图本名。产品有了自己的人格（3 模式、分层 UX、PBR 流水线）之后，沿用参考图的名字开始造成混乱 —— "Cell Architecture Studio" 到底是灵感还是产物？

改名范围：
- App 目录：`apps/cell-architecture-studio/` → `apps/bioscope3d/`
- `package.json::name`：`cell-architecture-studio` → `bioscope3d`
- HTML `<title>` + meta description
- `Topbar.tsx` 品牌：`<em>Cell</em> Architecture Studio` → `<em>BioScope</em>3D`
- localStorage 持久化 key：`cas:app-state` → `bioscope3d:app-state`（schema 升到 v3；既有用户首次打开 UI state 会重置 —— pre-v1 可接受）
- 导出抽屉水印文案
- LICENSE 版权人
- README / AGENTS / CHANGELOG / 应用 README —— 全部更新

**故意不改：**
- `design/v2/index.html` 与 `design/v3/index.html` —— 冻结原型；它们的 `<title>Cell Architecture Studio</title>` 是设计血脉的考古记录。
- `docs/01-video-analysis.md`、`docs/02-design-gap.md`、`docs/05-open-questions.md` 中指代用户参考图本名的句子 —— 那是关于源资产的事实陈述，不是关于产品的陈述。

### 2026-05-13 · v0.2 · Hero `<img>` 留在实时 Canvas 之下
Canvas 用 `alpha: true` 且在 z 轴上叠在 `.hero` 之上。结果：
- GLB 流式加载期间，水彩 hero 充当 loading 状态 —— 没有"空白闪烁"。
- 没有 GLB 的细胞只显示 hero —— `CellScene` 在 `cell.modelPath` 为 undefined 时返回 `null`。
- vignette 叠层在两者**之上**，整体气质不破。

接 R3F 给新细胞时**不要**把 hero `<img>` 拿掉；这种分层是刻意为之的。

### 2026-05-13 · v0.2 · PBR 是可逆且 store 驱动
`enhancePBR(scene, on)` 第一次碰到 material 时把原值快照到 `material.userData.__pbrOriginal`，所以"Re-bake" / "Original" 切换是个完整往返，不需要重新加载 GLB。任何未来会改 material 的效果（emission boost、x-ray 模式）都按这个模板写。

### 2026-05-13 · v0.2 · 用 drei `<Environment preset>`，接受 CDN 依赖
HDRI 预设从 drei 的 CDN 加载 HDR 贴图。v0.2 可接受，因为：
- 包了 `<Suspense fallback={null}>`，CDN 被屏蔽时不会拖崩场景 —— ambient + directional 还能把材质照亮，只是没 IBL 反射。
- v0.3 会在 `public/env_maps/` 落本地 `.hdr`，切到 `<Environment files={...}>`。

### 2026-05-13 · 一份全局 CSS，不切 CSS Modules
我们把 v3.2 的 HTML/CSS 原样迁进来。切成 per-component module 得重命名所有 class。决定：在真出现冲突或性能问题前，保留 `globals.css`。

### 2026-05-13 · R3F 9，不是 R3F 8
R3F 8 的 peer dep 是 `react@>=18 <19`。`tech.md` 锁了 React 19。所以把 R3F 升到 9、Drei 升到 10、Postprocessing 升到 3。

### 2026-05-13 · `body[data-*]` 而不是 React Context 处理跨切关注点
v3.2 静态 CSS 用 `body[data-mode]` 和 `body[data-cell]`。`App.tsx` 把 store 映射到 body 属性上。这样 v3.2 的 CSS **直接能用**，不必把选择器改成 JS 驱动的 className 字符串。

### 2026-05-13 · Stage 里放静态 hero 占位
`Stage.tsx` 先渲染一张静态 AI 剖面图，而不是实时 R3F Canvas —— 直到 v0.2。让 UI 工作和 3D 工作并行不阻塞。替换目标是 `src/3d/CellScene.tsx`。

### 2026-05-13 · 3 模式分层（不是 3 个分立 app）
最初提案只面向 K-12 学生。用户纠正：3 类受众用**分层 UI** 在同一个表面服务。所以 Mode switcher 通过 CSS gating HUD / Export / Measure 的可见性，而不是用路由分页。

### 2026-05-12 · "100% 还原" 重新框定为"做交互 app"
最初的命题是"100% 还原视频"。用户澄清：复刻**围绕 3D 的整个 app**，而不只是渲染。这让 R3F 而不是渲染 / 视频流水线成了优先项。

### 2026-05-12 · 水彩美学，不是科幻风
早期探索（AERIS、PIONEERS）用了科幻 HUD。用户提供的参考图（`design/ref/cell_architecture_studio.png`）是手绘生物教材风。美学锁定。

---

## 9. 资源位置

| 资源 | 真值源 | 镜像到 |
|---|---|---|
| GLB 模型 | 维护者网盘（如 Google Drive）→ 本地 `/models/*.glb`（gitignore） | `apps/bioscope3d/public/models/` 与 `apps/stellar-expanse/public/models/`（经 `pnpm sync:models`） |
| 细胞缩略图 | `/design/v3/img/cells/*.png` | `apps/bioscope3d/public/assets/cells/` |
| Stage hero / 场景图 | `/design/v3/img/scenes/*.png` | `apps/bioscope3d/public/assets/scenes/` |
| 参考视频 | `/data/*.mp4` | 不镜像 —— 仅作分析源 |
| HDRI 贴图 | （暂无） | `apps/bioscope3d/public/env_maps/` |

更新 `models/*.glb` 后，在仓库根执行 **`pnpm sync:models`**（见 §8）。设计资源与 MP4 仍手动镜像；**v0.3+：** 仍计划用 `scripts/sync-assets.sh` 覆盖那部分。

---

## 10. 不要做的事

- **不要引 UI 库**（Material、Chakra、Mantine、shadcn）。v3.2 设计太特定。我们手工搭。
- **不要"因为它现代"就切 per-component CSS Modules**。`globals.css` 现在够用。
- **不要把水彩美学换成更"专业"的样子**。美学**就是**差异化。
- **不要引 SSR**（Next.js、Remix）。这是纯客户端 app —— Vite 静态部署。
- **不要把大 `.glb` 提交进 Git**（普通对象或 LFS 都不要）。放在外链存储（如 Google Drive）；本地只用 **`models/`** + **`pnpm sync:models`**。
- **不要写复述代码的注释**。代码说**做什么**；注释说**为什么**。
- **不要加 Tailwind**。设计里有大约 600 个自定义选择器 —— 转过去是倒退。
- **不要把 `<img>` 占位迁到一个半成的 R3F Canvas**。要么把 R3F 做扎实（v0.2），要么留占位。

---

## 11. PR / commit 约定

（在 git 工作流正式建立之前 —— 这里是提醒文字。）

- **一个 commit 一个特性。**整个 Mode switcher 是 1 个 commit。不要打包。
- **标题：** `<area>: <imperative verb> <noun>`
  - ✓ `stage: add organelle callouts overlay`
  - ✓ `store: persist mode and active cell across refresh`
  - ✓ `data: add muscle cell organelles`
  - ✗ `WIP fixes` / `update some stuff`
- **正文：**解释为什么，不解释做了什么。diff 已经告诉你做了什么。

---

## 12. 卡住了怎么办

1. **打开 `design/v3/index.html`** 在浏览器里。静态原型是不是已经展示了你要的东西？那 spec 就在那里 —— 照搬。
2. **读 `docs/03-features.md`** —— 这个特性大概率已经列在 F01–F63 里了。
3. **若决策缺失**，做一个，然后加到「决策历史」（§ 8）里。
4. **不要在 A 明显更好时还问用户**让选 A 还是 B。选 A，一句话解释，继续。
5. **如果工具因沙箱失败**，确认确实需要后用 `required_permissions: ["all"]` 重跑一次。

---

## 13. 文件状态约定

占位文件（比如今天的 `3d/CellScene.tsx`）在文件顶部带一个块：

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

保留这个约定，让下一个接手的 agent 不需要猜这个文件是不是废弃了。

---

## 14. 全新 AI session 入职

如果你刚开这个仓库、零上下文，按顺序：

1. **读这个文件（AGENTS.md）** —— 你正在做。特别留意 § 15（文档语言约定）—— 这是个三语仓库，那是硬规则，不是可有可无。
2. 在浏览器打开 **`design/v3/index.html`**，点 60 秒。那个就是产品。
3. 略读 **`docs/03-features.md`** —— 63 个功能与优先级的清单。
4. 略读 **`docs/04-mvp-roadmap.md`** —— 计划与节奏。
5. 打开 **`apps/bioscope3d/src/App.tsx`** —— React 入口。
6. 略读 **`apps/bioscope3d/src/stores/useAppStore.ts`** —— 运行时状态的唯一真值源。

读完这 6 步，应该已经能动手。

---

## 15. 文档语言约定

### 15.0 三句话总纲

本仓库出三个语言：**English** / **简体中文** / **日本語**。规则就三条，写任何文档之前先内化：

1. **默认用中文跟用户回复。** 主要维护者用中文工作 —— 计划文本、状态汇报、任务尾的总结一律中文。代码标识符、控制台日志、错误信息、代码内注释保持英文（那是代码风格规则，不是本地化）。除非用户明确叫你换语言，否则不换。

2. **新写文档先用英文。** 英文是**你以后创建的所有文档的 canonical 语言**：先写 `foo.md`（英文），再在同 commit 加上 `foo.zh.md` 和 `foo.ja.md` 译本。中日两版以英文版为真理基准、同步跟随。（一个历史例外：`docs/0*-*.md` 原稿就是中文，保留中文 canonical —— 那是关于其原稿语言的事实，不是要被纠正的退步。）

3. **改了一份，三份都得改。** 翻译之间不允许漂移。只来得及改一种语言 —— 那这次任务就还没完成。同 commit 改齐三个文件，否则就不发。

每份多语言文件靠近顶部带一条 banner，**加粗**的是当前语言，其它的是链接：

```md
> 🌐 **English** · [简体中文](./README.zh.md) · [日本語](./README.ja.md)
```

### 15.1 各文件的 canonical 语言（当前现状）

往后新建的文件默认 **canonical = 英文**（见上 Rule 2）。仓库当前已有文件的对照表：

| 文件组 | Canonical | 后缀翻译版 |
|---|---|---|
| 根 `README.md` · `AGENTS.md` · `CHANGELOG.md` · `LICENSE` | **English** | `*.zh.md` · `*.ja.md` |
| `apps/bioscope3d/README.md` | **English** | `README.zh.md` · `README.ja.md` |
| `tech.md` | **English** | `tech.zh.md` · `tech.ja.md` |
| `docs/*.md` | **简体中文**（历史成因 —— 分析期产物原稿就是中文） | `*.en.md` · `*.ja.md` |

### 15.2 三语文件清册（权威列表）

下面这些文件**必须三个一组**一起动。改一个，另两个就是同一 commit 的强制后续：

| 组 | 文件 |
|---|---|
| 根 README | `README.md` · `README.zh.md` · `README.ja.md` |
| 根 AGENTS | `AGENTS.md` · `AGENTS.zh.md` · `AGENTS.ja.md` |
| 根 CHANGELOG | `CHANGELOG.md` · `CHANGELOG.zh.md` · `CHANGELOG.ja.md` |
| 技术栈 | `tech.md` · `tech.zh.md` · `tech.ja.md` |
| 应用 README | `apps/bioscope3d/README.md` · `apps/bioscope3d/README.zh.md` · `apps/bioscope3d/README.ja.md` |
| 应用 README · lab-hub | `apps/lab-hub/README.md` · `apps/lab-hub/README.zh.md` · `apps/lab-hub/README.ja.md` |
| 应用 README · stellar-expanse | `apps/stellar-expanse/README.md` · `apps/stellar-expanse/README.zh.md` · `apps/stellar-expanse/README.ja.md` |
| Docs · README | `docs/README.md` · `docs/README.en.md` · `docs/README.ja.md` |
| Docs · 视频分析 | `docs/01-video-analysis.md` · `docs/01-video-analysis.en.md` · `docs/01-video-analysis.ja.md` |
| Docs · 设计差距 | `docs/02-design-gap.md` · `docs/02-design-gap.en.md` · `docs/02-design-gap.ja.md` |
| Docs · 功能清单 | `docs/03-features.md` · `docs/03-features.en.md` · `docs/03-features.ja.md` |
| Docs · MVP 路线图 | `docs/04-mvp-roadmap.md` · `docs/04-mvp-roadmap.en.md` · `docs/04-mvp-roadmap.ja.md` |
| Docs · 开放问题 | `docs/05-open-questions.md` · `docs/05-open-questions.en.md` · `docs/05-open-questions.ja.md` |
| Docs · PBR / Tripo 闪点治理 | `docs/06-pbr-tripo-mitigation.md` · `docs/06-pbr-tripo-mitigation.en.md` · `docs/06-pbr-tripo-mitigation.ja.md` |

新加一份多语言文件时，**同一 commit 也要把它登记到这张表里**。

### 15.3 提交前自检（硬性规则）

宣布一项"文档相关任务完成"之前：

1. 列出你这次改了哪些文件。
2. 每个出现在 § 15.2 里的被改文件，**确认另外两份兄弟也改了**。
3. 三份只改了一份 —— 任务没完成。当场把 diff 翻译到另两份。
4. 若某节确实**只在某一语**里（半成品、语言专属说明），明确标 `(EN-only)` / `(ZH-only)` / `(JA-only)`，下个 agent 才不会误读为漂移。

发现自己对三语文件只交了一份语言版本，那是回归，不是 feature —— 当场修。

### 15.4 不要

- 不要翻译 `LICENSE`（法律文本必须英文）。
- 不要为了"让 canonical 统一"而事后把 `docs/0*-*.md` 的中文原稿对调为英文 canonical —— 原稿是中文是事实，不是退步。
- 不要让翻译漂移。如果 `*.zh.md` 的某段已经对不上 `*.md`，那是 bug，发现就同 commit 修掉。
- 不要新建顶层文档时先写中文或日文、"之后再翻译"。按 Rule 2：先英文，三份同 commit。

---

## 16. 致谢

源 3D 模型来自 [Tripo3D](https://www.tripo3d.ai/) 和 [Hunyuan3D](https://3d.hunyuan.tencent.com/)。
AI 生成的水彩资源由 Cursor agent + Imagen 出品。
驱动 v3.2 的参考设计是用户提供的手稿（原本叫 "Cell Architecture Studio"）；产品本身在 2026-05-13 改名为 BioScope3D（见 § 8）。
