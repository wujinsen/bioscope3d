# 03 · 功能清单 F01 – F53

> 🌐 [English](./03-features.en.md) · **简体中文** · [日本語](./03-features.ja.md)

> 三档分组：**A** 视频直接可证 / **B** 视频间接暗示 / **C** UX 完整性补全
> 每项含：证据链、优先级、技术难度、关键依赖

---

## A. 视频里直接可证实的功能（P0 — 必须）

| ID | 功能 | 证据 | 难度 |
|---|---|---|---|
| **F01** | **多细胞库（≥ 7 种）** | 7 个切镜段，每段主色/包围框都不同 | 🟢 数据驱动 |
| **F02** | **自动巡游（Auto Tour）** | 整段视频是按时间顺序连续展示 | 🟡 镜头状态机 |
| **F03** | **每细胞独立时长**：4.5 / 5.5 / 4.5 / 6.0 / 7.0 / 5.0 / 7.0 s | 段长各异（[01-video-analysis.md](./01-video-analysis.md)）| 🟢 配置驱动 |
| **F04** | **硬切转场** | 切镜在 1 帧内完成 | 🟢 React state |
| **F05** | **每细胞独立镜头预设**（distance / target / 朝向）| seg3 占屏 10%，其他 16–23% | 🟡 关键帧定义 |
| **F06** | **PBR + HDRI 顶级渲染**（Tripo 同款）| 整体材质 / 阴影 / 光照风格 | 🔴 R3F + N8AO + Bloom |
| **F07** | **静态展示 / 极慢自转**（不剧烈旋转）| 段内 cx/cy 漂移 < 0.05 | 🟢 0.1 rpm orbit |
| **F08** | **Cinema 模式**（全屏无 UI） | 整段视频无任何 UI 元素 | 🟢 chrome 隐藏切换 |

---

## B. 视频间接暗示的功能（P1 — 应该）

| ID | 功能 | 推断依据 | 难度 |
|---|---|---|---|
| **F09** | 手动选择细胞（左栏点选）| 既然有巡游，必有手动模式 | 🟢 |
| **F10** | 拖拽旋转 / 滚轮缩放 / 右键平移 | 3D viewer 标准期望 | 🟢 OrbitControls |
| **F11** | Cinema ↔ Studio 模式切换 | 视频是 Cinema，参考图是 Studio | 🟢 |
| **F12** | 巡游可暂停 / 跳至某细胞 / 进度条 | UX 必备 | 🟢 |
| **F13** | 每细胞驻留时长可调（4–10s） | 段长不等说明可配 | 🟢 设置项 |
| **F14** | HDRI / 背景切换 | 视频统一暖白，产品应可换 | 🟡 环境贴图 |
| **F15** | 每细胞封面 thumbnail（来自 seg 起始帧）| 左栏要图 | 🟢 ffmpeg 脚本 |
| **F16** | **PBR 增强（烘 AO / 推 roughness / 增强 normal）** | 视频材质明显优于裸 GLB | 🔴 trimesh raycast |

---

## C. UX 完整性补全（P1 / P2 — 没在视频但产品必备）

### C.1 巡游控制

| ID | 功能 | 优先级 |
|---|---|---|
| F17 | 播放 / 暂停 / 重播 | P1 |
| F18 | 上一个 / 下一个 细胞（◀ ▶ + 键盘 ← →） | P1 |
| F19 | 时间轴进度（当前细胞 / 总 X 个 + 剩余秒数） | P1 |
| F20 | 巡游速度 0.5× / 1× / 2× | P2 |
| F21 | 循环 / 单次 模式 | P2 |
| F22 | 拍摄路径：固定 / 缓慢自转 / Tripo 同款三镜头 | P2 |

### C.2 镜头与渲染

| ID | 功能 | 优先级 |
|---|---|---|
| F23 | 重置镜头（一键回到该细胞预设视角） | P0 |
| F24 | **三种 View Mode**：实体 / 剖面 / 拆分（参考图有） | P1 |
| F25 | Cross-Section 切片（拖动滑块切剖） | P2 |
| F26 | Isolate（只显示选中细胞器） | P2 |
| F27 | Hide Others（隐藏其他细胞器） | P2 |
| F28 | Screenshot 一键截图 | P0 |
| F29 | 录制 30s MP4 巡游（生成同款视频） | P1 |
| F30 | 3D Export（GLB / OBJ） | P2 |

### C.3 信息层

| ID | 功能 | 优先级 |
|---|---|---|
| F31 | 每细胞元数据：学名 / 雅号 / 类型 / 大小 / 栖息环境 / 功能 | P0 |
| F32 | 细胞器列表 + 数量 | P0 |
| F33 | **细胞器 hover/click 高亮**（点 3D 核 → 右栏显核信息） | P1（依赖 F35） |
| F34 | 教科书段落 + Fun Fact | P0 |
| F35 | **细胞器自动分离 Pipeline**（颜色聚类 + 几何 islands） | 🔴 P1 但很难 |
| F36 | Where it Occurs 情境图 / 视频 | P1 |
| F37 | 真实显微镜对比（光镜 / 染色 / 电镜，拉 NIH） | P1 |

### C.4 浏览与比较

| ID | 功能 | 优先级 |
|---|---|---|
| F38 | Compare Cells（双细胞并排同步 orbit） | P1 |
| F39 | Gallery（图册式浏览） | P1 |
| F40 | Library（参考资料 / 文献链接） | P2 |
| F41 | 搜索 + 过滤（按类型 / 大小 / 界） | P2 |
| F42 | 收藏 / 心标 | P2 |

### C.5 教学 / 笔记

| ID | 功能 | 优先级 |
|---|---|---|
| F43 | Notebooks（保存当前视角 + 个人标注） | P1 |
| F44 | Guided Tour（带解说的引导巡游） | P2 |
| F45 | Quiz Mode（隐藏标签让用户点） | P3 |
| F46 | 键盘快捷键（Space / R / I / 1-9） | P1 |

### C.6 资产管理

| ID | 功能 | 优先级 |
|---|---|---|
| F47 | 拖拽上传任意 GLB 进入 viewer | P1 |
| F48 | 接 Tripo / Hunyuan API 生成新细胞（tech.md 提到） | P2 |
| F49 | 每个 GLB 的 PBR 增强一键开关 | P1 |

### C.7 偏好 / 设置

| ID | 功能 | 优先级 |
|---|---|---|
| F50 | 品质档位（低端 GPU 关 SSAO / Bloom） | P1 |
| F51 | 暗色 / 浅色主题 | P2 |
| F52 | 中英文切换 | P1 |
| F53 | 导出 / 分享（链接 / PDF 解剖图） | P2 |

---

## D. 从 v1 元素催生的新功能（P1 / P2）

> v1 静态稿虽然用错了语境，但里面有一些组件 / 状态 / 模式**剥离 RPG 滤镜后是真正有产品价值的**。下面 10 条是把 v1 残留**转译**成的功能。

| ID | 功能 | v1 出处 | 价值 | 优先级 |
|---|---|---|---|---|
| **F54** | **Specimen Card 学术 HUD**：可一键开关画布 4 角的科学浮层（Specimen ID / Scale bar / Magnification / Stain / Render mode），导出 PNG 自带这些数据 | v1 画布 4 角 HUD | 课堂备课 / 学术报告直接用 | P1 |
| **F55** | **Curator Attribution（贡献者署名）**：每个细胞标注来源（Tripo / Hunyuan / NIH / 用户）+ 贡献者头像 + 引用格式（APA/MLA） | v1 Velmora 角色块 | 学术信任 / 版权清晰 | P1 |
| **F56** | **Mastery / Library Progress**：可视化用户已浏览 / 标注 / 通过 Quiz 的细胞累计（"已掌握 14 / 48"） | v1 "Expedition Log 14/48" | 教育产品留存抓手 | P1 |
| **F57** | **Pipeline Status Indicator**：脉冲点显示当前模型处理状态：`Raw GLB → AO Baking → Enhanced → Compare Ready` | v1 SCAN ACTIVE 脉冲 | 技术透明度 | P1 |
| **F58** | **Scientific Taxonomy Breadcrumb**：3 级分类面包屑（Domain · Kingdom · Cell type），点任一级跳到该 taxon 全部细胞 | v1 "PLANTAE · CHLOROPHYTA · MAGNOLIOPSIDA" | 教育导航 | P1 |
| **F59** | **Render Budget Meter**：实时显示当前 FPS / 三角面 / GPU 占用，让用户看到品质档位代价 | v1 "Lv 28 · 5,420/8,000 KE" | 性能透明 | P2 |
| **F60** | **Tour Progress Bar**：巡游时显示 `Cell 3 of 7 · 0:14 / 0:42` + 可拖拽跳段（合并 F19） | v1 底栏进度条 | 巡游精控 | P1 |
| **F61** | **Model Quality Grade**：每个 GLB 自动评级 A/B/C/D（基于 normal map 信噪比、UV 利用率、面数、纹理分辨率） | v1 "Lv 14" 印章 | 数据透明 | P2 |
| **F62** | **Field Notes 用户标注**：在描述区写笔记 → 存进 Notebooks（合并 F43） | v1 "Field Notes" 卡片 | UGC / 学习留存 | P1 |
| **F63** | **Onboarding Sequence**：第一次打开走 5 步引导（左栏 → 鼠标拖拽 → 切剖面 → 看右栏 → 巡游） | v1 Post-it 提示（位置错了） | 新手友好 | P2 |

### F58 详细规范

```
3 级（默认显示）:   Domain · Kingdom · Cell type
  Plant Cell:       Eukarya · Plantae   · Plant Cell
  Bacterium:        Bacteria · —         · Bacterium
  Neuron:           Eukarya · Animalia  · Neuron
  Red Blood Cell:   Eukarya · Animalia  · Erythrocyte
```

未来若要扩展，可降级显示 8 级（Domain · Kingdom · Phylum · Class · Order · Family · Genus · Species），不到 species 级时该级显示 "—"。

### F57 详细规范

```
状态点颜色:
  灰色  · Raw GLB         (刚加载，未做任何处理)
  黄色 · AO Baking        (PBR pipeline 正在烘焙)
  绿色 · PBR Enhanced     (烘焙完成，正在用增强版渲染)
  青色 · Compare Ready    (Diff 模式：左裸 / 右增强)
脉冲速率与渲染负载挂钩，越快 = 越接近实时。
```

---

## 难度图例

- 🟢 直接前端配置 / 标准 React 组件
- 🟡 涉及 Three.js / shader / 状态机，需要中等定制
- 🔴 算法 / 后处理 pipeline / 数据预处理，需要专门设计

## 依赖关系（关键）

```
F35 (细胞器分离)  ─┬──→ F26 Isolate
                  ├──→ F27 Hide Others
                  ├──→ F33 hover/click 高亮
                  └──→ F25 Cross-Section（精确切到某器件）

F16 (PBR 增强)    ─┬──→ F06 顶级渲染（增强后效果更接近 Tripo 视频）
                  └──→ F49 一键开关

F02 (自动巡游)    ─┬──→ F03 时长配置
                  ├──→ F05 镜头预设
                  ├──→ F12/F17/F18/F19 控制
                  └──→ F22 路径

F31 (元数据)      ─┬──→ F32 细胞器
                  ├──→ F34 Notes
                  └──→ F36 Where it Occurs
```

## 实现策略

- **先做 P0 + 不依赖 F35 的 P1** → 形成 MVP v1（约 60% 功能）
- **F35（细胞器分离）单独做一个 pipeline 实验**，验证可行后再接入 → MVP v2
- **F48（AI API）** 现阶段 mock，未来再接 → 不阻塞主线
- **F54–F63 v1 转译功能** → P1 全部塞 v2，P2 塞 v3

## 总功能数

**63 个功能点**（F01–F53 + F54–F63），按优先级：

| 优先级 | 数量 | 说明 |
|---|---|---|
| P0 | 13 | 必须实现，缺一不可 |
| P1 | 27 | 应该实现，分布到 v1/v2 |
| P2 | 18 | 可选，进 v3 或后续 |
| P3 | 5 | 远期，先不考虑 |

