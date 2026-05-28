# AGENTS.md — BioScope3D conventions for AI coding agents

> 🌐 **English** · [简体中文](./AGENTS.zh.md) · [日本語](./AGENTS.ja.md)

> **Read this before touching code.**
> This file is the project's contract with AI coding assistants (Cursor, Claude Code, GitHub Copilot Workspace, etc.). It captures decisions that aren't visible from the file tree alone — _why_ we built it this way, what we won't change, and where to put new things.

> **Naming note.** The product is **BioScope3D**. It was earlier called "Cell Architecture Studio" — that name persists only in `design/v2/index.html` and `design/v3/index.html` (frozen prototypes) and in historical sentences in `docs/`. New code, new docs, and new commits use **BioScope3D**.

---

## 1. Mission

Build the **best open-source interactive cell viewer on the web**.

Three audiences, **one product** (layered, not three separate apps):

| User | Mode | Cares about |
|---|---|---|
| K-12 student | `Explore` (default) | Delight · callouts · Quiz · Caveat handwriting |
| Teacher | `Teach` | Projection · Author Tour · large hit-targets |
| Researcher | `Research` | µm precision · Measure · HUD readouts · GLB / USDZ / citation export |

Switch via the segmented control in the top-right of the topbar (`Topbar.tsx::ModeSwitch`). Mode drives a `body[data-mode]` attribute that gates element visibility via CSS.

**We are not building:**
- A Sketchfab clone (no model marketplace)
- A research microscopy data store (no DICOM, no PACS, no large-volume uploads)
- A general-purpose 3D editor (no transform gizmos for arbitrary objects)
- A Notion competitor (Notebooks tab exists as a destination for exports, not as a primary surface)

---

## 2. North-star visuals

| Truth | File |
|---|---|
| The reference design | `design/ref/cell_architecture_studio.png` |
| The pixel-perfect HTML implementation | `design/v3/index.html` (open in browser; self-contained) |
| Side-by-side comparison | `design/v3/compare_ref_v3_v31.png` |

If you ever wonder "should this be Caveat or Inter?" or "does this look right?" — **open `design/v3/index.html`; that is canon**.

Aesthetic vocabulary:
- Watercolor · vintage botany journal · biology textbook
- **Caveat** (handwriting) — section titles, callouts, post-its
- **DM Serif Display** — page titles, cell names
- **Inter** — UI labels and buttons
- **JetBrains Mono** — numbers, file extensions, µm values
- Cream paper background `#f2ece0`, olive + lilac accents
- Each cell has a signature color (`--cell-plant`, `--cell-rbc`, …) that flows through pills, borders, switch toggles via `--cell-current`

---

## 3. Stack (locked — see `tech.md`)

| Layer | Choice | Don't substitute with |
|---|---|---|
| Build | Vite 6 | Webpack · Next.js |
| Framework | React 19 | Vue · Svelte · SolidJS |
| State | Zustand 5 + `persist` middleware | Redux · Recoil · Jotai · useContext-with-providers |
| 3D | three.js 0.171 + R3F 9 + Drei 10 | babylon.js · plain three.js |
| Post-FX | `@react-three/postprocessing` 3 | hand-rolled passes |
| Animation | framer-motion 11 | react-spring (mostly) |
| Icons | `lucide-react` | inline SVGs (allowed only for the brand mark) |
| Keyboard | `react-hotkeys-hook` | hand-rolled keydown listeners |
| Style | One `globals.css` until proven inadequate | CSS-in-JS · Tailwind · styled-components |
| Lint | typescript-eslint flat config | tslint |

**Hard rules:**
- Do **not** add a new state library. Zustand handles all UI + domain state.
- Do **not** add a CSS framework. Design tokens live in `tokens.css` — use them.
- Do **not** disable `tsconfig.json::strict` or use `any`.
- Do **not** add comments that narrate code. Comments explain **why**, never **what**.

---

## 4. Folder map (don't reorganize without an ADR)

```
apps/bioscope3d/
├── src/
│   ├── main.tsx              Entry: mounts <App />, imports the 3 CSS files in order
│   ├── App.tsx               Top-level: <StudioLayout /> + global hotkeys + body[data-*] sync
│   ├── layouts/              Page-level grids
│   │   └── StudioLayout.tsx
│   ├── components/           UI components, organized by SCREEN REGION (not by feature)
│   │   ├── topbar/           Brand + Nav + ModeSwitch + UserMenu (all in Topbar.tsx)
│   │   ├── sidebar-left/     CellTypes + Organelles lists
│   │   ├── sidebar-right/    OrganelleDetails + BiologicalNotes + WhereItOccurs
│   │   ├── canvas-head/      Breadcrumb + <h1> + PipelineBadge (the PBR popover)
│   │   ├── stage/            The 3D area + ALL overlays (10 files)
│   │   ├── bottom/           MicroscopePanel + ComparePanel
│   │   └── ui/               Reusable primitives (Switch, Pill, Drawer, IconButton)
│   ├── 3d/                   R3F scene graph (CellScene, CellModel, ClippingHandle, …)
│   ├── data/                 PURE data: cells.ts · organelles.ts · tour.ts
│   ├── stores/               useAppStore.ts (Zustand)
│   ├── hooks/                Shared hooks (useKeyboard, useTour, useUrlState)
│   ├── lib/                  Pure helpers (export.ts, pbr.ts, persistence.ts)
│   ├── styles/               tokens.css → reset.css → globals.css (loaded in that order)
│   └── types/                Shared TypeScript types
```

Other `apps/*` packages (pnpm workspace — **not** part of the BioScope3D screen map above):

```
apps/lab-hub/              Vite + React landing; cards link to sibling dev servers / deploy URLs (`VITE_*`).
apps/stellar-expanse/      Separate ship-selector product (Vite + React scaffold). High-fidelity static ref: `design/v4-stellar-expanse/`. **Do not** merge its UI into `apps/bioscope3d` without an ADR.
```

Rules:
- Components live in folders by **screen region** (`topbar/`, `sidebar-left/`, …), not by feature (no `auth/`, no `profile/`). The UI is a single-page studio.
- Pure data goes in `data/`. **Never** inline cell metadata inside components.
- Scenes / 3D logic lives in `3d/`, **never** in `components/stage/`.
- A "stage overlay" (Post-it, View Mode panel, Tour bar, …) is a DOM sibling of the R3F `<Canvas>`, not a Three.js mesh.

---

## 5. State conventions

There is **one** store: `stores/useAppStore.ts`.

All UI toggles, selected cell, selected organelle, favorites, drawer open/closed — go through it.

```ts
const cell = useAppStore((s) => s.activeCell);  // ✓ subscribes to one slice
const all  = useAppStore();                      // ✗ rerenders on every change
```

`persist` middleware writes to `localStorage` under the key `bioscope3d:app-state` (schema v3). The `partialize` function controls what gets persisted (ephemeral UI like `pbrPopoverOpen` is excluded). When bumping the persisted shape, increment the version so old stored state is dropped cleanly.

If you need a second store, add `stores/useUiStore.ts` for purely ephemeral UI state. **Do not proliferate stores.**

---

## 6. CSS conventions

The v3.2 HTML's CSS was migrated **1:1** into `styles/globals.css`. **Selectors and class names match exactly**, so React components just pass class names verbatim:

```tsx
<div className="stage">     {/* DON'T rename to .studio-stage */}
<div className="callout-label">  {/* DON'T rename to .annotation */}
```

Rules:
- New classes use `lowercase-with-hyphens`, scoped within their region (`.stage-toolbar`, `.callout-label`).
- Tokens (`var(--olive-dk)`) — **always use, never hardcode hex**.
- A new color that looks like it belongs to a cell → add to `tokens.css` as `--cell-xxx`, never inline.
- Mode-driven visibility: prefer `body[data-mode="research"] .foo { … }` over conditional rendering.
- Cell-color-flow: rely on `--cell-current` cascading from `body[data-cell="…"]` — do not pass cell colors as React props.

When to refactor to CSS Modules: when a class collides with another region, or when scope leaks become observable. **Not before.**

---

## 7. How to add things — playbooks

### Add a new cell

1. `src/types/index.ts` → add the new id to the `CellId` literal union.
2. `src/data/cells.ts` → add a `CellMeta` entry to the `CELLS` map + push the id into `CELL_ORDER`.
3. `src/data/organelles.ts` → add an `ORGANELLES_BY_CELL[id]` entry (an array of `Organelle`).
4. `public/assets/cells/{id}.png` — drop a 192² circular watercolor thumbnail (generate via AI if needed).
5. `public/assets/scenes/hero_{id}.png` — drop a hero cross-section image (or fall back to plant for now).
6. `public/models/{id}.glb` — drop the source GLB (optional until v0.2).
7. `src/styles/tokens.css` → add `--cell-{id}: #RRGGBB;`.
8. Append a rule for `body[data-cell="{id}"] { --cell-current: var(--cell-{id}); }` (already in `tokens.css`).

That's it — the left sidebar list, breadcrumb, color flow, microscope variants, and compare panel auto-pick it up.

### Add a new organelle to an existing cell

Append an entry to that cell's array in `data/organelles.ts`. The left sidebar Organelles list and the right sidebar Organelle Details panel both render from this data.

### Add a new keyboard shortcut

Edit `hooks/useKeyboard.ts` → add a `useHotkeys` call. Document it in the cheatsheet (TODO: build cheatsheet UI in v0.3).

### Add a new feature flag

- `.env.example` → add `VITE_ENABLE_FOO=true`
- Read via `import.meta.env.VITE_ENABLE_FOO === "true"`
- Default flags **on**; flags exist to disable problematic features in production.

### Add a new export format

`components/stage/ExportDrawer.tsx::CATEGORIES` → push into the appropriate category. Wire the click handler to a function in `lib/export.ts` when actually implementing.

### Add a new Mode (please don't, but if you must)

Currently 3 modes: `Explore` / `Teach` / `Research`. A 4th is a smell — usually we should be gating with a setting, not a mode.

If unavoidable:
1. `types/index.ts` → extend the `Mode` literal.
2. `components/topbar/Topbar.tsx::MODES` → add the entry.
3. `globals.css` → add the `body[data-mode="…"]` visibility rules.

---

## 8. Decision history

Newest first. **When you make a decision that isn't here, add it.**

### 2026-05-16 · Tripo PBR speckle mitigation (B4–B3 + C1 + A1)
Short-term **B4+C1** in `pbr.ts` / `SceneEnvironment` / Tripo `<model-viewer>` exposure. Mid-term **B1–B2** and Research **B3** in `tripoDebug.ts` (`CellModel` when R3F is mounted). Read-only batch audit: `apps/bioscope3d/scripts/audit-tripo-gltf.mjs` (`pnpm -C apps/bioscope3d audit:gltf`). Tri-lingual roadmap: `docs/06-pbr-tripo-mitigation.md` (+ `.en.md`, `.ja.md`).

### 2026-05-14 · Canonical clone folder **`bioscope3d/`**
The workspace was historically checked out as **`3D2`** (early working title). Docs and tree diagrams now use **`bioscope3d/`** as the repo root label to match the **BioScope3D** product. Rename an existing local folder when convenient (`mv 3D2 bioscope3d` or re-clone); refresh hard-coded absolute paths in personal scripts or Python venvs. Root workspace `package.json::name` is **`bioscope3d-workspace`** so it stays distinct from the **`bioscope3d`** app package under `apps/`.

### 2026-05-14 · pnpm monorepo · multiple `apps/*`
The repo root is a **pnpm workspace** (`pnpm-workspace.yaml` + root `package.json`). `apps/bioscope3d` remains the BioScope3D deliverable. **`apps/lab-hub`** is a thin landing page (ports / URLs via env). **`apps/stellar-expanse`** is a **separate product scaffold** (ships — not cells). Each app keeps its own Vite config, dependencies, and build output under `apps/<name>/dist/`. Prefer **lazy or separate deploys** for unrelated 3D demos; the hub only links — it does not bundle every GLB stack into one JS entry unless we explicitly decide to.

**First-time migrate from npm-in-`bioscope3d` only:** delete `apps/bioscope3d/node_modules`, then run `pnpm install` at the repo root so pnpm can link the workspace cleanly.

### 2026-05-14 · GLB single source + **external** distribution + `pnpm sync:models`
Large `.glb` files are **not** in this Git repository (size + bandwidth). The maintainer distributes them separately (**Google Drive** for now); download into repo-root **`models/`** (gitignored), then run **`pnpm sync:models`**. **`scripts/sync-models.mjs`** mirrors the curated list into each app’s `public/models/` so Vite serves `/models/…`: **relative symlinks on macOS/Linux**, **`copyFile` on Windows**. Extend **`scripts/sync-models.mjs::ENTRIES`** when a new app or filename mapping is needed. Broader design / MP4 mirroring stays on the **`scripts/sync-assets.sh`** roadmap in §9.

### 2026-05-13 · Renamed product: "Cell Architecture Studio" → **BioScope3D**
The working title was the same as the user-supplied reference image's name. Once the product had its own identity (3 modes, layered UX, PBR pipeline), keeping the reference-image name caused confusion — was "Cell Architecture Studio" the inspiration or the deliverable?

Scope of the rename:
- App folder: `apps/cell-architecture-studio/` → `apps/bioscope3d/`
- `package.json::name`: `cell-architecture-studio` → `bioscope3d`
- HTML `<title>` + meta description
- Brand text in `Topbar.tsx`: `<em>Cell</em> Architecture Studio` → `<em>BioScope</em>3D`
- localStorage persistence key: `cas:app-state` → `bioscope3d:app-state` (schema bumped to v3; existing users lose persisted UI state on first load — acceptable pre-v1)
- Export-drawer watermark string
- LICENSE copyright holder
- README / AGENTS / CHANGELOG / app README — all updated

**Intentionally NOT renamed:**
- `design/v2/index.html` and `design/v3/index.html` — frozen prototypes; their `<title>Cell Architecture Studio</title>` is part of the design lineage record.
- Historical sentences in `docs/01-video-analysis.md`, `docs/02-design-gap.md`, `docs/05-open-questions.md` that refer to the user-provided reference image by its original name — those are factual statements about that source artifact, not statements about the product.

### 2026-05-13 · v0.2 · Hero `<img>` stays under the live Canvas
The Canvas is `alpha: true` and z-stacked above `.hero`. This means:
- During the GLB stream, the watercolor hero is the loading state — no flash-of-empty-stage.
- Cells without a GLB show only the hero — `CellScene` returns `null` when `cell.modelPath` is undefined.
- The vignette overlay sits **above** both, so the look stays cohesive.

Don't remove the hero `<img>` when wiring R3F for new cells; the layered approach is intentional.

### 2026-05-13 · v0.2 · PBR is lossless and store-driven
`enhancePBR(scene, on)` snapshots original values to `material.userData.__pbrOriginal` on first touch, so the "Re-bake" / "Original" pill toggles round-trip without re-loading the GLB. Same pattern is the template for any future material-mutating effect (e.g. emission boost, x-ray mode).

### 2026-05-13 · v0.2 · drei `<Environment preset>` despite CDN dependency
HDRI presets load HDR textures from drei's CDN. Acceptable for v0.2 because:
- Wrapped in `<Suspense fallback={null}>` so a blocked CDN doesn't break the scene — ambient + directional lights keep materials lit, just without IBL reflections.
- v0.3 will ship local `.hdr` files in `public/env_maps/` and switch to `<Environment files={...}>`.

### 2026-05-13 · Single global CSS file, not CSS Modules
We migrated v3.2's HTML/CSS verbatim. Splitting into per-component modules would require renaming every class. Decision: keep `globals.css` until a real collision or perf issue surfaces.

### 2026-05-13 · R3F 9, not R3F 8
R3F 8 has `peer react@>=18 <19`. `tech.md` locks React 19. Bumped R3F → 9, Drei → 10, Postprocessing → 3.

### 2026-05-13 · `body[data-*]` over React Context for cross-cutting state
The v3.2 static CSS uses `body[data-mode]` and `body[data-cell]`. `App.tsx` mirrors store state onto `body` attrs. This means **all the v3.2 CSS Just Works** without rewriting selectors into JS-driven className strings.

### 2026-05-13 · Static hero placeholder in Stage
`Stage.tsx` renders a static AI cross-section image, not a live R3F Canvas — until v0.2. This lets UI work and 3D work proceed in parallel without blocking each other. The replacement target is `src/3d/CellScene.tsx`.

### 2026-05-13 · 3 modes, layered (not 3 separate apps)
Initially proposed single-casting on K-12 students. User correction: serve all 3 audiences with **layered** UI in the same surface. Hence the Mode switcher gates HUD / Export / Measure visibility via CSS, not via routing.

### 2026-05-12 · "100% reproduction" reframed to "interactive app"
Original brief was "100% reproduce the video". User clarified: replicate **the app surrounding the 3D**, not just the render. This made R3F the priority over rendering / video pipelines.

### 2026-05-12 · Watercolor aesthetic, not sci-fi
Earlier explorations (AERIS, PIONEERS) used sci-fi HUDs. User-provided reference (`design/ref/cell_architecture_studio.png`) is hand-painted biology textbook. Aesthetic locked.

---

## 9. Asset locations

| Asset | Source of truth | Mirrored to |
|---|---|---|
| GLB models | Maintainer cloud (e.g. Google Drive) → local `/models/*.glb` (gitignored) | `apps/bioscope3d/public/models/` + `apps/stellar-expanse/public/models/` via `pnpm sync:models` |
| Cell thumbnails | `/design/v3/img/cells/*.png` | `apps/bioscope3d/public/assets/cells/` |
| Stage hero / scene images | `/design/v3/img/scenes/*.png` | `apps/bioscope3d/public/assets/scenes/` |
| Reference videos | `/data/*.mp4` | not mirrored — analysis source only |
| HDRI maps | (none yet) | `apps/bioscope3d/public/env_maps/` |

After changing `models/*.glb`, run **`pnpm sync:models`** from the repo root (see §8). Design / MP4 assets still mirror manually today; **v0.3+:** `scripts/sync-assets.sh` remains the plan for those.

---

## 10. What NOT to do

- **Don't bring in a UI library** (Material, Chakra, Mantine, shadcn). The v3.2 design is too specific. We hand-build.
- **Don't ship per-component CSS Modules** just because it's modern. `globals.css` is fine for now.
- **Don't replace the watercolor aesthetic** with a more "professional" look. The aesthetic IS the differentiator.
- **Don't introduce SSR** (Next.js, Remix). This is a pure client app — Vite static deploy.
- **Don't commit large `.glb` files into Git** (plain objects or LFS). Keep them on external storage (e.g. Google Drive); use local **`models/`** + **`pnpm sync:models`** only.
- **Don't add comments that narrate the code.** Code says _what_; comments say _why_.
- **Don't add Tailwind.** The design uses about 600 custom selectors — converting would be a regression.
- **Don't migrate from `<img>` placeholders to a half-working R3F Canvas.** Either land R3F properly (v0.2) or leave the placeholder.

---

## 11. PR / commit conventions

(Until a git workflow is formalized — this is reminder text.)

- **One feature per commit.** The whole Mode switcher was 1 commit. Don't bundle.
- **Subject:** `<area>: <imperative verb> <noun>`
  - ✓ `stage: add organelle callouts overlay`
  - ✓ `store: persist mode and active cell across refresh`
  - ✓ `data: add muscle cell organelles`
  - ✗ `WIP fixes` / `update some stuff`
- **Body:** explain WHY, not WHAT. The diff already shows what.

---

## 12. When you're stuck

1. **Open `design/v3/index.html`** in a browser. Does the static prototype show what you want? Then the spec is there — match it.
2. **Read `docs/03-features.md`** — the feature is probably listed (F01–F63).
3. **If a decision is missing**, make one and add it to "Decision history" (§ 8).
4. **Don't ask the user to choose** between A and B if A is clearly better. Pick A, explain in one line, move on.
5. **If a tool wouldn't work in the sandbox**, request `required_permissions: ["all"]` once you're sure it's needed.

---

## 13. File status convention

Placeholder files (like today's `3d/CellScene.tsx`) carry a top-of-file block:

```ts
/**
 * R3F scene wrapper — TODO v0.2
 *
 * This file is a placeholder. In v0.2 we will:
 *  - Mount <Canvas> with proper sRGB output
 *  - Load the active GLB via useGLTF
 *  - ...
 */
```

Keep this convention so the next agent doesn't wonder if the file is abandoned.

---

## 14. Onboarding for a fresh AI session

If you've just opened this repo with no prior context, in order:

1. **Read this file (AGENTS.md)** — you're here. Pay special attention to § 15 (documentation language convention) — this repo is tri-lingual and that's a hard rule, not a nice-to-have.
2. Open **`design/v3/index.html`** in a browser. Spend 60 seconds clicking around. That's the product.
3. Skim **`docs/03-features.md`** — list of 63 features and their priorities.
4. Skim **`docs/04-mvp-roadmap.md`** — what's planned and when.
5. Open **`apps/bioscope3d/src/App.tsx`** — that's the React entrypoint.
6. Skim **`apps/bioscope3d/src/stores/useAppStore.ts`** — that's the single source of truth for runtime state.

After those 6, you should be productive.

---

## 15. Documentation language convention

### 15.0 The three rules in one breath

This repository ships three languages: **English** / **简体中文** / **日本語**. There are three rules. Internalize them before you write a single line of documentation.

1. **Reply to the user in 中文 by default.** The primary maintainer works in Chinese. Planning text, status updates, end-of-task summaries — all in Chinese. Code identifiers, console logs, error messages, and code comments stay English (that's a code-style rule, not a localization rule). Switch languages only if the user explicitly asks.

2. **Author new documentation in English first.** English is the canonical language for **everything you create going forward**: write `foo.md` in English, then add `foo.zh.md` and `foo.ja.md` translations in the same commit. The Chinese and Japanese versions track the English original — that's the direction of truth. (One historical exception: `docs/0*-*.md` were originally written in Chinese; they stay Chinese-canonical because that's a fact about their authorship, not a regression to fix.)

3. **Touch one sibling → touch all three.** Translations must not drift. If you only have time to update one language, the change is not done yet. Same commit, all three files, or it doesn't ship.

Every multilingual file carries a banner near the top, with the active language **bolded** and the others linked:

```md
> 🌐 **English** · [简体中文](./README.zh.md) · [日本語](./README.ja.md)
```

### 15.1 Per-file canonical language (current state)

The default for new files going forward is **English-canonical** (Rule 2 above). The current map of what's already in the repo:

| File group | Canonical | Suffix translations |
|---|---|---|
| Root `README.md`, `AGENTS.md`, `CHANGELOG.md`, `LICENSE` | **English** | `*.zh.md`, `*.ja.md` |
| `apps/bioscope3d/README.md` | **English** | `README.zh.md`, `README.ja.md` |
| `tech.md` | **English** | `tech.zh.md`, `tech.ja.md` |
| `docs/*.md` | **简体中文** (historical — analysis-phase artifacts, authored in Chinese) | `*.en.md`, `*.ja.md` |

### 15.2 Tri-lingual file inventory (the canonical list)

These are **all** files that must move as a group of three. If you touch one, the other two are mandatory follow-ups in the same commit:

| Group | Files |
|---|---|
| Root README | `README.md` · `README.zh.md` · `README.ja.md` |
| Root AGENTS | `AGENTS.md` · `AGENTS.zh.md` · `AGENTS.ja.md` |
| Root CHANGELOG | `CHANGELOG.md` · `CHANGELOG.zh.md` · `CHANGELOG.ja.md` |
| Tech stack | `tech.md` · `tech.zh.md` · `tech.ja.md` |
| App README | `apps/bioscope3d/README.md` · `apps/bioscope3d/README.zh.md` · `apps/bioscope3d/README.ja.md` |
| App README · lab-hub | `apps/lab-hub/README.md` · `apps/lab-hub/README.zh.md` · `apps/lab-hub/README.ja.md` |
| App README · stellar-expanse | `apps/stellar-expanse/README.md` · `apps/stellar-expanse/README.zh.md` · `apps/stellar-expanse/README.ja.md` |
| Docs · README | `docs/README.md` · `docs/README.en.md` · `docs/README.ja.md` |
| Docs · video analysis | `docs/01-video-analysis.md` · `docs/01-video-analysis.en.md` · `docs/01-video-analysis.ja.md` |
| Docs · design gap | `docs/02-design-gap.md` · `docs/02-design-gap.en.md` · `docs/02-design-gap.ja.md` |
| Docs · features | `docs/03-features.md` · `docs/03-features.en.md` · `docs/03-features.ja.md` |
| Docs · MVP roadmap | `docs/04-mvp-roadmap.md` · `docs/04-mvp-roadmap.en.md` · `docs/04-mvp-roadmap.ja.md` |
| Docs · open questions | `docs/05-open-questions.md` · `docs/05-open-questions.en.md` · `docs/05-open-questions.ja.md` |
| Docs · PBR / Tripo mitigation | `docs/06-pbr-tripo-mitigation.md` · `docs/06-pbr-tripo-mitigation.en.md` · `docs/06-pbr-tripo-mitigation.ja.md` |

When you add a **new** multilingual file, also add it to this inventory in the same commit.

### 15.3 Pre-commit self-check (hard rule)

Before declaring a documentation task "done":

1. List the files you edited.
2. For each edited file that appears in § 15.2, **confirm the other two siblings were edited too**.
3. If you only edited one of three, the change is not done. Translate the diff into the other two languages now.
4. If a section is intentionally **only in one language** (work in progress, language-specific note), explicitly mark it `(EN-only)` / `(ZH-only)` / `(JA-only)` so the next agent doesn't read the absence as a drift.

If you catch yourself shipping one-language-only edits to a tri-lingual file, that's a regression, not a feature — fix it before moving on.

### 15.4 Don't

- Don't translate `LICENSE` (legal text must stay English).
- Don't translate historical docs `docs/0*-*.md` retroactively just to invert canonical — they were authored in Chinese, that's a fact, not a regression.
- Don't let translations drift. If a paragraph in `*.zh.md` no longer matches `*.md` content, that's a bug. Fix in the same commit you noticed it.
- Don't author a new top-level doc in Chinese or Japanese and "translate later". Per Rule 2, English first, three siblings in the same commit.

---

## 16. Acknowledgments

Source 3D models from [Tripo3D](https://www.tripo3d.ai/) and [Hunyuan3D](https://3d.hunyuan.tencent.com/).
AI-generated watercolor assets produced via Cursor agent + Imagen.
The reference design that drove v3.2 was a user-provided mockup originally titled "Cell Architecture Studio"; the product itself was renamed to BioScope3D on 2026-05-13 (see § 8).
