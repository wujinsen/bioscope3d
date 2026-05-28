# 06 · Tripo / glTF PBR Speckle Mitigation Roadmap

> 🌐 **English** · [简体中文](./06-pbr-tripo-mitigation.md) · [日本語](./06-pbr-tripo-mitigation.ja.md)

> **Status:** Archived 2026-05-16. Aligned with `apps/bioscope3d/src/lib/pbr.ts`, `tripoDebug.ts`, `SceneEnvironment.tsx`, and stage `<model-viewer>` exposure.
>
> **Problem:** Tripo / Hunyuan glTF exports often show **IBL highlight speckle** on cream HDRI + dense tangent space. Alt+Shift bisect (IBL off, forced matte) shows the main drivers are **environment reflection + Re-bake pulling roughness too low + normal mips/strength**, not a missing model.

---

## Render paths (read first)

| Path | Entry | PBR knobs? |
|---|---|---|
| **Stage default** | `CellModelViewer` (`<model-viewer>`) | `tone-mapping` / `exposure` only (Tripo cells use lower exposure); **no** `enhancePBR` |
| **R3F specimen** | `CellScene` → `CellModel` (not mounted from `Stage` today) | `enhancePBR` · `tuneTripoTextures` · `applyTripoDebugMaterialPasses` · Research `applySpecularAAMitigation` |

**B/C items** target the R3F path. Stage Tripo cells rely on glTF + exposure; v0.3 may add a low-intensity local `environment-image` for `<model-viewer>` (C1 extension).

---

## Roadmap table

| ID | Phase | Content | Status | Code / assets |
|---|---|---|---|---|
| **B4** | Short | Re-bake / default: **do not pull roughness down** (no 0.96× / 0.42 floor); matte slots only get rougher | ✅ | `pbr.ts` → `enhancePBR` |
| **C1** | Short | Lower IBL + **cap** `envMapIntensity` (no Re-bake ×1.04) | ✅ | `PBR_HDRI_ENVIRONMENT_INTENSITY=0.16`, `PBR_ENV_MAP_INTENSITY_CEILING=0.28`; `SceneEnvironment`; Tripo MV `exposure=0.88` |
| **B1** | Mid | `stabilizeTripoOrganicMaterial`: strip metal/normals on `tripo_material*`, roughness≥0.92, env cap | ✅ | `tripoDebug.ts` |
| **B2** | Mid | Lightweight: roughness bias + normal mip fix for non-`tripo_material` slots with normal maps | ✅ | `mitigateNormalMappedSpecularAliasing` |
| **B3** | Optional | **Research mode** auto Specular AA lite (normal scale ×0.88 + roughness floor) | ✅ | `applySpecularAAMitigation`; `CellModel` when `mode===research` |
| **B3+** | Future | Real Specular AA shader or Tripo-only toggle | ⏳ | — |
| **A2** | Assets | Per showcase cell glTF hand pass (normals, samplers, roughness maps) | ⏳ manual | Blender / Substance |
| **A1** | Assets | Batch glTF audit script (read-only report) | ✅ | `apps/bioscope3d/scripts/audit-tripo-gltf.mjs` |

---

## B4 · Roughness curve (Re-bake)

| Original `roughness` | Enhanced behavior |
|---|---|
| `r ≥ 0.82` | `clamp(max(r, 0.94), 0.9, 1)` — matte only |
| `r < 0.82` | `clamp(r, r, 0.96)` — **never below original** |

**Original** pill still restores from `material.userData.__pbrOriginal`.

---

## C1 · IBL and env cap

| Knob | Value | Location |
|---|---|---|
| Global HDRI | `0.16` | `SceneEnvironment` |
| Per-material env cap | `0.28` | `enhancePBR` + `stabilizeTripoOrganicMaterial` |
| Re-bake env boost | **none** | `enhancePBR` |
| `<model-viewer>` Tripo exposure (Explore/Teach + Re-bake) | `0.88` | `modelViewerPbr.ts` → `CellModelViewer` |
| `<model-viewer>` Tripo exposure (Research) | `0.82` | same |
| `<model-viewer>` Tripo exposure (Original pill off) | `1.0` | A/B vs enhanced |

---

## B1 · Tripo organic material stabilization

For `material.name` prefix `tripo_material`: `metalness=0`, no metalnessMap, `roughness≥0.92`, no roughnessMap, `normalMap=null`, env capped. Runs in `tuneTripoTextures()` after GLB load.

---

## B2 · Non–tripo_material slots with normals

- Normal maps: non-color space + upgrade LINEAR-only minFilter to mip trilinear (existing).  
- If scalar `roughness < 0.78`: lerp toward `0.8`.  
- **Not** doing full RoughnessMipmapper.

---

## B3 · Research Specular AA (experimental)

When `mode === research` and R3F `CellModel` is mounted: normal scale ×0.88, `roughness = max(roughness, 0.78)`, reversible snapshot. Heuristic only — not LEAN/Specular AA shaders.

---

## Bisect hotkeys (existing)

| Key | Flag | Effect |
|---|---|---|
| Alt+Shift+1 | `iblOff` | Disable R3F Environment |
| Alt+Shift+2 | `noNormalMaps` | Strip normal maps |
| Alt+Shift+3 | `matteForced` | Forced matte |
| Alt+Shift+4 | `clearcoatZero` | Zero clearcoat / sheen |
| Alt+Shift+0 | reset | Clear flags |

HUD: `TripoDebugHud.tsx`.

---

## A1 · Batch audit

```bash
node apps/bioscope3d/scripts/audit-tripo-gltf.mjs models/tripo-plant-cell-test.glb
pnpm -C apps/bioscope3d audit:gltf -- ../../models/tripo-plant-cell-test.glb
```

---

## A2 · Per-cell manual optimization

1. Lock glb for long-term `CellId` in `cells.ts`.  
2. Pre-export: normals non-sRGB; sane roughness contrast.  
3. `pnpm sync:models` → compare Original / Re-bake / Research.  
4. Note in CHANGELOG when satisfied.

### A2 checklist (stage GLBs)

| CellId | `modelPath` | A2 | Notes |
|---|---|---|---|
| `plant` | `tripo-plant-cell-test.glb` | ⏳ | Primary showcase |
| `animal` | `animal-cell.glb` | ⏳ | Tripo-style MV camera |
| `cancer` | `cancer-cell.glb` | ⏳ | |
| `bacteria` | `tripo-bacteria-cell.glb` | ⏳ | Custom radius % |
| `neuron` | `neuron-cell.glb` | ⏳ | |
| `rbc` / `wbc` / `muscle` | — | — | No GLB yet |

Batch audit: `pnpm -C apps/bioscope3d audit:gltf -- --all`

---

## Related feature IDs

**F06** PBR + HDRI · **F14** HDRI presets · **F16** PBR enhance — see [03-features.md](./03-features.md).

---

## Decision log (summary)

| Date | Decision |
|---|---|
| 2026-05-16 | B4+C1 short-term; B1–B3 + A1 script in repo; tri-lingual doc archived here |
| Earlier | R3F shadows off for center grain — see `CHANGELOG.md` |

Full history: `AGENTS.md` §8.
