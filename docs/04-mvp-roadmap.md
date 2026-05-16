# 04 · MVP 路线

> 🌐 [English](./04-mvp-roadmap.en.md) · **简体中文** · [日本語](./04-mvp-roadmap.ja.md)

## 路线总览

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  MVP v0     │    │  MVP v1     │    │  MVP v2     │    │  MVP v3     │
│ 静态设计稿  │ →  │ 核心闭环    │ →  │ 完整体验    │ →  │ 高级能力    │
│  ~1 天      │    │  ~3–4 天    │    │  ~3–4 天    │    │  ~5+ 天     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## MVP v0 — 静态设计稿 v2（当前阶段）

> **目标**：把参考图的所有视觉/交互锚点都还原成静态 HTML，便于审稿、定调，不写真 3D 也不接 R3F。

**含**：
- 顶栏：Logo + brand + tagline + 4 Tab + avatar
- 左栏：CELL TYPES（7 项带缩略图）+ ORGANELLES（可折叠）
- 中央：标题 + Post-it 提示 + 3D 画布（用视频片段占位）+ 工具栏
- 中下：MICROSCOPE VIEW + COMPARE CELLS 两卡片
- 右栏：ORGANELLE DETAILS + BIOLOGICAL NOTES + WHERE IT OCCURS

**产出**：`design/v2/index.html` （浏览器审稿用）

**对照点**：
- ✅ 与参考图 `docs/img/reference_studio.png` 在 1024×640 viewport 下做像素 diff
- ✅ 字段级覆盖率 100%（[02-design-gap.md](./02-design-gap.md) 的 11 项修正清单全打勾）

---

## MVP v1 — 核心闭环（13 项 P0 功能）

> **目标**：能跑通「打开 → 看一个细胞 → 切换到另一个 → 开自动巡游 → 截图」整套主流程，渲染达到 Tripo 视频水平。

| 功能 | 说明 |
|---|---|
| F01 多细胞库（7 种） | 数据 + GLB 资产准备 |
| F02 自动巡游 | 镜头状态机 |
| F03 独立时长 | 配置文件 |
| F04 硬切转场 | useEffect 切换 GLB |
| F05 每细胞镜头预设 | { theta, phi, radius, target, fov } |
| F06 PBR 顶级渲染 | R3F + Drei `<Environment>` + `@react-three/postprocessing` (N8AO + Bloom + ToneMapping) |
| F07 静态展示 / 极慢自转 | `useFrame` 增 0.001 rad/帧 |
| F08 Cinema 模式 | F 键全屏 / 按 Esc 退出 |
| F09 左栏点选 | onClick → setCellId |
| F10 OrbitControls | `<OrbitControls enableDamping />` |
| F11 模式切换 | `<motion>` 隐藏 chrome |
| F12 暂停 / 跳转 / 进度条 | 状态 + Slider |
| F15 缩略图 | 预跑 `ffmpeg -ss <t> -frames:v 1` 生成 7 张 |
| F17/F18 播放控制 | ◀ ⏸ ▶ |
| F19 时间轴 | `<Progress />` |
| F23 重置镜头 | `controls.reset()` |
| F28 Screenshot | `renderer.domElement.toBlob` |
| F31/F32/F34 元数据 | `data/cells.json` |
| F46 键盘快捷键 | useHotkeys |

**技术栈**（与 tech.md 对齐）：
```
React 19 + Vite + TypeScript
@react-three/fiber + @react-three/drei
@react-three/postprocessing
framer-motion         (UI 动效)
lucide-react          (图标)
zustand               (轻量状态管理)
react-hotkeys-hook    (快捷键)
```

**资产准备**：
- 7 个 cell GLB（手头有 plant cell + epithelial cell；其余先用程序化/占位）
- 1 张 HDRI（Tripo 同款奶米 gradient）
- 7 张 thumbnail（从视频每段抽 1 帧）

**完成定义**：
- 浏览器打开 → 默认进入 Studio 模式
- 左栏点细胞 → 中央换模型 + 镜头预设
- 按 Space → 进入 Auto Tour，自动按 4.5–7s 节奏切换
- 按 F → 进 Cinema 模式（chrome 全消失，只剩 3D）
- 截图按钮一键导出 PNG
- 渲染质量与 Tripo 视频 SSIM ≥ 0.7（局部 100×100 块测）

---

## MVP v2 — 完整体验（追加 P1）

### 参考图功能（13 项）

| 新增 | 说明 |
|---|---|
| F13 时长可调 | 设置面板里 slider |
| F14 HDRI 切换 | 3 个预设（奶米 / 暗紫 / 灰蓝）|
| F16 PBR 增强 pipeline | 独立 Python 脚本 `enhance_glb.py`，离线一次性跑 |
| F24 View Mode 三档 | 实体 / Cross-Section / Exploded |
| F25 Cross-Section | clipping plane shader |
| F29 录 30s MP4 | Puppeteer + ffmpeg 后端 |
| F36 Where it Occurs | 静态情境图 + 可选视频片段 |
| F37 Microscope View | 4 张 NIH / Cell Image Library 真实图 |
| F38 Compare Cells | 双 canvas 同步 controls |
| F43 Notebooks | localStorage 保存 viewport + 文本（与 F62 合并）|
| F49 PBR 增强开关 | 切换 baseGlb / enhancedGlb |
| F50 品质档位 | 自动检测 GPU → low / mid / high |
| F52 中英文 | i18next |

### v1 转译新功能（7 项 P1）

| 新增 | 说明 |
|---|---|
| **F54 Specimen Card 学术 HUD** | 画布 4 角浮层 + 截图带数据 |
| **F55 Curator Attribution** | 每细胞来源 / 贡献者 / 引用格式 |
| **F56 Mastery Progress** | 已浏览 / 标注 / 通过 Quiz 累计 |
| **F57 Pipeline Status Indicator** | Raw → Baking → Enhanced → Compare 状态脉冲 |
| **F58 Taxonomy Breadcrumb** | Domain · Kingdom · Cell type 3 级 |
| **F60 Tour Progress Bar** | `Cell 3 of 7 · 0:14 / 0:42` 可拖跳段（合并 F19）|
| **F62 Field Notes 用户标注** | 描述区可写笔记入 Notebooks |

**完成定义**：
- 参考图所有可见 UI 元素都有真实行为（不是占位）
- v1 里我喜欢的视觉元素（HUD / 脉冲 / 学术质感）已被科学化转译为 F54–F60
- 7 个细胞都跑 PBR 增强后视觉提升明显
- 30s 巡游能导出 MP4，长得跟原 Tripo 视频几乎一致

---

## MVP v3 — 高级能力（剩余 P2/P3）

### 原 P2 / P3

| 新增 | 说明 |
|---|---|
| F26 Isolate / F27 Hide Others | 依赖 F35 |
| F33 hover 高亮 | 依赖 F35 |
| F35 **细胞器自动分离** | 颜色聚类 + 几何 islands + UV 区域分割 |
| F44 Guided Tour | 解说脚本 + 自动镜头飞行 |
| F45 Quiz Mode | 教学增值 |
| F47 拖拽上传 | drop-zone + 实时增强 |
| F48 Tripo / Hunyuan API | 真接 API（需 key）|
| F53 导出 PDF 解剖图 | jsPDF + 标注合成 |

### v1 转译 P2（3 项）

| 新增 | 说明 |
|---|---|
| **F59 Render Budget Meter** | FPS / 三角面 / GPU 占用 实时显示 |
| **F61 Model Quality Grade** | A/B/C/D 评级（normal SNR / UV 利用 / 面数 / 纹理）|
| **F63 Onboarding Sequence** | 第一次打开 5 步引导 |

---

## 时间估算（一人全职）

| 阶段 | 工作量 | 关键风险 |
|---|---|---|
| v0 设计稿 v2 | 0.5–1 天 | 无 |
| **v1 核心闭环** | **3–4 天** | F06 渲染调参 / F05 镜头预设打磨 |
| v2 完整体验 | 3–4 天 | F35 不在内但被引用，需协调 |
| v3 高级能力 | 5+ 天 | F35 算法可能反复 |
| **总计** | **12–14 天** | F35 是最大不确定项 |

---

## 阶段交付物

| 阶段 | 可交付 | 验收方式 |
|---|---|---|
| v0 | `design/v2/index.html` | 浏览器打开对照参考图 |
| v1 | `apps/cell-studio/` 跑通主流程 | 视频录屏 demo |
| v2 | 与 Tripo 视频 1:1 复刻 + 完整 UI | 像素 diff + 字段覆盖 |
| v3 | 细胞器交互 + AI 生成 + 笔记 | 完整产品 demo |
