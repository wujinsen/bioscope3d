# 02 · デザインギャップ分析：リファレンス vs 私の v1

> 🌐 [English](./02-design-gap.en.md) · [简体中文](./02-design-gap.md) · **日本語**

## リファレンス（ユーザー提供）

![reference](./img/reference_studio.png)

**製品名**：Cell Architecture Studio
**タグライン**：Explore life at the microscopic level ✦
**全体トーン**：手帳風ラーニングワークショップ —— 温かく、教科書的、装飾モチーフ（✦ ❤ Post-it シール）

## 私の v1 静的モックアップ（却下）

![my v1](./img/my_v1_mockup.png)

**製品名**：BIOforge
**タグライン**：EXPLORE THE MICROCOSM
**全体トーン**：深宇宙の司令官が誤って植物学領域に迷い込む、**RPG / SF 要素が過剰**（AERIS スケルトンの誤用）

## パレット比較

| 軸 | リファレンス | 私の v1 |
|---|---|---|
| 背景ベース | `#f2ece0` `#f8f3e7` `#faf4e8` クリーム | `#f4f1e2` `#f0ebdd` クリーム ✅ 同系 |
| 主アクセント | **`#9a945b` オリーブ**（生物学的文脈） | **`#b8772a` 暖アンバー**（錆びた感じ） ❌ 文脈に合わず |
| 副アクセント | **`#554f7c` ソフトライラック**（核 / 小器官） | なし ❌ |
| 暗字 | `#0b0b08` ほぼ黒 | `#2a2419` 暖黒 ✅ 近い |

## 上部バー比較

| 要素 | リファレンス | 私の v1 | 差分 |
|---|---|---|---|
| ロゴ | キュートな多色細胞モチーフ（ピンク / 緑） | 抽象的なオレンジの歯車 | ❌ |
| ブランドフォント | 手書きセリフ（Caveat / Kalam 系） | 標準セリフ DM Serif | ❌ |
| ブランド名 | Cell Architecture Studio | BIOforge | ❌ |
| タグライン | 「Explore life at the microscopic level ✦」ソフト | 「EXPLORE THE MICROCOSM」全大文字、軍事調 | ❌ |
| **ナビゲーションタブ** | **Gallery / Library / Notebooks / Settings**（アイコン + テキスト） | まったくない | 🔴 **ブロック全欠落** |
| ユーザー領域 | アバター + シェブロン（シンプル） | アバター + 「Lv 28 · 5,420 / 8,000 KE」（RPG ステータス） | ❌ |
| スキャンアニメーション | なし | 「SCAN ACTIVE」オレンジパルス | ❌ |
| 中央銘板 | なし | 「SECTOR · PLANTAE-04」/「HELIOCENTRIC ORBIT 1.00 PX」 | ❌ |

## 左サイドバー比較

| 要素 | リファレンス | 私の v1 | 差分 |
|---|---|---|---|
| セクションタイトル | **CELL TYPES**（手書き + 折り畳みシェブロン） | Cell Library（標準大文字） | 🟡 |
| 細胞サムネイル | **各項目に実色の円形ポートレート**（写真 / AI レンダー） | 色付きの点だけ | 🔴 |
| 細胞エントリ | `Plant Cell` + サブタイプ `Eukaryotic Cell` | `PLANT CELL` + 異名 `The Green Engine` | 🔴 異名は AERIS の残滓 |
| お気に入りマーク | Plant Cell の横に ⭐ | なし | ❌ |
| **第 2 セクション** | **ORGANELLES**（独立して折り畳み可能：Nucleus / Nucleolus / Rough ER …） | 存在しない | 🔴 **ブロック全欠落** |
| ページネーション | なし | 7 個のドット ●●●●●●● | ❌ |
| プラスボタン | なし | 「Generate via Tripo / Hunyuan」破線ボックス | 🟡 機能は妥当だが位置が違う |

## 中央エリア比較

| 要素 | リファレンス | 私の v1 | 差分 |
|---|---|---|---|
| タイトル | `Plant Cell` + イタリック `Eukaryotic Cell`、2 行 | `Plant Cell` + イタリック `The Green Engine` + パンくず（1 行余計） | 🟡 パンくず余計 |
| **黄色 Post-it ヒント** | **あり**：Drag to rotate / Scroll to zoom / Ctrl+drag to pan（手描きの巻き上がり角） | なし | 🔴 オンボーディング欠落 |
| ビュー右上 | **View Mode**（3 アイコン + Cross-Section トグル） | 「Specimen Overview」バッジのみ | 🔴 **核となるインタラクション欠落** |
| キャンバス HUD | なし | 4 隅 HUD（SPECIMEN ID / SCALE / ORBIT / PBR） | ❌ 過剰な SF 儀礼 |
| **キャンバス下のツールバー** | **Rotate / Isolate / Hide Others / Reset View / Screenshot / 3D Export** | まったくない | 🔴 **核となるインタラクション欠落** |
| 下部 2 カード | **MICROSCOPE VIEW**（4 サムネイル：光顕 / 染色 / 電顕 / +）+ **COMPARE CELLS**（双細胞 + Open Comparison） | 長い説明 + 4 つのデータチップ | 🔴 完全にミスマッチ |

## 右サイドバー比較

| 要素 | リファレンス | 私の v1 | 差分 |
|---|---|---|---|
| **第 1 ブロック** | **ORGANELLE DETAILS**：選択中の小器官（Nucleus）+ Size / Location / Visible in LM / Label トグル | 「Researcher Velmora · Botanical Curator · LV 14」+ Gravity 1.003g / Atmosphere Oxygenic / Surface Temp +22°C / Moon Count 0 / Magnetic Field Stable / Difficulty Easy | 🔴 **概念がまったく違う**（RPG データ） |
| **第 2 ブロック** | **BIOLOGICAL NOTES**：教科書段落 + 「Fun fact」 | 小器官リスト（葉緑体 ×40 / 核 ×1 / 液胞 ×1 …） | 🔴 位置がずれ + 欠落 |
| **第 3 ブロック** | **WHERE IT OCCURS**：シチュエーション画像（葉 + 緑色細胞の円）+ 再生可能な動画 | なし | 🔴 完全欠落 |

## 下部バー比較

| 要素 | リファレンス | 私の v1 | 差分 |
|---|---|---|---|
| 存在 | **存在しない** | あり：Compare / Route ボタン + Expedition Log 14/48 + Play preview | 🔴 余計 |

## 致命的問題（1 行）

> AERIS（惑星探検）の SF スケルトンを生物学の文脈にそのまま貼り付けた結果：**トーンが逆、語彙が誤り、核となるインタラクション欠落（View Mode / ツールバー / Microscope View / Compare Cells / Where it Occurs）**。

## v2 修正リスト（11 項目）

1. ❌ **削除** すべての RPG / SF 用語：SCAN ACTIVE / SECTOR / HELIOCENTRIC / Expedition Log / Velmora / Gravity / Atmosphere / Moon Count / Surface Temp / Magnetic Field
2. ✏ **改名** BIOforge → **Cell Architecture Studio**（手書きセリフのロゴ）
3. ➕ **追加** 上部バー 4 タブ：Gallery / Library / Notebooks / Settings
4. ➕ **追加** 左バー各細胞の円形サムネイル
5. ➕ **追加** 左バー第 2 セクション ORGANELLES（折り畳み可能）
6. ➕ **追加** キャンバス右上 View Mode（3 アイコン + Cross-Section トグル）
7. ➕ **追加** キャンバス下に 6 ボタンツールバー
8. ➕ **追加** 黄色 Post-it 操作ヒント（手描き巻き上がり角）
9. ➕ **追加** 下部 2 カード MICROSCOPE VIEW + COMPARE CELLS
10. 🔄 **再構築** 右バー：ORGANELLE DETAILS + BIOLOGICAL NOTES + WHERE IT OCCURS
11. ❌ **削除** 下部ステータスバー（リファレンスに存在しない）

## パレット更新

```css
--bg:        #f2ece0;  /* was #f4f1e2 */
--paper:     #faf4e8;
--olive:     #9a945b;  /* 主アクセント、旧 amber を置換 */
--olive-dk:  #5d5d36;
--lilac:     #908ab8;  /* 副アクセント（小器官 / 核） */
--lilac-dk:  #554f7c;
--text:      #0b0b08;
--text-soft: #5d5d36;
--text-mute: #9a945b;
--line:      #c9c1bf;
```
