# 05 · 未決事項（すべて解決済み）

> 🌐 [English](./05-open-questions.en.md) · [简体中文](./05-open-questions.md) · **日本語**

> 2026-05-13 ユーザー回答：「君のおすすめで」→ 推奨デフォルトをすべて採用。

---

## ✅ Q1 · 製品名

**決定**：**A · Cell Architecture Studio**

> 📝 **2026-05-13 追補**：製品名をリファレンス画像と同じにしたことで「インスピレーション」と「成果物」の区別が困難になった。**BioScope3D に改名**。詳細は `../AGENTS.md` § 8 の意思決定記録。

---

## ✅ Q2 · MVP v1 の範囲

**決定**：v1 = P0 13 機能 + F46 キーボードショートカット + F15 サムネイル + F23 カメラリセット + F28 スクリーンショット + F31/F32/F34 メタデータ
**v2 へ繰越**：F16 PBR エンハンス + F38 Compare Cells + v1 翻案 P1 7 件（F54–F62 の P1 部分）

---

## ✅ Q3 · 細胞小器官分離（F35）

**決定**：
- v1 は **A**：現実を受け入れ、細胞全体ホバーで汎用情報を表示
- v2 で **C** へ：色クラスタリング + 幾何アイランド（1.5–2 日の専用作業）

---

## ✅ Q4 · AI 生成（F48）

**決定**：v1/v2 は全工程モック（クリック → 5 秒のフェイクローディング → プリセット GLB 読込）
本物の API 接続は延期。必要になったら API キーを依頼。

---

## ✅ Q5 · 5 細胞の GLB 不足

**決定**：
- v1 は **A**：plant + epithelial を 7 つの UI スロットに繰り返し配置、実 3D は 2 種のみ
- v2 で **C** へ：NIH 3D Print Exchange / Cell Image Library からオープン代替を入手

---

## ✅ Q6 · 動画 7 セグメントの対応

**決定**：**私の推定マッピングを採用**

| Seg | 区間 | 推定 |
|---|---|---|
| 1 | 0.0–4.5 s | **Plant Cell** |
| 2 | 4.5–10.0 s | **Animal / Epithelial Cell** |
| 3 | 10.0–14.5 s | **Bacteria Cell**（遠景） |
| 4 | 14.5–20.5 s | **Red Blood Cell** |
| 5 | 20.5–27.5 s | **Neuron** |
| 6 | 27.5–32.5 s | **White Blood Cell** |
| 7 | 32.5–39.5 s | **Muscle Cell** |

---

## ✅ Q7 · テーマ & ムード

**決定**：**A · リファレンス通り** —— 手帳風ラーニングワークショップ、✦ ❤ の手描き装飾を保持。

---

## ✅ Q8 · タイポグラフィ

**決定**：**A · Caveat**（手書き）+ DM Serif Display（セリフ見出し）+ Inter（本文）+ JetBrains Mono（数値）

---

## ✅ F54–F63 の新機能

**決定**：**全件採用**
- P1 群（F54/55/56/57/58/60/62 の 7 件）→ MVP v2
- P2 群（F59/61/63 の 3 件）→ MVP v3

---

## ✅ F58 Taxonomy Breadcrumb の階層数

**決定**：**3 段階**（Domain · Kingdom · Cell type）
将来 8 段階（Domain · Kingdom · Phylum · Class · Order · Family · Genus · Species）まで拡張可能。該当する種別がない段階は "—" 表示。

---

# 次のアクション

1. ✅ 決定の記録（このドキュメント）
2. ⏳ `docs/03-features.md` を F54–F63 込みで書き直し（完了）
3. ⏳ `docs/04-mvp-roadmap.md` を再編（完了）
4. ⏭ **次：v2 デザインを着地** `design/v2/index.html`
   - パレットをオリーブ + ソフトライラックに変更
   - 上部 4 タブ、左カラムにサムネイル、右カラムは ORGANELLE DETAILS / BIOLOGICAL NOTES / WHERE IT OCCURS
   - 中央 3D ビューポートは v1 の暖色ステージ + ビネットを保持
   - F54 Specimen HUD（4 隅、トグル可）
   - F57 Pipeline Status パルスドット
   - F58 3 段階 Taxonomy Breadcrumb
   - F60 Tour Progress Bar（独立ステータスバーは置かず、上部または中央に吸着）
   - F62 Field Notes カード
   - F63 初回起動時のオンボーディング Post-it
5. ⏭ ブラウザレビュー
6. ⏭ MVP v1 コーディング開始（Vite + R3F）
