# BioScope3D

> 🌐 **English** · [简体中文](./README.zh.md) · [日本語](./README.ja.md)

> An open-source, interactive 3D cell viewer for **students, teachers, and researchers**.
> Built with React 19 + React Three Fiber + Vite, in a watercolor / biology-textbook aesthetic.

![v0.2 screenshot](apps/bioscope3d/screenshot_v0.2.png)

---

## What is this

**BioScope3D** is a web app that takes downloaded GLB cell models from AI 3D services (Hunyuan3D, Tripo3D) and turns them into an interactive learning experience:

- 7 curated cell types — plant, animal, bacteria, RBC, neuron, WBC, muscle
- Three layered experience **modes**, gated by a single segmented control
- Hand-drawn callouts, watercolor thumbnails, Post-it tips, Caveat headings
- Real PBR rendering — HDRI lighting, N8AO, Bloom, world-space cross-section clipping
- Researcher-grade tooling on the roadmap: µm scale bar tied to camera, Measure, GLB / glTF / USDZ / FBX export

The three modes:

| Mode | Audience | Foregrounds |
|---|---|---|
| **Explore** (default) | K-12, hobbyists | Delight, callouts, Quiz |
| **Teach** | Educators | Projection-ready, Author Tour |
| **Research** | Biologists | µm precision, Measure, HUD, Export drawer |

---

## Quick start

This repository is a **pnpm monorepo** (`apps/*`). Install once at the root:

```bash
pnpm install
# lab hub → http://127.0.0.1:5170
pnpm dev:hub
# BioScope3D → http://127.0.0.1:5173
pnpm dev:bioscope3d
# Stellar → http://127.0.0.1:5174
pnpm dev:stellar-expanse
```

**Curated GLB models** are **not** in Git. Download them from the maintainer’s **Google Drive** (link shared separately — e.g. release notes or project wiki) into repo-root **`models/`**, then run **`pnpm sync:models`** so each app’s `public/models/` is wired for Vite.

Do **not** put `# …` on the **same line** as `pnpm …` when pasting into some runners (Cursor / Windows): extra tokens can be forwarded to Vite as a fake project root (e.g. `lab-hub/#`) and break ports.

**If the browser cannot connect or stays blank:** open **`http://127.0.0.1:<port>`** instead of `localhost` — on some macOS / IPv6 setups `localhost` resolves to `::1` while the dev server listens on IPv4 only. If Vite warns the path contains **`#`**, remove any stray folder literally named `#` under `apps/lab-hub/`. Each app’s `vite.config.ts` sets an explicit `root` next to the config file.

You can still work inside a single app with npm if you prefer:

```bash
cd apps/bioscope3d
npm install
# http://127.0.0.1:5173
npm run dev
```

Monorepo-wide scripts (from root):

```bash
pnpm build           # build every app that defines "build"
pnpm typecheck       # TypeScript in all apps
```

Requires **pnpm 9+** at the repo root (`corepack enable pnpm` or `npm i -g pnpm`). Lockfile: `pnpm-lock.yaml`.

Inside `apps/bioscope3d` (npm or pnpm):

```bash
npm run build        # production build → dist/
npm run preview      # serve the production build locally
npm run typecheck    # tsc -b
npm run lint         # eslint
```

---

## Repository map

```
bioscope3d/                           Repo root (clone this repo into a folder named `bioscope3d/`)
├── package.json                     pnpm workspace root (see pnpm-workspace.yaml)
├── apps/
│   ├── bioscope3d/                  BioScope3D — cells (React + R3F + Vite)
│   ├── lab-hub/                     Landing page linking to sibling dev servers / deploy URLs
│   └── stellar-expanse/             Stellar Expanse — ships (separate product scaffold)
├── models/                          Source GLB models (3 cells, ~195 MB)
├── data/                            Source reference videos (4 mp4, ~85 MB)
├── design/                          Static design prototypes
│   ├── ref/                         Reference image provided by user
│   ├── v2/  v3/                     Iterations (historical — pre-rename, still titled "Cell Architecture Studio")
│   └── v3/index.html                Final v3.2 — pixel-level source of truth for the React app
├── docs/                            Project analysis + roadmap
│   ├── 01-video-analysis.md         7-segment auto-tour structure
│   ├── 02-design-gap.md             v1 → v2 → ref comparisons
│   ├── 03-features.md               63 functional requirements F01–F63
│   ├── 04-mvp-roadmap.md            v0 → v1.0 staged plan
│   └── 05-open-questions.md         Decision log
├── tech.md                          Locked stack (React 19, R3F, Drei, …)
├── AGENTS.md                        Conventions for AI coding agents (read first if you're an AI)
├── CHANGELOG.md                     Version history
├── LICENSE                          MIT
└── README.md                        You are here
```

---

## Where to look

| You want to … | Read |
|---|---|
| Understand what we're building | `docs/03-features.md` |
| Understand why it looks like that | `design/ref/cell_architecture_studio.png` + `docs/02-design-gap.md` |
| Pick a task to work on | `apps/bioscope3d/README.md` → "Feature roadmap" |
| Know how the app is wired | `AGENTS.md` |
| Run the app | Root `README.md` (pnpm) · `apps/bioscope3d/README.md` |
| Lab landing | `apps/lab-hub/README.md` |
| See what shipped when | `CHANGELOG.md` |

---

## Status

| Phase | Stage | Outcome |
|---|---|---|
| Research | Video / model / texture analysis | ✅ done — see `docs/` |
| Design | v0 → v3.2 static prototype | ✅ done — see `design/v3/` |
| Scaffold | React + Vite + R3F + Zustand | ✅ v0.1 shipped |
| **3D real** | Live R3F Canvas + HDRI + PBR pipeline | ✅ **v0.2 shipped** |
| Interactions | µm scale, Measure, draggable cross-section | ◐ v0.3 next |
| Features | Timeline / Export / Quiz / per-cell GLBs | ◐ v0.4–v0.7 |
| Polish | Responsive · a11y · i18n | ◐ v1.0 |

---

## Repository folder name

Clone into **`bioscope3d/`** so the path matches the **BioScope3D** product. Older checkouts may still live under **`3D2/`** (early working title); rename once with `mv 3D2 bioscope3d` and re-open the workspace, or update any hard-coded absolute paths (Python venvs, CI caches). See [`AGENTS.md`](./AGENTS.md) decision history.

---

## License

MIT — see [LICENSE](./LICENSE).

Source 3D models are downloaded from [Tripo3D](https://www.tripo3d.ai/) and [Hunyuan3D](https://3d.hunyuan.tencent.com/) under their respective terms.
