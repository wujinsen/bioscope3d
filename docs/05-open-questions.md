# 05 · 待决策项（已全部敲定）

> 🌐 [English](./05-open-questions.en.md) · **简体中文** · [日本語](./05-open-questions.ja.md)

> 2026-05-13 用户回答："按你说的来" → 全部采用默认推荐方案

---

## ✅ Q1 · 产品命名

**决策**：**A · Cell Architecture Studio**

> 📝 **2026-05-13 后续更新**：当时把产品名取成与参考图同名导致"灵感"和"产物"难以区分，**已改名为 BioScope3D**。详见 `../AGENTS.md` § 8 决策记录。

---

## ✅ Q2 · MVP v1 范围

**决策**：v1 = 13 项 P0 + F46 键盘快捷键 + F15 缩略图 + F23 重置镜头 + F28 Screenshot + F31/F32/F34 元数据
**追加进 v2**：F16 PBR 增强 + F38 Compare Cells + 7 项 v1 转译 P1（F54–F62 P1 段）

---

## ✅ Q3 · 细胞器分离 (F35)

**决策**：
- v1 走 **A**：接受现实，全细胞 hover 显示通用信息
- v2 升级到 **C**：颜色聚类 + 几何 islands（1.5–2 天专项）

---

## ✅ Q4 · AI 生成 (F48)

**决策**：v1/v2 全程 mock（点击 → 假 loading 5s → 加载预置 GLB）
未来真接 API 时再要 API key

---

## ✅ Q5 · 缺失 5 个细胞 GLB

**决策**：
- v1 用 **A**：plant + epithelial 重复填充，UI 显示 7 项但实际只有 2 种 3D
- v2 切到 **C**：去 NIH 3D Print Exchange / Cell Image Library 找开源替换

---

## ✅ Q6 · 视频 7 段对应

**决策**：**按我推断**

| Seg | 时段 | 推断 |
|---|---|---|
| 1 | 0.0–4.5s | **Plant Cell** |
| 2 | 4.5–10.0s | **Animal / Epithelial Cell** |
| 3 | 10.0–14.5s | **Bacteria Cell**（远景）|
| 4 | 14.5–20.5s | **Red Blood Cell** |
| 5 | 20.5–27.5s | **Neuron** |
| 6 | 27.5–32.5s | **White Blood Cell** |
| 7 | 32.5–39.5s | **Muscle Cell** |

---

## ✅ Q7 · 主题氛围

**决策**：**A · 完全照参考图** — 手账本式学习工坊，保留 ✦ ❤ 手绘装饰

---

## ✅ Q8 · 字体

**决策**：**A · Caveat**（手写） + DM Serif Display（衬线标题） + Inter（正文） + JetBrains Mono（数据）

---

## ✅ F54–F63 新功能

**决策**：**全部纳入**
- P1 段（F54/55/56/57/58/60/62 共 7 项）→ MVP v2
- P2 段（F59/61/63 共 3 项）→ MVP v3

---

## ✅ F58 Taxonomy Breadcrumb 级数

**决策**：**3 级**（Domain · Kingdom · Cell type）
未来可扩展到 8 级，不到 species 时该级显示 "—"

---

# 接下来动作

1. ✅ 决策落档（本文档完成）
2. ⏳ 重写 `docs/03-features.md` 加入 F54–F63（已完成）
3. ⏳ 重写 `docs/04-mvp-roadmap.md` 重排版本（已完成）
4. ⏭ **下一步：动 v2 设计稿**`design/v2/index.html`
   - 调色板换橄榄 + 柔紫
   - 顶栏 4 Tab、左栏带缩略图、右栏 ORGANELLE DETAILS / BIOLOGICAL NOTES / WHERE IT OCCURS
   - 中央 3D 视口保留 v1 的暖光 stage + 暗角
   - F54 Specimen HUD（4 角浮层，可开关）
   - F57 Pipeline Status 脉冲点
   - F58 3 级 Taxonomy Breadcrumb
   - F60 Tour Progress Bar（底部不要独立状态栏，吸附进中央或顶部）
   - F62 Field Notes 卡片
   - F63 第一次打开 onboarding 提示 Post-it
5. ⏭ 浏览器审稿
6. ⏭ 进入 MVP v1 编码（Vite + R3F）
