# Changelog

> 🌐 **English** · [简体中文](./CHANGELOG.zh.md) · [日本語](./CHANGELOG.ja.md)

All notable changes to this project are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versioning follows [SemVer](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- **Tripo / glTF PBR speckle mitigation (B4–B3, C1, A1)** — tri-lingual roadmap in `docs/06-pbr-tripo-mitigation.md`. Runtime: matte-friendly `enhancePBR`, capped IBL (`PBR_HDRI_ENVIRONMENT_INTENSITY` / `PBR_ENV_MAP_INTENSITY_CEILING`), `stabilizeTripoOrganicMaterial` + B2 roughness bias + Research `applySpecularAAMitigation` in `tripoDebug.ts` / `CellModel`. Live stage: Tripo `<model-viewer>` exposure follows mode and Re-bake pill via `modelViewerPbr.ts`. Read-only audit: `pnpm -C apps/bioscope3d audit:gltf` (`--all` scans `public/models`).
- **pnpm monorepo** — root `package.json` + `pnpm-workspace.yaml`; new `apps/lab-hub` (landing with env-driven links) and `apps/stellar-expanse` (ship product scaffold). Default dev ports: hub **5170**, BioScope3D **5173**, Stellar **5174**. BioScope3D `build` / `typecheck` / `lint` scripts use `pnpm exec` so `tsc` resolves under pnpm’s linker.

### Changed

- **Workspace identity** — root `package.json` `name` `3d2-monorepo` → **`bioscope3d-workspace`**; README + `tech.md` tree roots use **`bioscope3d/`** (rename a local **`3D2/`** checkout when convenient; refresh hard-coded paths in venvs or scripts).

### Fixed

- **Vite dev URLs on macOS** — all `apps/*/vite.config.ts` now set `root` to the config file’s directory (avoids bad `cwd` such as a stray `apps/lab-hub/#` folder triggering the “`#` character” warning and broken resolution), bind `server.host` to **`127.0.0.1`**, and open **`http://127.0.0.1:<port>/`** by default. Lab hub default env links use the same host so cards match the dev servers.
- **Stray `#` forwarded to Vite** — some runners paste `pnpm dev:hub # http://…` as literal extra argv, so Vite treated `#` as the `[root]` argument (`lab-hub/#`) and bound the wrong port. Each app’s `dev` / `preview` scripts now run `node ./scripts/run-vite-cli.mjs`, which spawns Vite without forwarding those tokens. README quick-start blocks put comments on their own lines above each command.

### Fixed (since v0.4.0)

- **Chaotic "spiky wire" / exploding mesh clustered at the cell center in Chrome.** Root cause — `CellModel` world-fit was algebraically broken: after `scene.position -= center` the code multiplied **`scene.position` by the fit scalar `k`** while also assigning `scene.scale = k`. The root translation that re-centres the centroid must **not** be scaled by `k`; only the mesh subtree should shrink. That bad composition corrupts world matrices into garbage coordinates (reads as shards / NaN spikes at the nucleus). Fix: **`source.clone(true)`** per mount so drei's cache is untouched; **detach** duplicated materials before toggling PBR; **two-pass `Box3`**: `position.sub(center)` → recompute → `scale.multiplyScalar(1 / radius)`; `<primitive dispose={null}>`. **`lib/pbr`** now gates materials with **`instanceof THREE.MeshStandardMaterial`** so Tripo's **`MeshPhysicalMaterial`** meshes get AO clipping + enhancement.

- **`CellModel` centroid “fuzz” persists after AO removed — SkinnedMesh / bogus bounding sphere.** Bind-pose `Box3.setFromObject` can miss skinned deformation, collapsing **`sphere.radius` → ~0** and exploding **`scene.scale`.** **`skeleton.pose()`** before fitting; **`Box3.setFromObject(scene, true)`** walks deformed verts; **`MathUtils.clamp(1/r, …)`** caps runaway scale.

- **`InstancedMesh` left out of the precise-fit box.** With `precise=true`, Three does not multiply each **`InstancedMesh`** instance matrix into the merged bounds, so some GLBs stay “tiny hull + far instances” — the same gigantic **`scale`** spike **without Bloom.** Added **`unionInstancedMeshWorldBounds`** twice (mirror the two `setFromObject` passes) so instances contribute to **`r`**.

- **Center sparkle / grain with Bloom OFF on Tripo megapoly meshes was often shadow acne, not normalization.** Dense surfaces self-project at low shadow-map resolution and read as “fuzz” around curved silhouettes. **`CellScene`** disables R3F **`shadows`** and the key **`directionalLight`** no longer **`castShadow`**; ambient + directional + HDRI **`Environment`** still reads dimensional.

- **`N8AO` removed from the default stack** — passes with `needsDepthTexture` make pmndrs `EffectComposer` allocate a stable depth target and `glBlitFramebuffer` the scene depth every frame after `RenderPass`. On Chrome + ANGLE that blit can still throw `GL_INVALID_OPERATION: Read and write depth stencil attachments cannot be the same image` even with **`multisampling={0}`**, leaving the framebuffer undefined. **`Bloom`** does not read depth, so that path is skipped. **F2** toggles Bloom only; see `PostFx.tsx` for notes on bringing AO back safely.

- **`@react-three/postprocessing`'s `<EffectComposer>` defaults `multisampling` to 8** unless overridden; internal MSRTT adds `glBlitFramebuffer` work some ANGLE builds mishandle. We keep **`multisampling={0}`** and **`stencilBuffer={false}`**. Main `<Canvas>` still uses `gl.antialias`.

### Added (diagnostic)

- **F2 hotkey** — toggles post-processing (Bloom) on/off at runtime.

### Planned for v0.5 — "Polish & data depth"

- Real µm scale bar driven by camera distance
- 2-point Measure ruler in Research mode
- Per-cell hero scenes (each cell currently shares the plant hero PNG)
- Quiz mode loop, Notebooks page

---

## [0.4.0] — 2026-05-13 — "Tier 1: tour, camera, cinema, screenshot"

### Added — Tier 1 features ([F02][F03][F05][F08][F12][F17][F18][F19][F23][F28][F60])

- **F05 Per-cell camera presets + F23 Reset (R)**: every cell now ships a `cameraPreset` (position + target + fov). `CameraRig` lerps to it on cell switch and on the R hotkey, and `CellModel` normalizes Tripo-exported GLBs to a unit sphere at the origin so presets are predictable across cells.
- **F02 / F03 / F12 / F17–19 / F60 Auto Tour**: data-driven `dwellSeconds` per cell (matched to the reference video segment timing). New `useTour()` RAF loop ticks an in-store clock that advances `tourIndex` automatically. `TourBar` rewritten with real controls — ◀ play/pause ⏸/▶ 7 dot segments (clickable to jump) ▶ exit — and a live `elapsed / dwell` timecode. Hotkeys: Space toggles tour, K play/pause, ←/→ prev/next, Esc exits.
- **F08 Cinema mode (F)**: `body.cinema` class hides every chrome (topbar, sidebars, toolbar, canvas head, bottom cards, post-it, view-mode panel, HUD corners, tour-bar) and lets the stage occupy the full viewport with the 3D canvas + hero. Esc exits.
- **F28 Real screenshot**: `Canvas gl={{ preserveDrawingBuffer: true }}` plus a `captureStage()` helper that calls `canvas.toBlob()` and triggers a `bioscope3d-{cellId}-{yyyyMMdd-HHmmss}.png` download. Wired to the Stage toolbar's camera button.

### Added — supporting plumbing

- `types/CameraPreset` and `CellMeta.dwellSeconds / cameraPreset` (now required fields)
- Zustand store: `tourIndex / tourElapsedMs / tourPlaying` + actions (`startTour / stopTour / toggleTourPlay / jumpTourTo / tickTour`), `cinema + toggleCinema`, `screenshotTick + requestScreenshot`
- `hooks/useTour.ts` RAF engine, mounted once in `App.tsx`
- `lib/screenshot.ts` utility (timestamped filename, alpha PNG, console fallback)
- `scripts/screenshot_v0.4.mjs` puppeteer driver that exercises every Tier-1 feature in headless Chrome (with swiftshader for WebGL) and captures proof screenshots

### Changed

- **`CellScene`** removed the drei `<Bounds>` wrapper because it fought the camera preset on every cell change. `CellModel` now does a one-time normalize (bounding-sphere → unit radius, centered at origin).
- **`StageToolbar`**: Reset wired to `resetCamera`, Screenshot wired to `captureStage`, new "Cinema" toggle button between Screenshot and Author Tour.
- **`useGlobalHotkeys`**: F now toggles Cinema (was a duplicate Reset). R remains Reset. Esc cascades: close export → exit cinema → exit tour.
- **i18n**: added `tour.{play,pause,prev,next,jumpToTitle,exit,timecode(fn)}`, `cinema.{enter,exit,hintEsc}`, `screenshot.{title,successAria,failure,notAvailable}`, plus `toolbar.cinema / cinemaOff` and matching `titles.*`. English / 简体中文 / 日本語 all updated.
- **CSS**: `.tour-bar` redone with control buttons (prev / play / next / exit), live progress fill, larger dot targets; new `body.cinema` ruleset hides every chrome element and stretches `.stage` to the full viewport.
- **Persistence**: schema bumped to **v5** to accommodate the new tour/cinema fields (existing sessions reset on first load).

### Files

- `apps/bioscope3d/src/types/index.ts`
- `apps/bioscope3d/src/data/cells.ts`
- `apps/bioscope3d/src/stores/useAppStore.ts`
- `apps/bioscope3d/src/hooks/useTour.ts` (new)
- `apps/bioscope3d/src/hooks/useKeyboard.ts`
- `apps/bioscope3d/src/3d/CameraRig.tsx`
- `apps/bioscope3d/src/3d/CellModel.tsx`
- `apps/bioscope3d/src/3d/CellScene.tsx`
- `apps/bioscope3d/src/lib/screenshot.ts` (new)
- `apps/bioscope3d/src/components/stage/TourBar.tsx`
- `apps/bioscope3d/src/components/stage/StageToolbar.tsx`
- `apps/bioscope3d/src/App.tsx`
- `apps/bioscope3d/src/i18n/types.ts`
- `apps/bioscope3d/src/i18n/locales/{en,zh,ja}.ts`
- `apps/bioscope3d/src/styles/globals.css`
- `apps/bioscope3d/scripts/screenshot_v0.4.mjs` (new)

---

## [0.2.1] — 2026-05-13 — "Renamed to BioScope3D"

### Changed
- **Product name**: `Cell Architecture Studio` → **`BioScope3D`**
- **App folder**: `apps/cell-architecture-studio/` → `apps/bioscope3d/`
- `package.json::name`, `package.json::description`
- HTML `<title>` + meta description
- `Topbar.tsx` brand: `<em>Cell</em> Architecture Studio` → `<em>BioScope</em>3D` (tagline preserved)
- Export drawer watermark option text
- localStorage key: `cas:app-state` → `bioscope3d:app-state` (persistence schema bumped to v3; existing sessions reset on first load)
- LICENSE copyright holder
- README (root + app), AGENTS.md, all forward-looking docs

### Preserved (intentionally)
- `design/v2/index.html`, `design/v3/index.html` — frozen prototypes keep their original `<title>` as a design-lineage record
- Historical references to "Cell Architecture Studio" in `docs/01-video-analysis.md`, `docs/02-design-gap.md`, `docs/05-open-questions.md` — those describe the user-supplied reference image, which actually was titled that way
- Repo top-level folder name `3D2` — preserved to avoid breaking absolute paths in local clones

See `AGENTS.md` § 8 for the rationale.

---
- Draggable cross-section plane with a 3D handle gizmo
- Real µm scale bar driven by camera distance (currently a static figure)
- Measure tool (Research mode) with 2-point world-space ruler
- Quiz mode: 12 multiple-choice questions per cell
- Author Tour: teacher records 5-step waypoint sequence
- Per-organelle camera focus on `F` key (currently same as `R`)
- Local HDRI files in `public/env_maps/` so PBR works fully offline

---

## [0.2.0] — 2026-05-13 — "3D is real"

> **Milestone: live PBR rendering.** The Stage is now an actual R3F Canvas
> rendering the active GLB with HDRI lighting, post-processing, and the v3.2
> hand-painted hero image preserved as a backdrop / fallback.

### Added
- **`src/3d/CellScene.tsx`** — R3F `<Canvas>` root: ACES Filmic tone mapping, sRGB output, local clipping enabled, alpha-transparent so the watercolor hero shows through during load and for cells without a GLB.
- **`src/3d/CellModel.tsx`** — `useGLTF` loader that auto-applies the PBR pass, casts and receives shadows, and reacts to the cross-section toggle via a world-space clipping plane.
- **`src/3d/SceneEnvironment.tsx`** — drei `<Environment>` with three HDRI presets:
  - `studio` (clean neutral whitebox) — default
  - `lab` (warehouse / cool clinical)
  - `sunset` (warm cinematic)
  - Wrapped in `<Suspense>` so an offline / CDN-blocked session falls back gracefully to the directional + ambient lights instead of breaking the scene.
- **`src/3d/PostFx.tsx`** — N8AO (16 samples) + gentle Bloom; gated by `store.postFxEnabled` so low-end machines can degrade.
- **`src/3d/CameraRig.tsx`** — `OrbitControls` with damping, no panning, zoom range clamp, and store-driven `autoRotate` + one-shot `cameraResetTick` consumption.
- **`src/lib/pbr.ts`** — `enhancePBR(scene, on)` and `setClippingPlane(scene, plane | null)`. Lossless toggle: original PBR values are snapshotted to `material.userData.__pbrOriginal` on first touch, so "Re-bake" ↔ "Original" is a pure round-trip.
- **`useGLTF.preload(...)`** for all known GLBs at module load, so cell switches feel instant after the first session warm-up.

### Store (`useAppStore.ts` schema v2)
- `hdriPreset: "studio" | "lab" | "sunset"` (persisted)
- `autoRotate: boolean` (persisted, default `true`)
- `pbrEnhanced: boolean` (persisted, default `true`)
- `postFxEnabled: boolean` (persisted, default `true`)
- `cameraResetTick: number` (ephemeral; incremented to trigger a camera reset)
- Actions: `setHdriPreset` · `toggleAutoRotate` · `togglePbrEnhanced` · `togglePostFx` · `resetCamera`

### Hotkeys
- `F1` — toggle idle auto-rotate
- `R` — reset camera to default rig
- `F` — focus current selection (v0.2: same as R; v0.3 frames the active organelle)

### Stage CSS
- Layered z-index: `.hero` (z 1) → `.cell-scene` (z 2) → `.vignette` (z 3) → callouts / overlays (z 4+).
- Canvas inherits stage rounding via `overflow: hidden` on `.stage`.

### Verified
- `npm run typecheck` — passes
- `npm run build` — passes (52 kB app + 715 kB R3F chunk + 689 kB three.js chunk, all gzip-compressed)
- `npm run dev` + headless screenshot — confirms the Tripo plant-cell GLB renders live with HDRI reflections, casts shadows, auto-rotates, and that callouts / Post-it / ViewMode / StageToolbar / Microscope / Compare all still work on top of the live Canvas

### Known v0.2 limitations (tracked for v0.3)
- HDRI presets fetch from drei's CDN; offline sessions fall back to ambient + directional only.
- Only `plant` and `animal` cells ship a GLB. The other 5 cells keep the watercolor hero as their primary visual until per-cell models exist.
- The "Re-bake" / "Original" pill in the PBR popover is wired through the store but the popover UI itself still uses the v0.1 buttons — the live toggle works via the store action.
- `F` (focus) currently re-runs `resetCamera`; proper organelle-targeted framing requires world-space anchor positions, slated for v0.3.

---

## [0.1.0] — 2026-05-13

> **Milestone: scaffold + pixel-perfect UI.** No live 3D yet — Stage shows an AI-generated cross-section image. All interactivity, layout, mode-switching, and asset pipelines are real and working.

### Added
- Cleaned project root (3.9 GB → 1.3 GB) — removed all analysis intermediates and old reproduction artifacts.
- Scaffolded `apps/bioscope3d/` (then named `cell-architecture-studio` — see [0.2.1]) with **React 19 + Vite 6 + TypeScript 5**.
- React Three Fiber 9 + Drei 10 + Postprocessing 3 (3D layer wired but placeholder until v0.2).
- Zustand 5 with `persist` middleware — auto-save `mode` / `activeCell` / `favorites` / `viewMode` flags to `localStorage`.
- Global hotkeys via `react-hotkeys-hook`:
  - `1`–`7` — switch cell type
  - `L` — toggle labels
  - `X` — toggle cross-section
  - `Space` — toggle auto-tour
  - `E` — open Export drawer
  - `Esc` — close any open drawer / popover
- Migrated `design/v3/index.html` (v3.2 static prototype) **1:1** into 28 React components:
  - **topbar/** — Brand · Nav (5 tabs incl. Quiz · NEW dot) · ModeSwitch (Explore / Teach / Research) · UserMenu
  - **sidebar-left/** — Cell Types (7 entries) · Organelles (per-cell list, active chevron indicator)
  - **sidebar-right/** — Organelle Details · Biological Notes · Where It Occurs (AI-generated landscape)
  - **canvas-head/** — Breadcrumb · `<h1>` title · PipelineBadge ("PBR Enhanced" popover with Re-bake / Original)
  - **stage/** — Hero · Callouts (6 SVG leader lines with Caveat labels) · Post-it · ViewMode panel (4 toggles incl. Labels switch) · 4 HUD specimen-tag corners · µm Scale bar · Tour bar · Export drawer (4 categories, 16 options) · StageToolbar (Measure / Author Tour / 3D Export)
  - **bottom/** — Microscope View (3 magnifications) · Compare Cells (with circular swap button + diff hint)
- 9 AI-generated watercolor assets — 7 cell thumbnails + 1 stage hero + 1 "WHERE IT OCCURS" landscape, all in `/public/assets/`.
- Mode-driven UI via `body[data-mode="…"]`:
  - **Research** reveals HUD corners · µm scale bar · Measure button · full Export drawer
  - **Teach** reveals Author Tour button · larger hit-targets · dims HUD opacity
  - **Explore** hides precision controls, keeps everything friendly
- Cell-color flow via `body[data-cell="…"]` → `--cell-current` cascading to pills, switch toggles, dots, borders.
- Data layer: 7 cells × per-cell organelles with callout coordinates baked in.
- TypeScript build pipeline: `tsc -b` with `composite: true` on `tsconfig.node.json`, `strict: true` throughout, zero `any`.
- Vite path aliases: `@/`, `@components/`, `@data/`, `@stores/`, `@hooks/`, `@lib/`, `@3d/`, `@styles/`, `@types/`.
- Manual chunk splitting in `vite.config.ts` to keep R3F + Drei + postprocessing in a separate cacheable bundle.

### Documentation
- Root: `README.md` · `AGENTS.md` · `LICENSE` (MIT) · `.editorconfig` · `.gitignore` · `CHANGELOG.md`
- App-level: `apps/bioscope3d/README.md`
- Analysis: `docs/01-video-analysis.md` (7-segment auto-tour structure) · `docs/02-design-gap.md` (v1 → v2 → ref comparisons) · `docs/03-features.md` (63 features F01–F63) · `docs/04-mvp-roadmap.md` (v0 → v1.0 plan) · `docs/05-open-questions.md` (decision log)

### Verified
- `npm install` — clean install, 0 vulnerabilities at peer-resolution time
- `npm run typecheck` — passes
- `npm run build` — production bundle generated
- `npm run dev` — serves on `http://localhost:5173`, screenshot matches v3.2 static prototype

---

## [0.0.x] — Pre-scaffold research phase

Not formally released — kept here for traceability.

### Did
- Downloaded GLB models from Hunyuan3D (`20260512200414_6dc31f15.glb`, ~82 MB) and Tripo3D (`tripo-plant-cell-test.glb`, ~85 MB).
- Reproduced original Hunyuan render in `<model-viewer>` (R2 path). SSIM ~0.78 against source video.
- Diagnosed GLB quality issues: flat normal map, missing AO, uniform roughness — informed the PBR enhancement plan for v0.2.
- Iterated on static design prototypes v0 → v1 → v2 → v3 → v3.1 → **v3.2** (final).
- Established 3-audience product strategy (Explore / Teach / Research) after user feedback.

### Discarded
- `apps/aeris/` — early sci-fi-themed React scaffold that didn't match the watercolor aesthetic. Deleted.
- Python-based rendering pipeline (pyrender / VTK) — superseded by `<model-viewer>` then R3F.
- "100% video reproduction" interpretation — reframed to "interactive app" per user clarification.
