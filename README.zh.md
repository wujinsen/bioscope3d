# BioScope3D

> 🌐 [English](./README.md) · **简体中文** · [日本語](./README.ja.md)

> 一个开源、可交互的 3D 细胞观察器，面向**学生、教师、研究者**。
> 用 React 19 + React Three Fiber + Vite 构建，水彩 / 生物学教材风格。

![v0.2 截图](apps/bioscope3d/screenshot_v0.2.png)

---

## 这是什么

**BioScope3D** 是一个 Web 应用，把 AI 3D 服务（Hunyuan3D、Tripo3D）输出的 GLB 细胞模型，包装成一套可交互的学习体验：

- 7 种精选细胞 —— 植物、动物、细菌、红血球、神经元、白血球、肌肉
- 三档"分层体验模式"，由顶栏右上一个分段控件统一切换
- 手绘标注、水彩缩略图、便签提示、Caveat 手写体
- 真 PBR 渲染 —— HDRI 环境光、N8AO 屏空间环境光遮蔽、Bloom、世界空间剖切
- 路线图里的研究者级工具：随相机距离联动的 µm 比例尺、测距、GLB / glTF / USDZ / FBX 导出

三档模式：

| 模式 | 受众 | 突出 |
|---|---|---|
| **Explore**（默认） | K-12、爱好者 | 趣味、标注、小测验 |
| **Teach** | 教师 | 投影适配、自定义讲解路径 |
| **Research** | 生物学者 | µm 精度、测距、HUD、导出抽屉 |

---

## 快速开始

本仓库为 **pnpm monorepo**（`apps/*`）。在**根目录**安装一次：

```bash
pnpm install
# 实验室入口 → http://127.0.0.1:5170
pnpm dev:hub
# BioScope3D → http://127.0.0.1:5173
pnpm dev:bioscope3d
# 飞船脚手架 → http://127.0.0.1:5174
pnpm dev:stellar-expanse
```

**清单里的 GLB 模型**不在 Git 里。请从维护者的 **Google Drive**（链接另发，例如 Release 说明或项目 wiki）下载到仓库根目录 **`models/`**，再执行 **`pnpm sync:models`**，以便各应用的 `public/models/` 能被 Vite 使用。

**不要把 `#` 注释和 `pnpm` 写在同一行再整段粘贴**（部分 Cursor / Windows 环境会把 `#`、`http://…` 当成参数传给 Vite，被误当成项目根 `lab-hub/#`，端口也会乱）。

**若浏览器打不开或白屏：**请用 **`http://127.0.0.1:端口`**（不要只用 `localhost`）—— 部分 macOS / IPv6 下 `localhost` 会解析到 `::1`，而开发服务器只绑在 IPv4。若 Vite 提示路径里有 **`#`**，请删除 `apps/lab-hub/` 下误建的、字面名为 `#` 的文件夹。各应用的 `vite.config.ts` 已设置显式 `root`。

仍可只在某一应用内用 npm：

```bash
cd apps/bioscope3d
npm install
# http://127.0.0.1:5173
npm run dev
```

根目录跨应用脚本：

```bash
pnpm build           # 为所有声明了 build 的应用构建
pnpm typecheck       # 各应用 TypeScript 检查
```

仓库根需要 **pnpm 9+**（`corepack enable pnpm` 或 `npm i -g pnpm`）。锁文件：`pnpm-lock.yaml`。

在 `apps/bioscope3d` 内（npm 或 pnpm 均可）：

```bash
npm run build        # 生产构建 → dist/
npm run preview      # 本地预览生产构建
npm run typecheck    # tsc -b
npm run lint         # eslint
```

---

## 仓库结构

```
bioscope3d/                           仓库根（建议 clone 到 `bioscope3d/` 目录）
├── package.json                     pnpm 工作区根（见 pnpm-workspace.yaml）
├── apps/
│   ├── bioscope3d/                  BioScope3D — Web 应用（React + R3F + Vite）
│   ├── lab-hub/                     实验室入口页（链到各子应用）
│   └── stellar-expanse/             Stellar Expanse — 飞船（独立产品脚手架）
├── models/                          源 GLB 模型（3 个细胞，约 195 MB）
├── data/                            源参考视频（4 个 mp4，约 85 MB）
├── design/                          静态设计原型
│   ├── ref/                         用户提供的参考图
│   ├── v2/  v3/                     设计迭代（历史 —— 改名前的，仍标题为 "Cell Architecture Studio"）
│   └── v3/index.html                最终 v3.2 —— React 应用的像素级真值源
├── docs/                            项目分析 + 路线图
│   ├── 01-video-analysis.md         7 段自动巡游结构
│   ├── 02-design-gap.md             v1 → v2 → 参考图对照
│   ├── 03-features.md               63 项功能需求 F01–F63
│   ├── 04-mvp-roadmap.md            v0 → v1.0 分阶段计划
│   └── 05-open-questions.md         决策日志
├── tech.md                          锁定的技术栈（React 19、R3F、Drei、…）
├── AGENTS.md                        AI 协作约定（如果你是 AI，先读这个）
├── CHANGELOG.md                     版本历史
├── LICENSE                          MIT
└── README.md                        你正在看的这个（英文版）
```

---

## 文档去哪查

| 你想…… | 读 |
|---|---|
| 搞清产品在做什么 | `docs/03-features.md` |
| 搞清为啥长成那样 | `design/ref/cell_architecture_studio.png` + `docs/02-design-gap.md` |
| 找个任务做 | `apps/bioscope3d/README.md` → "Feature roadmap" |
| 了解代码怎么搭起来的 | `AGENTS.md` |
| 跑应用 | 根目录 `README.md`（pnpm）· `apps/bioscope3d/README.md` |
| 实验室入口 | `apps/lab-hub/README.md` |
| 看哪个版本发了什么 | `CHANGELOG.md` |

---

## 状态

| 阶段 | 内容 | 进展 |
|---|---|---|
| 调研 | 视频 / 模型 / 贴图分析 | ✅ 完成 —— 见 `docs/` |
| 设计 | v0 → v3.2 静态原型 | ✅ 完成 —— 见 `design/v3/` |
| 脚手架 | React + Vite + R3F + Zustand | ✅ v0.1 已交付 |
| **3D 实落地** | 实时 R3F Canvas + HDRI + PBR 流水线 | ✅ **v0.2 已交付** |
| 真交互 | µm 比例尺、测距、可拖剖切手柄 | ◐ v0.3 在路上 |
| 功能 | 时间线 / 导出 / 小测验 / 各细胞 GLB | ◐ v0.4–v0.7 |
| 打磨 | 响应式 · 可访问性 · 国际化 | ◐ v1.0 |

---

## 仓库目录名

建议把本仓库 clone 到 **`bioscope3d/`**，与 **BioScope3D** 产品一致。旧目录可能仍叫 **`3D2/`**（早期工作代号）；可一次性 `mv 3D2 bioscope3d` 后重新打开工作区，并检查脚本、Python venv 等是否写死了旧绝对路径。详见 [`AGENTS.md`](./AGENTS.md) 决策记录。

---

## License

MIT —— 见 [LICENSE](./LICENSE)。

源 3D 模型从 [Tripo3D](https://www.tripo3d.ai/) 和 [Hunyuan3D](https://3d.hunyuan.tencent.com/) 下载，受其各自服务条款约束。
