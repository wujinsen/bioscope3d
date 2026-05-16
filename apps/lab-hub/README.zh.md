# lab-hub

> 🌐 [English](./README.md) · **简体中文** · [日本語](./README.ja.md)

Monorepo 入口页：指向 **BioScope3D**、**Stellar Expanse**，以及预留的机器人 / 星球等展示卡片。

## 开发

在**仓库根目录**（需 [pnpm](https://pnpm.io/) 9+）：

```bash
pnpm install
pnpm dev:hub
```

默认 [http://127.0.0.1:5170](http://127.0.0.1:5170)

在其它终端启动兄弟应用后，卡片链接才可用：

```bash
# BioScope3D → http://127.0.0.1:5173
pnpm dev:bioscope3d
# Stellar → http://127.0.0.1:5174
pnpm dev:stellar-expanse
```

**不要把 `#` 与 `pnpm` 写在同一行再整段粘贴**（见根目录 `README.md`）。若 Vite 仍提示路径含 **`#`**，删除 `apps/lab-hub/` 下误建的 `#` 文件夹。浏览器连不上时优先用 **`http://127.0.0.1:端口`**。

## 环境变量

复制 `.env.example` 为 `.env`，部署或非默认端口时修改 URL。

## 构建

```bash
pnpm --filter lab-hub build
```

产物：`apps/lab-hub/dist/`
