# 06 · Tripo / glTF PBR 闪点治理路线图

> 🌐 [English](./06-pbr-tripo-mitigation.en.md) · **简体中文** · [日本語](./06-pbr-tripo-mitigation.ja.md)

> **状态：** 2026-05-16 落档。与 `apps/bioscope3d/src/lib/pbr.ts`、`tripoDebug.ts`、`SceneEnvironment.tsx` 及镜台 `<model-viewer>` 曝光对齐。
>
> **问题：** Tripo / Hunyuan 等导出 glTF 在奶米 HDRI + 密集切线空间下易出现 **IBL 高光闪点（speckle）**。Alt+Shift 二分（关 IBL、超强哑光）已证明主因是 **环境反射 + 粗糙度被 Re-bake 拉得过亮 + 法线 mips/强度**，而非单纯「模型没加载」。

---

## 渲染路径（必读）

| 路径 | 入口 | PBR 可调？ |
|---|---|---|
| **镜台默认** | `CellModelViewer`（`<model-viewer>`） | 仅 `tone-mapping` / `exposure`（Tripo 细胞已降曝光）；**无** `enhancePBR` |
| **R3F 标本** | `CellScene` → `CellModel`（当前未挂到 `Stage`） | `enhancePBR` · `tuneTripoTextures` · `applyTripoDebugMaterialPasses` · Research 下 `applySpecularAAMitigation` |

文档中的 **B/C 项** 以 R3F 路径为准；镜台 Tripo 细胞依赖 glTF 原材质 + 曝光，长期可在 v0.3 为 `<model-viewer>` 配本地低强度 `environment-image`（见 C1 扩展）。

---

## 路线图总表

| ID | 阶段 | 内容 | 状态 | 代码 / 资产 |
|---|---|---|---|---|
| **B4** | 短期 | Re-bake / 默认：**不再把 roughness 往下拉**（去掉 0.96×、0.42 地板）；哑光槽只往更哑推 | ✅ | `pbr.ts` → `enhancePBR` |
| **C1** | 短期 | IBL 再降 + `envMapIntensity` **上限**（无 Re-bake ×1.04 加成） | ✅ | `PBR_HDRI_ENVIRONMENT_INTENSITY=0.16`，`PBR_ENV_MAP_INTENSITY_CEILING=0.28`；`SceneEnvironment`；Tripo MV `exposure=0.88` |
| **B1** | 中期 | `stabilizeTripoOrganicMaterial` 强化：`tripo_material*` 去金属/法线贴图、roughness≥0.92、env 封顶 | ✅ | `tripoDebug.ts` |
| **B2** | 中期 | 简化版：仅对 **带 normalMap/bumpMap** 且非 `tripo_material` 的槽位做 roughness bias + 法线 mip 修复（不上全量 RoughnessMipmapper） | ✅ | `tripoDebug.ts` → `mitigateNormalMappedSpecularAliasing` |
| **B3** | 可选 | **Research 模式** 自动 Specular AA 轻量版（法线 scale ×0.88 + roughness 下限） | ✅ | `tripoDebug.ts` → `applySpecularAAMitigation`；`CellModel` 在 `mode===research` 时启用 |
| **B3+** | 未来 | 真 Specular AA 着色器或 Tripo 专用开关（维护成本高） | ⏳ | — |
| **A2** | 资产 | 长期展示细胞 **逐个** 优化 glTF（法线、sampler、roughness 贴图） | ⏳ 人工 | Blender / Substance / 手工导出 |
| **A1** | 资产 | Tripo **批量** 审计脚本（sampler / normal / roughness 报告） | ✅ 只读 | `apps/bioscope3d/scripts/audit-tripo-gltf.mjs` |

---

## B4 · 粗糙度曲线（Re-bake）

**原则：** 已验证「关 IBL / 超强哑光」能明显去闪 → **默认态应更接近哑光，而不是把 roughness 往 0.42–0.6 拉亮。**

| 原始 `roughness` | Enhanced（Re-bake）行为 |
|---|---|
| `r ≥ 0.82` | `clamp(max(r, 0.94), 0.9, 1)` — 只更哑，不往中光泽拉 |
| `r < 0.82` | `clamp(r, r, 0.96)` — **不低于原始值**，禁止 legacy `max(0.42, r×0.96)` |

**Original** 药丸：仍从 `material.userData.__pbrOriginal` 无损还原。

---

## C1 · IBL 与 env 上限

| 旋钮 | 值 | 位置 |
|---|---|---|
| 全局 HDRI 强度 | `0.16` | `SceneEnvironment` ← `PBR_HDRI_ENVIRONMENT_INTENSITY` |
| 每材质 `envMapIntensity` 上限 | `0.28` | `enhancePBR` + `stabilizeTripoOrganicMaterial` |
| Re-bake env 加成 | **无**（不再 `×1.04`） | `enhancePBR` |
| `<model-viewer>` Tripo 曝光（Explore/Teach + Re-bake） | `0.88` | `modelViewerPbr.ts` → `CellModelViewer` |
| `<model-viewer>` Tripo 曝光（Research） | `0.82` | 同上 |
| `<model-viewer>` Tripo 曝光（Original 药丸关） | `1.0` | 用于与增强态 A/B 对比 |

**扩展（未做）：** `public/env_maps/` 本地 HDR + `<model-viewer environment-image>`，与 R3F 的 C1 对齐。

---

## B1 · Tripo 有机材质稳定化

对 `material.name` 前缀 `tripo_material`：

- `metalness = 0`，去掉 metalnessMap  
- `roughness = max(roughness, 0.92)`，去掉 roughnessMap  
- `normalMap = null`（镜台与 R3F 观感一致策略）  
- `envMapIntensity = min(..., PBR_ENV_MAP_INTENSITY_CEILING)`

在 `tuneTripoTextures()` 加载 GLB 后执行。

---

## B2 · 非法线贴图槽位的轻量缓解

对 **有** `normalMap` / `bumpMap` 且 **不是** `tripo_material` 的材质：

- 法线贴图：非颜色空间 + 缺 mip 时升为 `LinearMipmapLinearFilter`（已有）  
- 若标量 `roughness < 0.78`：向 `0.8` 轻推（`lerp`），减轻掠射角闪点  

**不做：** 全网格 RoughnessMipmapper（维护与构建成本高）。

---

## B3 · Research 模式 Specular AA（实验）

当 `body[data-mode="research"]` 且 R3F `CellModel` 挂载时：

- 有法线贴图的槽：`normalScale × 0.88`  
- `roughness = max(roughness, 0.78)`  
- 快照可逆，离开 Research 恢复  

**说明：** 这是 **几何/材质启发式**，不是 LEAN/Specular AA 着色器。若仍不满意再评估 B3+。

---

## 二分快捷键（已有）

| 快捷键 | 标志 | 用途 |
|---|---|---|
| Alt+Shift+1 | `iblOff` | 关 R3F Environment |
| Alt+Shift+2 | `noNormalMaps` | 剥离法线贴图 |
| Alt+Shift+3 | `matteForced` | 超强哑光（roughness=1, env=0） |
| Alt+Shift+4 | `clearcoatZero` | 关 clearcoat / sheen |
| Alt+Shift+0 | reset | 重置 |

HUD：`TripoDebugHud.tsx`（有 toggle 时显示）。

---

## A1 · 批量 glTF 审计

```bash
# 单文件
node apps/bioscope3d/scripts/audit-tripo-gltf.mjs apps/bioscope3d/public/models/tripo-plant-cell-test.glb
# public/models 下全部 .glb
pnpm -C apps/bioscope3d audit:gltf -- --all
```

输出：材质名、是否有 normal/roughness 贴图、minFilter 是否缺 mip、roughness/metalness 标量——用于决定 A2 手工修哪些资产。

---

## A2 · 单细胞手工优化（流程）

1. 在 `cells.ts` 标为长期展示的 `CellId` 上锁定 glb。  
2. 导出前：normal 贴图非 sRGB；roughness 贴图适度对比；避免全 1.0 粗糙 + 高 env 默认。  
3. `pnpm sync:models` → 浏览器对比 Original / Re-bake / Research。  
4. 满意后记入 CHANGELOG，必要时更新下表「A2 状态」列。

### A2 检查表（镜台 GLB）

| CellId | `modelPath` | A2 状态 | 备注 |
|---|---|---|---|
| `plant` | `tripo-plant-cell-test.glb` | ⏳ | 主展示细胞；`tripo_material` 槽 roughness=1，优先审计法线/ORM |
| `animal` | `animal-cell.glb` | ⏳ | Tripo 风格 MV 相机 |
| `cancer` | `cancer-cell.glb` | ⏳ | 同上 |
| `bacteria` | `tripo-bacteria-cell.glb` | ⏳ | 半径 `%` 已单独拉近 |
| `neuron` | `neuron-cell.glb` | ⏳ | 同上 |
| `rbc` | — | — | 无 GLB，仅 hero |
| `wbc` | — | — | 无 GLB |
| `muscle` | — | — | 无 GLB |

批量审计：`pnpm -C apps/bioscope3d audit:gltf -- --all`

---

## 相关功能 ID

- **F06** · PBR + HDRI  
- **F14** · HDRI 预设  
- **F16** · PBR 增强（Re-bake 药丸）  

详见 [03-features.md](./03-features.md)、[04-mvp-roadmap.md](./04-mvp-roadmap.md)。

---

## 决策记录（摘要）

| 日期 | 决策 |
|---|---|
| 2026-05-16 | 采用 B4+C1 短期方案；B1/B2/B3 代码落盘；A1 审计脚本；路线图本文档三语落档 |
| 更早 | R3F `CellScene` 关实时阴影，减轻中心颗粒感（见 `CHANGELOG.md`） |

完整 AGENTS 决策史见根目录 `AGENTS.md` §8。
