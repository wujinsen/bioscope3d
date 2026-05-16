# stellar-expanse

> 🌐 [English](./README.md) · **简体中文** · [日本語](./README.ja.md)

独立产品：**Stellar Expanse** 飞船选型界面。本包为 **Vite + React**；`pnpm dev:stellar-expanse` 下的页面已按冻结高保真原型 `design/v4-stellar-expanse/index.html` 对齐布局、色板与交互。`public/stellar/` 内置矢量占位图以便离线可用；若需与原型一致的摄影素材，可将 `design/v4-stellar-expanse/assets/` 中的图片拷入 `public/stellar/` 并改 `src/data/ships.ts` 的路径。

除非有明确的产品决策，否则**不要**把此 UI 并入 `apps/bioscope3d`。

## 开发

在仓库根目录：

```bash
pnpm install
pnpm dev:stellar-expanse
```

[http://127.0.0.1:5174](http://127.0.0.1:5174)

## 构建

```bash
pnpm --filter stellar-expanse build
```
