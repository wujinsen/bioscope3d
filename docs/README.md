# BioScope3D — 设计/产品分析文档

> 🌐 [English](./README.en.md) · **简体中文** · [日本語](./README.ja.md)

> 目的：在动手写前端之前，把所有**视频证据、参考设计、功能拆解、技术决策**都落到文档里，方便审查、回溯、迭代。
>
> *本目录下的文档是「写代码前」的产品分析记录。下面正文里若出现 "Cell Architecture Studio"，指的是用户提供的参考图原始命名（历史事实），不是当前产品名。当前产品名是 **BioScope3D**——见 `../AGENTS.md` § 8 决策记录。*

## 索引

| 文档 | 内容 | 状态 |
|---|---|---|
| [01-video-analysis.md](./01-video-analysis.md) | `pW1N8Cz6sTwINRnK.mp4` 41.8s 逐段拆解 + 调色板 + 切镜表 | ✅ |
| [02-design-gap.md](./02-design-gap.md) | 参考图 `Cell Architecture Studio` vs 我的 v1 静态稿，字段级差异 | ✅ |
| [03-features.md](./03-features.md) | F01–F53 完整功能清单，含证据链、优先级、技术难度 | ✅ |
| [04-mvp-roadmap.md](./04-mvp-roadmap.md) | MVP v1 / v2 / v3 分阶段路线 | ✅ |
| [05-open-questions.md](./05-open-questions.md) | 待决策项 **（已全部敲定 2026-05-13）** | ✅ |
| [06-pbr-tripo-mitigation.md](./06-pbr-tripo-mitigation.md) | Tripo / glTF PBR 闪点治理路线图（B1–B4 · C1 · A1/A2） | ✅ |

## 关键资产

- `img/reference_studio.png` — 用户给的参考图（原始命名 "Cell Architecture Studio"）
- `img/cell_segments_grid.jpg` — 视频 7 段镜头代表帧网格
- `img/my_v1_mockup.png` — 我做的 v1 静态设计稿截图（已被否决）
- `img/palette_cell_video.png` — 视频 K-means 提取的 12 色主调色板

## 数据来源

- `data/pW1N8Cz6sTwINRnK.mp4` — Tripo3D 自动生成的细胞演示视频，41.8s / 60fps / 3024×1714 / H.264
- `models/tripo-plant-cell-test.glb` — 单 mesh，1.96M 面，4K baseColor + 4K normal + 4K ORM
- `models/tripo-epithelial-cell-test.glb` — 同源 Tripo 上皮细胞模型
- `tech.md` — 仿品技术栈声明（React 19 + Vite + R3F + Drei + Framer Motion + Lucide）

## 一句话总结

**这不是"植物细胞 viewer"——它是一个 7+ 种细胞的浏览/学习/对比 Studio，视频是「自动巡游 Cinema 模式」的录屏。**
