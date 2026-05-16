# 技术栈

> 🌐 [English](./tech.md) · **简体中文** · [日本語](./tech.ja.md)

BioScope3D 的锁定技术选型。任何偏离需要在 `AGENTS.md` § 8（决策历史）里登记一条。

## 分层视图

| 层 | 工具 |
|---|---|
| **应用** | React 19, TypeScript 5, Vite 6 |
| **3D** | three.js 0.171, @react-three/fiber 9, @react-three/drei 10 |
| **后处理** | @react-three/postprocessing 3（N8AO、Bloom）|
| **UI** | 一份 `globals.css`, lucide-react 图标 |
| **状态** | Zustand 5 + `persist` middleware |
| **动画** | framer-motion 11 |
| **键盘** | react-hotkeys-hook |
| **资源** | GLB 模型、透明 PNG 缩略图、NIH 预览图 |
| **验证** | Playwright Core、PNG 像素 diff 指标（v1.0 规划）|

## 仓库布局

本仓库（clone 根目录 **`bioscope3d/`**）使用 **pnpm workspace**（根目录 `pnpm-workspace.yaml`）。每个可运行的 Web 应用位于 **`apps/<name>/`**，自有 `package.json` 与 Vite 配置。**`apps/bioscope3d`** 为 BioScope3D；**`apps/lab-hub`** 为薄入口页（链接走环境变量）；**`apps/stellar-expanse`** 为独立的飞船选型脚手架（非细胞产品）。

## 核心库

- React 19
- Vite 6
- three.js
- React Three Fiber
- Drei
- Framer Motion
- Zustand
- Lucide React
- react-hotkeys-hook

## 可选后端（尚未接通）

- **Tripo API** —— GLB 生成的可选远端后端（v0.x 阶段是 mock；真接 API 推迟到 v1.0 之后）
- **Hunyuan3D 本地 API** —— GLB 生成的可选本地后端（状态同上）

## 为什么是这些而不是别的

约束（"不要换成别的"）见 `AGENTS.md` § 3，实际决策档案（为啥用 R3F 9 不用 8、为啥用 Zustand 不用 Redux / Recoil / Jotai 等）见 § 8。
