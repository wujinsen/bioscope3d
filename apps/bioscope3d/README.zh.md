# BioScope3D

> 🌐 [English](./README.md) · **简体中文** · [日本語](./README.ja.md)

> 可交互的 3D 细胞观察器 —— 在显微镜尺度上探索生命。

面向**学生、教师、研究者**的 Web 应用：在高质量 GLB 模型之上做检视、对比、解剖，三档"分层体验模式"统一切换。

---

## 三档模式，一个产品

| 模式 | 受众 | 突出内容 |
|---|---|---|
| **Explore** | K-12、爱好者、好奇大众 | 水彩底图 · Caveat 标注 · 小测验 · 友善提示 |
| **Teach** | 教师 | 投影适配 · 自定义讲解 · 大点击区 |
| **Research** | 生物学者、写论文的人 | µm 精度 · 测距 · HUD 读数 · 完整导出抽屉 |

通过顶栏右上的分段控件切换。

---

## 快速开始

在**仓库根目录**（推荐 — pnpm workspace）：

```bash
pnpm install
# http://127.0.0.1:5173
pnpm dev:bioscope3d
```

或在本目录内使用 npm：

```bash
cd apps/bioscope3d
npm install
# http://127.0.0.1:5173
npm run dev
```

```bash
npm run build        # 生产构建 → dist/
npm run preview      # 本地预览生产产物
npm run typecheck    # tsc -b
npm run lint         # eslint --max-warnings 0
```

---

## 技术栈

| 关注点 | 选型 | 理由 |
|---|---|---|
| **构建** | Vite 6 + TypeScript 5 | 即时 HMR、原生 ESM |
| **UI** | React 19 | Server actions、transitions、useOptimistic |
| **状态** | Zustand 5 + persist | 极小、无 provider、localStorage 持久化 |
| **3D** | three.js 0.171 + R3F 9 + Drei 10 | 工业标准场景图 + React DSL |
| **后处理** | @react-three/postprocessing 3 | Bloom（已移除 N8AO，说明见 `PostFx.tsx`） |
| **动画** | framer-motion 11 | 抽屉滑入、页面切换 |
| **图标** | lucide-react | tree-shake 友好、笔触契合水彩 |
| **键盘** | react-hotkeys-hook | 1-7 细胞 / L 标签 / X 剖切 / F1 自转 / **F2** Bloom / R 复位 |
| **Lint** | eslint 9 + typescript-eslint | flat config |

---

## 键盘快捷键

| 键 | 动作 |
|---|---|
| `1` – `7` | 切换细胞类型 |
| `L` | 切换细胞器标签 |
| `X` | 切换跨剖切 |
| `Space` | 切换自动巡游 |
| `E` | 打开导出抽屉 |
| `F1` | 切换怠速自转 |
| `F2` | 切换 Bloom — **顶排物理 F2**（不是数字 2）；Mac 常需 **Fn+F2**，或在系统键盘设置启用标准功能键 |
| `R` | 相机复位 |
| `F` | 聚焦当前选择（v0.2 等价于 R） |
| `Esc` | 关闭抽屉 / 弹层 |

---

## 目录结构

```
apps/bioscope3d/
├── public/
│   ├── models/                    /models/*.glb 的副本（通过 /models/… 提供）
│   ├── env_maps/                  HDRI 环境贴图（v0.3+ 用本地 .hdr）
│   └── assets/
│       ├── cells/                 7 张圆形水彩缩略图（192²）
│       └── scenes/                Stage hero 与 WHERE IT OCCURS 配图
├── src/
│   ├── main.tsx                   入口 —— 顺序引入 tokens.css → reset.css → globals.css
│   ├── App.tsx                    顶层布局 + 全局键盘 + body[data-*] 同步
│   ├── layouts/
│   │   └── StudioLayout.tsx       3 列 CSS grid（top / left / main / right）
│   ├── components/
│   │   ├── topbar/                Brand · Nav · ModeSwitch · UserMenu
│   │   ├── sidebar-left/          CellTypes · Organelles
│   │   ├── sidebar-right/         OrganelleDetails · BiologicalNotes · WhereItOccurs
│   │   ├── canvas-head/           Breadcrumb · Title · PipelineBadge（PBR popover）
│   │   ├── stage/                 3D 舞台 + 所有 DOM 叠加层
│   │   │   ├── Stage.tsx          组合所有元素；挂载 <CellScene />
│   │   │   ├── Callouts.tsx       SVG 引出线 + Caveat 标签
│   │   │   ├── PostIt.tsx · ViewModePanel.tsx · ScaleBar.tsx · HudCorners.tsx · PostFxToast.tsx
│   │   │   ├── StageToolbar.tsx · TourBar.tsx · ExportDrawer.tsx
│   │   ├── bottom/                MicroscopePanel · ComparePanel
│   │   └── ui/                    （规划中）Switch / Pill / Drawer / IconButton 等通用原语
│   ├── 3d/                        实时 R3F 场景图
│   │   ├── CellScene.tsx          <Canvas> 根 · ACES tone-map · sRGB · alpha 透底
│   │   ├── CellModel.tsx          useGLTF · PBR 增强 · 剖切平面
│   │   ├── SceneEnvironment.tsx   HDRI 预设（Studio · Lab · Sunset）
│   │   ├── PostFx.tsx             HDR Bloom
│   │   └── CameraRig.tsx          OrbitControls + autoRotate + reset
│   ├── data/
│   │   ├── cells.ts               7 种细胞元数据
│   │   └── organelles.ts          各细胞细胞器 + 引出线坐标
│   ├── stores/
│   │   └── useAppStore.ts         Zustand 单 store · localStorage 持久化
│   ├── hooks/
│   │   └── useKeyboard.ts         全局快捷键
│   ├── lib/
│   │   └── pbr.ts                 enhancePBR() · setClippingPlane() · 可逆切换
│   ├── styles/
│   │   ├── tokens.css             CSS 自定义属性（颜色 / 字体 / 阴影）
│   │   ├── reset.css              CSS reset
│   │   └── globals.css            布局与组件样式（迁移自 design/v3）
│   └── types/
│       └── index.ts               共享 TypeScript 类型
```

---

## 功能路线图

| 阶段 | 范围 | 状态 |
|---|---|---|
| **v0.1** | 脚手架 + v3.2 设计迁成 React 组件 | ✅ 完成 |
| **v0.2** | R3F Canvas + 加载 GLB + HDRI + PBR 增强 + 自转 | ✅ 完成 |
| v0.3 | 真测距工具 · µm 锚定 · 可拖剖切手柄 | 下一档 |
| v0.4 | 过程时间线 —— 光合作用（W1 首版） | – |
| v0.5 | 导出抽屉接通（GLB · PNG · 引用） | – |
| v0.6 | 小测验模式 | – |
| v0.7 | 补齐 7 种细胞各自的 GLB（目前只有 plant + animal） | – |
| v0.8 | URL hash 同步（可分享视图） | – |
| v1.0 | 打磨 + 响应式 + a11y + i18n | – |
| v1.x | Powers-of-Ten 缩放（W2）· 注释分享（Pro4）· GLB 导入（Pro2） | 未来 |

---

## 资源来源

清单内 **`models/*.glb`** 不在 Git 中 —— 从维护者的 **Google Drive**（链接在仓库外另行公布）下载到工作区根目录 **`models/`**，再执行 **`pnpm sync:models`**。`data/*.mp4` 仍在仓库根作分析参考。场景 PNG 仍手动镜像到 `public/assets/scenes/`。更广的自动化仍计划在 v0.3 用 `scripts/sync-assets.sh`。

Vite HMR 开发期间直接通过 `/models/...` 与 `/assets/...` URL 解析到 `public/` 即可。

---

## 相关链接

- [`../../README.md`](../../README.md) —— 仓库总览
- [`../../AGENTS.md`](../../AGENTS.md) —— AI 协作约定（决策记录、命名规则、"如何加一个细胞"操作手册）
- [`../../CHANGELOG.md`](../../CHANGELOG.md) —— 版本历史
- [`../../docs/`](../../docs/) —— 设计分析与功能规格
