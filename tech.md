# Tech Stack

> 🌐 **English** · [简体中文](./tech.zh.md) · [日本語](./tech.ja.md)

The locked technology choices for BioScope3D. Any deviation requires an entry in `AGENTS.md` § 8 (Decision history).

## Layered view

| Layer | Tools |
|---|---|
| **App** | React 19, TypeScript 5, Vite 6 |
| **3D** | three.js 0.171, @react-three/fiber 9, @react-three/drei 10 |
| **Post-FX** | @react-three/postprocessing 3 (N8AO, Bloom) |
| **UI** | One `globals.css`, lucide-react icons |
| **State** | Zustand 5 + `persist` middleware |
| **Animation** | framer-motion 11 |
| **Keyboard** | react-hotkeys-hook |
| **Assets** | GLB models, transparent PNG thumbnails, NIH preview imagery |
| **Verification** | Playwright Core, PNG pixel-diff metrics (planned for v1.0) |

## Repository layout

The **bioscope3d** workspace is a **pnpm workspace** (`pnpm-workspace.yaml` at the root). Each runnable web app is **`apps/<name>/`** with its own `package.json` + Vite config. **`apps/bioscope3d`** is BioScope3D; **`apps/lab-hub`** is a thin landing page with env-driven links; **`apps/stellar-expanse`** is a separate ship-selector scaffold (not the cell product).

## Core libraries

- React 19
- Vite 6
- three.js
- React Three Fiber
- Drei
- Framer Motion
- Zustand
- Lucide React
- react-hotkeys-hook

## Optional backends (not yet wired)

- **Tripo API** — optional remote backend for GLB generation (v0.x mock; real integration deferred to post-v1.0)
- **Hunyuan3D local API** — optional local backend for GLB generation (same status)

## Why these and not alternatives

See `AGENTS.md` § 3 for the rules ("don't substitute") and § 8 for the actual decision records (R3F 9 over 8 for React 19 compatibility, Zustand over Redux/Recoil/Jotai, etc.).
