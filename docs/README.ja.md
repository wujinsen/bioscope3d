# BioScope3D — デザイン / プロダクト分析ドキュメント

> 🌐 [English](./README.en.md) · [简体中文](./README.md) · **日本語**

> 目的：フロントエンドコードを書く前に、すべての**動画的証拠、リファレンスデザイン、機能分解、技術的決定**をドキュメント化する —— レビュー・遡及・反復ができるように。
>
> *これらは「コードを書く前」の製品分析ドキュメントです。本文中に "Cell Architecture Studio" という表現が出てきた場合、それはユーザー提供のリファレンス画像の元のファイル名（歴史的事実）を指しており、現在の製品名ではありません。現在の製品名は **BioScope3D** —— 改名の経緯は `../AGENTS.md` § 8 を参照。*

## インデックス

| ドキュメント | 内容 | ステータス |
|---|---|---|
| [01-video-analysis.md](./01-video-analysis.md) | `pW1N8Cz6sTwINRnK.mp4`（41.8 秒）のセグメント別分解 + パレット + ショット表 | ✅ |
| [02-design-gap.md](./02-design-gap.md) | リファレンス画像 `Cell Architecture Studio` と私の v1 静的モックアップ、フィールドレベルの差分 | ✅ |
| [03-features.md](./03-features.md) | 全機能リスト F01–F53 + F54–F63、証拠・優先度・技術的難度 | ✅ |
| [04-mvp-roadmap.md](./04-mvp-roadmap.md) | MVP v1 / v2 / v3 段階ロードマップ | ✅ |
| [05-open-questions.md](./05-open-questions.md) | 未解決事項 **（2026-05-13 にすべて確定済み）** | ✅ |

## 主要アセット

- `img/reference_studio.png` —— ユーザー提供のリファレンス（元のタイトル "Cell Architecture Studio"）
- `img/cell_segments_grid.jpg` —— 動画の 7 セグメント代表フレームのグリッド
- `img/my_v1_mockup.png` —— 私の v1 静的モックアップのスクリーンショット（却下）
- `img/palette_cell_video.png` —— 動画から K-means で抽出した 12 色パレット

## データソース

- `data/pW1N8Cz6sTwINRnK.mp4` —— Tripo3D が自動生成した細胞デモ動画、41.8 s / 60 fps / 3024×1714 / H.264
- `models/tripo-plant-cell-test.glb` —— シングルメッシュ、196 万面、4K baseColor + 4K normal + 4K ORM
- `models/tripo-epithelial-cell-test.glb` —— 同じ Tripo 由来の上皮細胞モデル
- `tech.md` —— 確定スタック宣言（React 19 + Vite + R3F + Drei + Framer Motion + Lucide）

## 一行サマリ

**これは「植物細胞ビューア」ではなく、7+ 種類の細胞のブラウジング / 学習 / 比較 Studio。動画は「自動ツアー = Cinema モード」の画面録画。**
