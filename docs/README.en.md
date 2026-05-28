# BioScope3D — Design & Product Analysis Docs

> 🌐 **English** · [简体中文](./README.md) · [日本語](./README.ja.md)

> Purpose: before writing any frontend code, capture all **video evidence, reference designs, feature decomposition, and technical decisions** in writing — so they can be reviewed, traced, and iterated on.
>
> *These docs are pre-code product analysis. Where you see "Cell Architecture Studio" in the body text below, it refers to the original filename of the user-supplied reference image (a historical fact), not the current product name. The current product name is **BioScope3D** — see `../AGENTS.md` § 8 for the renaming decision.*

## Index

| Document | Contents | Status |
|---|---|---|
| [01-video-analysis.md](./01-video-analysis.md) | Segment-by-segment breakdown of `pW1N8Cz6sTwINRnK.mp4` (41.8 s) + palette + shot table | ✅ |
| [02-design-gap.md](./02-design-gap.md) | Reference image `Cell Architecture Studio` vs my v1 static mockup, field-level diffs | ✅ |
| [03-features.md](./03-features.md) | Full feature list F01–F53 + F54–F63, with evidence, priority, technical difficulty | ✅ |
| [04-mvp-roadmap.md](./04-mvp-roadmap.md) | MVP v1 / v2 / v3 staged roadmap | ✅ |
| [05-open-questions.md](./05-open-questions.md) | Open decisions **(all closed 2026-05-13)** | ✅ |
| [06-pbr-tripo-mitigation.md](./06-pbr-tripo-mitigation.md) | Tripo / glTF PBR speckle mitigation roadmap (B1–B4 · C1 · A1/A2) | ✅ |

## Key assets

- `img/reference_studio.png` — the user-supplied reference (originally titled "Cell Architecture Studio")
- `img/cell_segments_grid.jpg` — representative-frame grid of the video's 7 segments
- `img/my_v1_mockup.png` — screenshot of my v1 static mockup (rejected)
- `img/palette_cell_video.png` — 12-color palette extracted from the video via K-means

## Data sources

- `data/pW1N8Cz6sTwINRnK.mp4` — Tripo3D auto-generated cell demo video, 41.8 s / 60 fps / 3024×1714 / H.264
- `models/tripo-plant-cell-test.glb` — single mesh, 1.96 M faces, 4K baseColor + 4K normal + 4K ORM
- `models/tripo-epithelial-cell-test.glb` — same-source Tripo epithelial-cell model
- `tech.md` — locked stack declaration (React 19 + Vite + R3F + Drei + Framer Motion + Lucide)

## One-line summary

**This isn't a "plant cell viewer" — it's a 7+-cell browsing / learning / comparison Studio. The video is a screen recording of the "automatic Cinema-mode tour".**
