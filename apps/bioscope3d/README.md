# BioScope3D

> 🌐 **English** · [简体中文](./README.zh.md) · [日本語](./README.ja.md)

> Interactive 3D cell viewer — explore life at the microscopic level.

A web application for **students, teachers, and researchers** to inspect, compare, and dissect cellular architecture. Built on top of high-quality GLB models, with three layered experience modes.

---

## Three modes, one product

| Mode | Audience | What's foregrounded |
|---|---|---|
| **Explore** | K-12, hobbyists, curious public | Watercolor visuals · Caveat callouts · Quiz · gentle hints |
| **Teach** | Educators | Projection-ready · Author guided tours · large hit-targets |
| **Research** | Biologists, paper writers | µm precision · Measure · HUD readouts · full Export drawer |

Switch via the segmented control in the top-right of the topbar.

---

## Quick start

From the **repo root** (recommended — pnpm workspace):

```bash
pnpm install
# http://127.0.0.1:5173
pnpm dev:bioscope3d
```

Or stay inside this folder with npm:

```bash
cd apps/bioscope3d
npm install
# http://127.0.0.1:5173
npm run dev
```

```bash
npm run build        # production bundle → dist/
npm run preview      # preview the production bundle locally
npm run typecheck    # tsc -b
npm run lint         # eslint --max-warnings 0
```

---

## Stack

| Concern | Choice | Why |
|---|---|---|
| **Build** | Vite 6 + TypeScript 5 | Instant HMR, native ESM |
| **UI** | React 19 | Server actions, transitions, useOptimistic |
| **State** | Zustand 5 + persist | Tiny, no providers, localStorage-backed |
| **3D** | three.js 0.171 + R3F 9 + Drei 10 | Industry-standard scene graph + React DSL |
| **Post-FX** | @react-three/postprocessing 3 | Bloom (N8AO removed — see `PostFx.tsx`) |
| **Animation** | framer-motion 11 | Drawer slides, page transitions |
| **Icons** | lucide-react | Tree-shakable, watercolor-friendly stroke |
| **Keyboard** | react-hotkeys-hook | Cells 1–7 / labels (L) / cross-section (X) / idle rotate (F1) / bloom (F2) / reset (R) |
| **Lint** | eslint 9 + typescript-eslint | Flat config |

---

## Keyboard shortcuts

| Key | Action |
|---|---|
| `1` – `7` | Switch cell type |
| `L` | Toggle organelle labels |
| `X` | Toggle cross-section clipping |
| `Space` | Toggle auto-tour |
| `E` | Open Export drawer |
| `F1` | Toggle idle auto-rotate |
| `F2` | Toggle bloom — physical **F2** key on the **top row** (not digit 2); Mac often **Fn+F2** or Settings → Keyboard → Use F-keys as standard |
| `R` | Reset camera |
| `F` | Focus current selection (v0.2: same as R) |
| `Esc` | Close drawers / popovers |

---

## Folder map

```
apps/bioscope3d/
├── public/
│   ├── models/                    Copies of /models/*.glb (served via /models/…)
│   ├── env_maps/                  HDRI environment maps (v0.3+: local .hdr)
│   └── assets/
│       ├── cells/                 7 round watercolor thumbnails (192²)
│       └── scenes/                Stage hero + WHERE IT OCCURS images
├── src/
│   ├── main.tsx                   Entry point — imports tokens.css → reset.css → globals.css
│   ├── App.tsx                    Top-level layout + global keyboard + body[data-*] sync
│   ├── layouts/
│   │   └── StudioLayout.tsx       3-column CSS grid (top / left / main / right)
│   ├── components/
│   │   ├── topbar/                Brand · Nav · ModeSwitch · UserMenu
│   │   ├── sidebar-left/          CellTypes · Organelles
│   │   ├── sidebar-right/         OrganelleDetails · BiologicalNotes · WhereItOccurs
│   │   ├── canvas-head/           Breadcrumb · Title · PipelineBadge (PBR popover)
│   │   ├── stage/                 The 3D stage + every DOM overlay
│   │   │   ├── Stage.tsx          Composes everything; mounts <CellScene />
│   │   │   ├── Callouts.tsx       SVG leader lines + Caveat labels
│   │   │   ├── PostIt.tsx · ViewModePanel.tsx · ScaleBar.tsx · HudCorners.tsx · PostFxToast.tsx
│   │   │   ├── StageToolbar.tsx · TourBar.tsx · ExportDrawer.tsx
│   │   ├── bottom/                MicroscopePanel · ComparePanel
│   │   └── ui/                    (planned) Switch, Pill, Drawer, IconButton primitives
│   ├── 3d/                        Live R3F scene graph
│   │   ├── CellScene.tsx          <Canvas> root · ACES tone-map · sRGB · alpha-clear
│   │   ├── CellModel.tsx          useGLTF · PBR pass · clipping plane
│   │   ├── SceneEnvironment.tsx   HDRI presets (Studio · Lab · Sunset)
│   │   ├── PostFx.tsx             HDR Bloom
│   │   └── CameraRig.tsx          OrbitControls + autoRotate + reset
│   ├── data/
│   │   ├── cells.ts               7 cells with metadata
│   │   └── organelles.ts          Per-cell organelles + callout coords
│   ├── stores/
│   │   └── useAppStore.ts         Zustand single store · persisted to localStorage
│   ├── hooks/
│   │   └── useKeyboard.ts         Global hotkeys
│   ├── lib/
│   │   └── pbr.ts                 enhancePBR() · setClippingPlane() · lossless toggles
│   ├── styles/
│   │   ├── tokens.css             CSS custom properties (colors / fonts / shadows)
│   │   ├── reset.css              CSS reset
│   │   └── globals.css            Layout + component styles (migrated from design/v3)
│   └── types/
│       └── index.ts               Shared TypeScript types
```

---

## Feature roadmap

| Phase | Scope | Status |
|---|---|---|
| **v0.1** | Scaffold + migrate v3.2 design as React components | ✅ done |
| **v0.2** | R3F Canvas + load GLB + HDRI + PBR enhance + auto-rotate | ✅ done |
| v0.3 | Real Measure tool · µm anchored · draggable cross-section handle | next |
| v0.4 | Process timeline — Photosynthesis (W1 first pass) | – |
| v0.5 | Export drawer wired (GLB · PNG · Citation) | – |
| v0.6 | Quiz mode | – |
| v0.7 | Per-cell GLBs for all 7 (currently only plant + animal) | – |
| v0.8 | URL hash sync (shareable views) | – |
| v1.0 | Polish + responsive + a11y + i18n | – |
| v1.x | Powers-of-Ten zoom (W2) · Annotation share (Pro4) · GLB import (Pro2) | future |

---

## Source assets

Curated **`models/*.glb`** are **not** in Git — download from the maintainer’s **Google Drive** (link shared outside the repo) into **`models/`** at the workspace root, then run **`pnpm sync:models`**. `data/*.mp4` stays in the repository root for analysis references. Scene PNGs are still mirrored manually into `public/assets/scenes/`. A broader `scripts/sync-assets.sh` will automate non-GLB assets in v0.3.

For Vite-served HMR development they are referenced directly via `/models/...` and `/assets/...` URLs that resolve to `public/`.

---

## See also

- [`../../README.md`](../../README.md) — repository overview
- [`../../AGENTS.md`](../../AGENTS.md) — conventions for AI coding agents (decision history, naming rules, "how to add a cell" playbook)
- [`../../CHANGELOG.md`](../../CHANGELOG.md) — version history
- [`../../docs/`](../../docs/) — design analysis + feature spec
