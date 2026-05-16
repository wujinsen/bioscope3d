# 02 · 设计差异分析：参考图 vs 我的 v1

> 🌐 [English](./02-design-gap.en.md) · **简体中文** · [日本語](./02-design-gap.ja.md)

## 参考图（用户提供）

![reference](./img/reference_studio.png)

**产品名**：Cell Architecture Studio
**Tagline**：Explore life at the microscopic level ✦
**整体气质**：手账本式学习工坊，温润、教科书化、有装饰花纹（✦ ❤ Post-it 贴纸）

## 我的 v1 静态稿（已被否决）

![my v1](./img/my_v1_mockup.png)

**产品名**：BIOforge
**Tagline**：EXPLORE THE MICROCOSM
**整体气质**：深空指挥官 → 误入植物学，**RPG/科幻元素严重过载**（误用 AERIS 骨架）

## 调色板对比

| 维度 | 参考图 | 我的 v1 |
|---|---|---|
| 背景主色 | `#f2ece0` `#f8f3e7` `#faf4e8` 奶米 | `#f4f1e2` `#f0ebdd` 奶米 ✅ 同源 |
| 主强调色 | **`#9a945b` 橄榄绿**（生物语境）| **`#b8772a` 暖琥珀**（铁锈感）❌ 不符语境 |
| 次强调色 | **`#554f7c` 柔紫**（细胞核 / 细胞器）| 无 ❌ |
| 深字 | `#0b0b08` 接近黑 | `#2a2419` 暖黑 ✅ 近似 |

## 顶部栏对比

| 元素 | 参考图 | 我的 v1 | 差异 |
|---|---|---|---|
| Logo | 萌系彩色细胞图案（粉/绿） | 抽象橙色齿轮 | ❌ |
| 品牌字体 | 手写衬线（Caveat/Kalam 类） | 标准衬线 DM Serif | ❌ |
| 品牌名 | Cell Architecture Studio | BIOforge | ❌ |
| Tagline | "Explore life at the microscopic level ✦" 软调 | "EXPLORE THE MICROCOSM" 全大写军事 | ❌ |
| **导航 Tabs** | **Gallery / Library / Notebooks / Settings**（图标 + 文字）| 完全没有 | 🔴 **整块缺失** |
| 用户区 | 头像 + 下拉箭头（简洁）| 头像 + "Lv 28 · 5,420 / 8,000 KE"（RPG 数值）| ❌ |
| 扫描动画 | 无 | "SCAN ACTIVE" 橙色脉冲 | ❌ |
| 中央铭牌 | 无 | "SECTOR · PLANTAE-04" / "HELIOCENTRIC ORBIT 1.00 PX" | ❌ |

## 左侧栏对比

| 元素 | 参考图 | 我的 v1 | 差异 |
|---|---|---|---|
| 区段标题 | **CELL TYPES**（手写体 + 折叠箭头）| Cell Library（标准 caps）| 🟡 |
| 细胞缩略图 | **每项有真实彩色圆形头像**（实拍/AI 渲染） | 仅彩色圆点 | 🔴 |
| 细胞条目 | `Plant Cell` + 副标题 `Eukaryotic Cell` 类型 | `PLANT CELL` + 雅号 `The Green Engine` | 🔴 雅号是 AERIS 残留 |
| 收藏标记 | Plant Cell 旁有 ⭐ | 无 | ❌ |
| **第二节** | **ORGANELLES**（独立可折叠：Nucleus / Nucleolus / Rough ER …）| 完全没有 | 🔴 **整块缺失** |
| 分页指示 | 无 | 7 个圆点 ●●●●●●● | ❌ |
| 加号按钮 | 无 | "Generate via Tripo / Hunyuan" 虚线框 | 🟡 功能合理但位置不对 |

## 中央区对比

| 元素 | 参考图 | 我的 v1 | 差异 |
|---|---|---|---|
| 标题 | `Plant Cell` + 斜体 `Eukaryotic Cell` 两行 | `Plant Cell` + 斜体 `The Green Engine` + 面包屑（多一行）| 🟡 多了面包屑 |
| **黄色 Post-it 提示** | **有**：Drag to rotate / Scroll to zoom / Ctrl+drag to pan（手绘卷角） | 无 | 🔴 学习引导缺失 |
| 视图右上角 | **View Mode**（3 图标 + Cross-Section toggle）| 仅 "Specimen Overview" 徽章 | 🔴 **核心交互缺失** |
| 画布 HUD | 无 | 4 角 HUD（SPECIMEN ID / SCALE / ORBIT / PBR）| ❌ 多余科幻仪式感 |
| **画布下方工具栏** | **Rotate / Isolate / Hide Others / Reset View / Screenshot / 3D Export** | 完全没有 | 🔴 **核心交互缺失** |
| 底部 2 个卡片 | **MICROSCOPE VIEW**（4 缩略图：光镜/染色/电镜/+）+ **COMPARE CELLS**（双细胞 + Open Comparison）| 长描述 + 4 个数据 chip | 🔴 完全错配 |

## 右侧栏对比

| 元素 | 参考图 | 我的 v1 | 差异 |
|---|---|---|---|
| **第一块** | **ORGANELLE DETAILS**：当前点选的细胞器（Nucleus）+ Size / Location / Visible in LM / Label 开关 | "Researcher Velmora · Botanical Curator · LV 14" + Gravity 1.003g / Atmosphere Oxygenic / Surface Temp +22°C / Moon Count 0 / Magnetic Field Stable / Difficulty Easy | 🔴 **概念完全错**（RPG 数据） |
| **第二块** | **BIOLOGICAL NOTES**：教科书段落 + "Fun fact" | Organelles 列表（叶绿体 ×40 / 核 ×1 / 液泡 ×1 …）| 🔴 移位 + 缺失 |
| **第三块** | **WHERE IT OCCURS**：情境图（叶子 + 绿色细胞圆圈）+ 可播放视频 | 无 | 🔴 完全缺失 |

## 底部栏对比

| 元素 | 参考图 | 我的 v1 | 差异 |
|---|---|---|---|
| 是否存在 | **不存在** | 有：Compare / Route 按钮 + Expedition Log 14/48 + Play preview | 🔴 多余 |

## 致命问题（一句话）

> 我把 AERIS（星球探险）的科幻骨架硬套到生物语境，结果：**调性反、词条错、缺核心交互（View Mode / 工具栏 / Microscope View / Compare Cells / Where it Occurs）**。

## v2 修正清单（11 项）

1. ❌ **删** 所有 RPG/科幻语汇：SCAN ACTIVE / SECTOR / HELIOCENTRIC / Expedition Log / Velmora / Gravity / Atmosphere / Moon Count / Surface Temp / Magnetic Field
2. ✏ **改名** BIOforge → **Cell Architecture Studio**（手写衬线 logo）
3. ➕ **加** 顶栏 4 Tab：Gallery / Library / Notebooks / Settings
4. ➕ **加** 左栏每个细胞的圆形缩略图
5. ➕ **加** 左栏第二节 ORGANELLES（可折叠）
6. ➕ **加** 画布右上 View Mode（3 图标 + Cross-Section toggle）
7. ➕ **加** 画布下方工具栏 6 个按钮
8. ➕ **加** 黄色 Post-it 操作提示（手绘卷角）
9. ➕ **加** 底部双卡片 MICROSCOPE VIEW + COMPARE CELLS
10. 🔄 **重做** 右栏：ORGANELLE DETAILS + BIOLOGICAL NOTES + WHERE IT OCCURS
11. ❌ **删** 底部状态栏（不存在于参考图）

## 配色升级

```css
--bg:        #f2ece0;  /* was #f4f1e2 */
--paper:     #faf4e8;
--olive:     #9a945b;  /* 主强调，替换原 amber */
--olive-dk:  #5d5d36;
--lilac:     #908ab8;  /* 副强调（细胞器/细胞核）*/
--lilac-dk:  #554f7c;
--text:      #0b0b08;
--text-soft: #5d5d36;
--text-mute: #9a945b;
--line:      #c9c1bf;
```
