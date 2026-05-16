# lab-hub

> 🌐 **English** · [简体中文](./README.zh.md) · [日本語](./README.ja.md)

Monorepo landing page: links to **BioScope3D**, **Stellar Expanse**, and placeholder cards for future demos (robots, planets).

## Dev

From the **repository root** (requires [pnpm](https://pnpm.io/) 9+):

```bash
pnpm install
pnpm dev:hub
```

Default: [http://127.0.0.1:5170](http://127.0.0.1:5170)

Start sibling apps in other terminals so the links work:

```bash
# BioScope3D → http://127.0.0.1:5173
pnpm dev:bioscope3d
# Stellar → http://127.0.0.1:5174
pnpm dev:stellar-expanse
```

Do not paste `# …` on the **same line** as `pnpm …` in runners that forward argv to Vite (see root `README.md`). If Vite still warns about **`#`** in the path, remove a stray folder named `#` under `apps/lab-hub/`. Prefer **`http://127.0.0.1:<port>`** over `localhost` if the browser cannot connect.

## Environment

Copy `.env.example` → `.env` and adjust URLs when deploying or using non-default ports.

## Build

```bash
pnpm --filter lab-hub build
```

Output: `apps/lab-hub/dist/`
