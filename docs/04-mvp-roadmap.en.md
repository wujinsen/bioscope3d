# 04 · MVP Roadmap

> 🌐 **English** · [简体中文](./04-mvp-roadmap.md) · [日本語](./04-mvp-roadmap.ja.md)

## Roadmap overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  MVP v0     │    │  MVP v1     │    │  MVP v2     │    │  MVP v3     │
│  Static     │ →  │  Core loop  │ →  │  Full UX    │ →  │  Advanced   │
│  ~1 day     │    │  ~3–4 days  │    │  ~3–4 days  │    │  ~5+ days   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## MVP v0 — static design v2 (current stage)

> **Goal**: reproduce every visual / interaction anchor from the reference image as static HTML — for review and tone-locking. No real 3D, no R3F yet.

**Includes**:
- Top bar: Logo + brand + tagline + 4 tabs + avatar
- Left bar: CELL TYPES (7 items with thumbnails) + ORGANELLES (collapsible)
- Center: title + Post-it hint + 3D canvas (video clip as placeholder) + toolbar
- Mid-bottom: MICROSCOPE VIEW + COMPARE CELLS cards
- Right bar: ORGANELLE DETAILS + BIOLOGICAL NOTES + WHERE IT OCCURS

**Output**: `design/v2/index.html` (browser-reviewable)

**Acceptance**:
- ✅ Pixel-diff against the reference `docs/img/reference_studio.png` at 1024×640 viewport
- ✅ 100 % field-level coverage (all 11 fixes in [02-design-gap.md](./02-design-gap.md) checked)

---

## MVP v1 — core loop (13 P0 features)

> **Goal**: complete the full main flow — open → see a cell → switch to another → start auto-tour → screenshot. Rendering reaches Tripo video quality.

| Feature | Notes |
|---|---|
| F01 Multi-cell library (7) | Data + GLB asset preparation |
| F02 Auto Tour | Camera state machine |
| F03 Per-cell duration | Config file |
| F04 Hard-cut transitions | useEffect swap GLB |
| F05 Per-cell camera preset | `{ theta, phi, radius, target, fov }` |
| F06 Top-tier PBR rendering | R3F + Drei `<Environment>` + `@react-three/postprocessing` (N8AO + Bloom + ToneMapping) |
| F07 Static display / slow self-rotation | `useFrame` adds 0.001 rad/frame |
| F08 Cinema mode | F key fullscreen / Esc to exit |
| F09 Left-bar selection | onClick → setCellId |
| F10 OrbitControls | `<OrbitControls enableDamping />` |
| F11 Mode toggle | `<motion>` to hide chrome |
| F12 Pause / jump / progress | State + Slider |
| F15 Thumbnails | Pre-run `ffmpeg -ss <t> -frames:v 1` to generate 7 thumbs |
| F17/F18 Playback controls | ◀ ⏸ ▶ |
| F19 Time axis | `<Progress />` |
| F23 Reset camera | `controls.reset()` |
| F28 Screenshot | `renderer.domElement.toBlob` |
| F31/F32/F34 Metadata | `data/cells.json` |
| F46 Keyboard shortcuts | useHotkeys |

**Stack** (aligned with tech.md):
```
React 19 + Vite + TypeScript
@react-three/fiber + @react-three/drei
@react-three/postprocessing
framer-motion         (UI motion)
lucide-react          (icons)
zustand               (lightweight state)
react-hotkeys-hook    (shortcuts)
```

**Asset prep**:
- 7 cell GLBs (plant + epithelial on hand; others: procedural / placeholder for now)
- 1 HDRI (Tripo-style cream gradient)
- 7 thumbnails (one frame extracted from each segment of the video)

**Done definition**:
- Browser opens → defaults to Studio mode
- Click a cell in the left bar → center swaps model + camera preset
- Press Space → enters Auto Tour, auto-switches at 4.5–7 s rhythm
- Press F → enters Cinema mode (chrome gone, only 3D)
- Screenshot button exports a PNG
- Render quality vs Tripo video: SSIM ≥ 0.7 (100×100 patch test)

---

## MVP v2 — full UX (P1 added)

### Reference-image features (13 items)

| Added | Notes |
|---|---|
| F13 Adjustable duration | Settings panel slider |
| F14 HDRI swap | 3 presets (cream / dark purple / cool grey) |
| F16 PBR enhancement pipeline | Standalone Python script `enhance_glb.py`, run offline once |
| F24 3-tier View Mode | Solid / Cross-Section / Exploded |
| F25 Cross-Section | Clipping plane shader |
| F29 Record 30s MP4 | Puppeteer + ffmpeg backend |
| F36 Where it Occurs | Static context image + optional video clip |
| F37 Microscope View | 4 real images from NIH / Cell Image Library |
| F38 Compare Cells | Dual canvas with synced controls |
| F43 Notebooks | localStorage save viewport + text (merged with F62) |
| F49 PBR enhance toggle | Switch baseGlb / enhancedGlb |
| F50 Quality tier | Auto-detect GPU → low / mid / high |
| F52 EN/ZH | i18next |

### v1-translation new features (7 P1)

| Added | Notes |
|---|---|
| **F54 Specimen Card academic HUD** | 4-corner overlay; screenshots embed the data |
| **F55 Curator Attribution** | Per cell: source / contributor / citation format |
| **F56 Mastery Progress** | Browsed / annotated / quiz-passed counter |
| **F57 Pipeline Status Indicator** | Raw → Baking → Enhanced → Compare status pulse |
| **F58 Taxonomy Breadcrumb** | Domain · Kingdom · Cell type, 3 levels |
| **F60 Tour Progress Bar** | `Cell 3 of 7 · 0:14 / 0:42` drag-to-jump (merged with F19) |
| **F62 Field Notes user annotations** | Description area becomes a writable notebook |

**Done definition**:
- Every visible UI element in the reference image has real behavior (not placeholder)
- Visual elements I liked in v1 (HUD / pulse / academic feel) have been re-translated into scientific F54–F60
- All 7 cells visibly improve after the PBR enhancement pass
- The 30 s tour can be exported as MP4 nearly indistinguishable from the original Tripo video

---

## MVP v3 — advanced capabilities (remaining P2/P3)

### Original P2 / P3

| Added | Notes |
|---|---|
| F26 Isolate / F27 Hide Others | Depends on F35 |
| F33 hover highlight | Depends on F35 |
| F35 **Automatic organelle isolation** | Color clustering + geometric islands + UV partitioning |
| F44 Guided Tour | Narration script + auto camera flight |
| F45 Quiz Mode | Educational value-add |
| F47 Drag-and-drop upload | drop-zone + live enhancement |
| F48 Tripo / Hunyuan API | Real API integration (needs key) |
| F53 Export PDF anatomical sheet | jsPDF + annotation compositing |

### v1-translation P2 (3 items)

| Added | Notes |
|---|---|
| **F59 Render Budget Meter** | FPS / triangles / GPU utilization live readout |
| **F61 Model Quality Grade** | A/B/C/D grading (normal SNR / UV use / face count / texture) |
| **F63 Onboarding Sequence** | 5-step first-open walkthrough |

---

## Time estimates (one full-time developer)

| Stage | Effort | Key risk |
|---|---|---|
| v0 static v2 | 0.5–1 day | None |
| **v1 core loop** | **3–4 days** | F06 render tuning / F05 camera preset polish |
| v2 full UX | 3–4 days | F35 not in scope but referenced — needs coordination |
| v3 advanced | 5+ days | F35 algorithm may iterate |
| **Total** | **12–14 days** | F35 is the biggest uncertainty |

---

## Deliverables per stage

| Stage | Deliverable | Acceptance |
|---|---|---|
| v0 | `design/v2/index.html` | Browser-side comparison against the reference |
| v1 | `apps/cell-studio/` core flow runs | Demo screen recording |
| v2 | 1:1 reproduction of the Tripo video + complete UI | Pixel diff + field coverage |
| v3 | Organelle interactions + AI generation + notebooks | Complete product demo |
