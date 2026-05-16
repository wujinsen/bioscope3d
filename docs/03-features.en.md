# 03 · Feature List F01 – F53

> 🌐 **English** · [简体中文](./03-features.md) · [日本語](./03-features.ja.md)

> Three buckets: **A** directly evidenced by the video / **B** indirectly implied / **C** UX completeness
> Each entry carries: evidence trail, priority, technical difficulty, key dependencies

---

## A. Features directly evidenced by the video (P0 — must)

| ID | Feature | Evidence | Difficulty |
|---|---|---|---|
| **F01** | **Multi-cell library (≥ 7)** | 7 cut segments, each with distinct dominant color / bounding box | 🟢 data-driven |
| **F02** | **Auto Tour** | The full video is a chronological continuous showcase | 🟡 camera state machine |
| **F03** | **Per-cell dwell duration**: 4.5 / 5.5 / 4.5 / 6.0 / 7.0 / 5.0 / 7.0 s | Segment lengths vary (see [01-video-analysis.md](./01-video-analysis.md)) | 🟢 config-driven |
| **F04** | **Hard-cut transitions** | Cuts complete within 1 frame | 🟢 React state |
| **F05** | **Per-cell camera preset** (distance / target / orientation) | Seg 3 takes 10 % of screen, others 16–23 % | 🟡 keyframe definitions |
| **F06** | **Top-tier PBR + HDRI rendering** (Tripo-style) | Overall material / shadow / light feel | 🔴 R3F + N8AO + Bloom |
| **F07** | **Static display / very slow self-rotation** (no dramatic spinning) | Intra-segment cx/cy drift < 0.05 | 🟢 0.1 rpm orbit |
| **F08** | **Cinema mode** (UI-free fullscreen) | The whole video has no UI | 🟢 chrome hidden toggle |

---

## B. Features indirectly implied by the video (P1 — should)

| ID | Feature | Inference | Difficulty |
|---|---|---|---|
| **F09** | Manual cell selection (click in the left bar) | If auto-tour exists, manual must too | 🟢 |
| **F10** | Drag to rotate / scroll to zoom / right-click pan | Standard expectation for any 3D viewer | 🟢 OrbitControls |
| **F11** | Cinema ↔ Studio mode toggle | The video is Cinema, the reference is Studio | 🟢 |
| **F12** | Tour can pause / jump to cell / progress bar | UX must-have | 🟢 |
| **F13** | Per-cell dwell duration adjustable (4–10 s) | Unequal lengths imply configurability | 🟢 settings |
| **F14** | HDRI / background swap | Video is uniform cream — product should offer choices | 🟡 environment map |
| **F15** | Per-cell thumbnail (from segment opening frame) | Left bar needs imagery | 🟢 ffmpeg script |
| **F16** | **PBR enhancement (bake AO / lift roughness / boost normal)** | Video material is visibly better than the bare GLB | 🔴 trimesh raycast |

---

## C. UX completeness (P1 / P2 — not in video but a product needs them)

### C.1 Tour controls

| ID | Feature | Priority |
|---|---|---|
| F17 | Play / Pause / Restart | P1 |
| F18 | Prev / Next cell (◀ ▶ + keyboard ← →) | P1 |
| F19 | Time axis (current cell / total X + remaining seconds) | P1 |
| F20 | Tour speed 0.5× / 1× / 2× | P2 |
| F21 | Loop / once mode | P2 |
| F22 | Shot path: static / slow self-rotation / Tripo-style three-shot | P2 |

### C.2 Camera & rendering

| ID | Feature | Priority |
|---|---|---|
| F23 | Reset camera (back to the cell's preset view) | P0 |
| F24 | **3-tier View Mode**: solid / cross-section / exploded (reference has these) | P1 |
| F25 | Cross-Section slicing (slider drag) | P2 |
| F26 | Isolate (show only selected organelle) | P2 |
| F27 | Hide Others (hide non-selected organelles) | P2 |
| F28 | Screenshot one-click | P0 |
| F29 | Record a 30 s MP4 tour (generate a same-style video) | P1 |
| F30 | 3D Export (GLB / OBJ) | P2 |

### C.3 Information layer

| ID | Feature | Priority |
|---|---|---|
| F31 | Per-cell metadata: scientific name / nickname / type / size / habitat / function | P0 |
| F32 | Organelle list + count | P0 |
| F33 | **Organelle hover/click highlight** (click 3D nucleus → right panel shows nucleus info) | P1 (depends on F35) |
| F34 | Textbook paragraph + Fun Fact | P0 |
| F35 | **Automatic organelle isolation pipeline** (color clustering + geometry islands) | 🔴 P1 but hard |
| F36 | Where it Occurs context image / video | P1 |
| F37 | Real microscope comparison (LM / stained / EM, pulled from NIH) | P1 |

### C.4 Browse & compare

| ID | Feature | Priority |
|---|---|---|
| F38 | Compare Cells (two cells side by side, synced orbit) | P1 |
| F39 | Gallery (image-album style browsing) | P1 |
| F40 | Library (reference materials / literature links) | P2 |
| F41 | Search + filter (by type / size / kingdom) | P2 |
| F42 | Favorite / heart | P2 |

### C.5 Teaching / notes

| ID | Feature | Priority |
|---|---|---|
| F43 | Notebooks (save current viewport + personal notes) | P1 |
| F44 | Guided Tour (narrated tour) | P2 |
| F45 | Quiz Mode (hide labels, user clicks) | P3 |
| F46 | Keyboard shortcuts (Space / R / I / 1-9) | P1 |

### C.6 Asset management

| ID | Feature | Priority |
|---|---|---|
| F47 | Drag-and-drop upload any GLB into the viewer | P1 |
| F48 | Tripo / Hunyuan API integration to generate new cells (mentioned in tech.md) | P2 |
| F49 | Per-GLB PBR-enhancement toggle | P1 |

### C.7 Preferences / settings

| ID | Feature | Priority |
|---|---|---|
| F50 | Quality tier (low-end GPU disables SSAO / Bloom) | P1 |
| F51 | Dark / light theme | P2 |
| F52 | EN/ZH language toggle | P1 |
| F53 | Export / share (link / PDF anatomical sheet) | P2 |

---

## D. New features born from v1 elements (P1 / P2)

> The v1 static mockup used the wrong context, but some of its components / states / modes **become genuinely product-valuable once the RPG filter is stripped off**. The 10 features below are **translations** of v1 residue into proper features.

| ID | Feature | v1 origin | Value | Priority |
|---|---|---|---|---|
| **F54** | **Specimen Card academic HUD**: one-click toggle for 4-corner science overlays (Specimen ID / Scale bar / Magnification / Stain / Render mode); screenshots embed this data | v1 4-corner HUD | Classroom prep / academic posters use this directly | P1 |
| **F55** | **Curator Attribution**: each cell carries its source (Tripo / Hunyuan / NIH / user), contributor avatar, citation format (APA/MLA) | v1 Velmora character block | Academic trust / clear licensing | P1 |
| **F56** | **Mastery / Library Progress**: visualize the user's cumulative browsed / annotated / quiz-passed cell count ("mastered 14 / 48") | v1 "Expedition Log 14/48" | Education retention hook | P1 |
| **F57** | **Pipeline Status Indicator**: pulse dot showing current model processing state: `Raw GLB → AO Baking → Enhanced → Compare Ready` | v1 SCAN ACTIVE pulse | Technical transparency | P1 |
| **F58** | **Scientific Taxonomy Breadcrumb**: 3-level breadcrumb (Domain · Kingdom · Cell type); click any level to jump to all cells in that taxon | v1 "PLANTAE · CHLOROPHYTA · MAGNOLIOPSIDA" | Educational navigation | P1 |
| **F59** | **Render Budget Meter**: live readout of current FPS / triangles / GPU usage, so users see the cost of their quality tier | v1 "Lv 28 · 5,420/8,000 KE" | Performance transparency | P2 |
| **F60** | **Tour Progress Bar**: during tour show `Cell 3 of 7 · 0:14 / 0:42` + drag to jump segment (merges F19) | v1 bottom-bar progress | Tour precision control | P1 |
| **F61** | **Model Quality Grade**: each GLB auto-graded A/B/C/D (based on normal-map SNR, UV utilization, face count, texture resolution) | v1 "Lv 14" stamp | Data transparency | P2 |
| **F62** | **Field Notes user annotations**: write notes in the description area → saved to Notebooks (merges F43) | v1 "Field Notes" card | UGC / learning retention | P1 |
| **F63** | **Onboarding Sequence**: first-open 5-step walkthrough (left bar → mouse drag → cross-section → right bar → tour) | v1 Post-it hint (wrong location) | New-user friendly | P2 |

### F58 detailed spec

```
3 levels (default display):  Domain · Kingdom · Cell type
  Plant Cell:       Eukarya · Plantae   · Plant Cell
  Bacterium:        Bacteria · —         · Bacterium
  Neuron:           Eukarya · Animalia  · Neuron
  Red Blood Cell:   Eukarya · Animalia  · Erythrocyte
```

Future-proofed to 8 levels (Domain · Kingdom · Phylum · Class · Order · Family · Genus · Species); levels not reaching that depth render as "—".

### F57 detailed spec

```
Status dot color:
  Grey   · Raw GLB         (just loaded, no processing)
  Yellow · AO Baking        (PBR pipeline is baking)
  Green  · PBR Enhanced     (baking done, rendering enhanced version)
  Cyan   · Compare Ready    (diff mode: raw left / enhanced right)
Pulse rate is tied to render load; faster = closer to real-time.
```

---

## Difficulty legend

- 🟢 Direct frontend config / standard React components
- 🟡 Involves Three.js / shader / state machine, moderate customization
- 🔴 Algorithm / post-processing pipeline / data preprocessing, dedicated design needed

## Dependencies (key)

```
F35 (organelle isolation) ─┬──→ F26 Isolate
                           ├──→ F27 Hide Others
                           ├──→ F33 hover/click highlight
                           └──→ F25 Cross-Section (slice to specific organelle)

F16 (PBR enhancement)      ─┬──→ F06 top-tier rendering (closer to Tripo video after enhancement)
                           └──→ F49 toggle

F02 (auto tour)            ─┬──→ F03 duration config
                           ├──→ F05 camera preset
                           ├──→ F12/F17/F18/F19 controls
                           └──→ F22 path

F31 (metadata)             ─┬──→ F32 organelles
                           ├──→ F34 notes
                           └──→ F36 Where it Occurs
```

## Implementation strategy

- **First ship P0 + the P1s that don't depend on F35** → forms MVP v1 (~ 60 % of features)
- **F35 (organelle isolation) is a standalone pipeline experiment**; once validated, integrate → MVP v2
- **F48 (AI API)** stays mocked for now, real API later — does not block the main path
- **F54–F63 v1-translation features** → all P1s into v2, all P2s into v3

## Total feature count

**63 features** (F01–F53 + F54–F63), by priority:

| Priority | Count | Note |
|---|---|---|
| P0 | 13 | Must implement, no exceptions |
| P1 | 27 | Should implement, spread across v1/v2 |
| P2 | 18 | Optional, v3 or later |
| P3 | 5 | Long-term, not considered yet |
