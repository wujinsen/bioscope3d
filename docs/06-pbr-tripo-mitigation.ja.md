# 06 · Tripo / glTF PBR スペックル低減ロードマップ

> 🌐 [English](./06-pbr-tripo-mitigation.en.md) · [简体中文](./06-pbr-tripo-mitigation.md) · **日本語**

> **状態：** 2026-05-16 文書化。`pbr.ts`・`tripoDebug.ts`・`SceneEnvironment.tsx`・ステージ `<model-viewer>` 露出と整合。
>
> **課題：** Tripo / Hunyuan 系 glTF はクリーム色 HDRI + 密な接線空間で **IBL ハイライトのスペックル** が出やすい。Alt+Shift 二分（IBL オフ・強制マット）から主因は **環境反射 + Re-bake による roughness の過剰な低下 + 法線 mip/強度** であり、モデル未読込ではない。

---

## レンダパス（必読）

| パス | 入口 | PBR 調整 |
|---|---|---|
| **ステージ既定** | `CellModelViewer`（`<model-viewer>`） | `tone-mapping` / `exposure` のみ（Tripo は低露出）。**`enhancePBR` なし** |
| **R3F 標本** | `CellScene` → `CellModel`（現状 `Stage` 未マウント） | `enhancePBR`・`tuneTripoTextures`・`applyTripoDebugMaterialPasses`・Research 時 `applySpecularAAMitigation` |

**B/C** は R3F 向け。ステージ Tripo は glTF + 露出依存。v0.3 で低強度 `environment-image` 検討（C1 拡張）。

---

## ロードマップ表

| ID | 段階 | 内容 | 状態 | コード / アセット |
|---|---|---|---|---|
| **B4** | 短期 | Re-bake：**roughness を下げない**（0.96× / 0.42 床廃止） | ✅ | `pbr.ts` |
| **C1** | 短期 | IBL 低減 + `envMapIntensity` **上限** | ✅ | HDRI `0.16`、上限 `0.28`；MV `exposure=0.88` |
| **B1** | 中期 | `tripo_material*` 安定化（金属/法線除去、roughness≥0.92） | ✅ | `tripoDebug.ts` |
| **B2** | 中期 | 法線あり非 tripo スロット：roughness バイアス + mip 修正 | ✅ | `mitigateNormalMappedSpecularAliasing` |
| **B3** | 任意 | **Research** で Specular AA 簡易版 | ✅ | `applySpecularAAMitigation` |
| **B3+** | 将来 | 本格 Specular AA シェーダ | ⏳ | — |
| **A2** | アセット | 展示細胞ごとの glTF 手修正 | ⏳ 手作業 | Blender 等 |
| **A1** | アセット | バッチ監査スクリプト（読取専用） | ✅ | `audit-tripo-gltf.mjs` |

---

## B4 · 粗さカーブ

| 元 `roughness` | Enhanced |
|---|---|
| `r ≥ 0.82` | よりマット方向のみ |
| `r < 0.82` | **元値未満にしない** |

---

## C1 · IBL

HDRI `0.16`、材質 env 上限 `0.28`、Re-bake の env ブーストなし。Tripo MV 露出：Re-bake `0.88`、Research `0.82`、Original `1.0`（`modelViewerPbr.ts`）。

---

## B1–B3

- **B1:** `tripo_material` — 金属/法線/roughness テクスチャ整理、env 上限。  
- **B2:** 法線スロット — mip 修正 + roughness 軽い押し上げ。  
- **B3:** Research で法線 scale ×0.88、roughness 下限 0.78（可逆）。

---

## 二分ショートカット

Alt+Shift+1–4 / 0（`TripoDebugHud` 参照）。既存と同じ。

---

## A1 · 監査

```bash
pnpm -C apps/bioscope3d audit:gltf -- --all
```

### A2 チェックリスト

| CellId | GLB | A2 |
|---|---|---|
| plant / animal / cancer / bacteria / neuron | 各 `modelPath` | ⏳ |
| rbc / wbc / muscle | なし | — |

---

## 関連機能

**F06** · **F14** · **F16** — [03-features.md](./03-features.md)。

---

## 決定ログ

| 日付 | 内容 |
|---|---|
| 2026-05-16 | B4+C1 短期、B1–B3・A1 実装、三語文書化 |
| 以前 | R3F リアルタイム影オフ — `CHANGELOG.md` |

詳細は `AGENTS.md` §8。
