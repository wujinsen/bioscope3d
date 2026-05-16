# stellar-expanse

> 🌐 **English** · [简体中文](./README.zh.md) · [日本語](./README.ja.md)

Separate product: **Stellar Expanse** ship-selection UI. This package is **Vite + React**; the dev server mirrors the layout, tokens, and interactions of the frozen high-fidelity prototype at `design/v4-stellar-expanse/index.html`. Hero thumbnails ship as lightweight SVG stand-ins under `public/stellar/` so the page works offline; drop JPEG/PNG assets there (same filenames as the prototype’s `assets/`) and point `src/data/ships.ts` at them if you want photo parity.

Do **not** merge this UI into `apps/bioscope3d` unless there is an explicit product decision.

## Dev

From repo root:

```bash
pnpm install
pnpm dev:stellar-expanse
```

[http://127.0.0.1:5174](http://127.0.0.1:5174)

## Build

```bash
pnpm --filter stellar-expanse build
```
