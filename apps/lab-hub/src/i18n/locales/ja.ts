import type { HubTranslations } from "../types";

export const ja: HubTranslations = {
  meta: { pageTitle: "Lab Hub — 3Dギャラリー" },
  langSwitch: { label: "言語" },
  brand: {
    kicker: "3Dインタラクティブラボ",
    name: "Lab Hub",
    homeAria: "Lab Hub ホーム",
  },
  hero: {
    title: "3Dモデルギャラリー",
    hand: "探す · 学ぶ · 没入する",
    lede: "カードを選ぶと、それぞれのインタラクティブなシーンが開きます。",
  },
  filters: {
    label: "カテゴリ",
    all: "すべて",
    cells: "生命 · 細胞",
    ships: "宇宙 · 載具",
    robots: "メカ · ロボット",
    planets: "惑星 · 環境",
  },
  gallery: {
    title: "おすすめ体験",
    countLine: (n) => `${n} 件`,
  },
  demos: {
    bioscope3d: {
      title: "BioScope3D",
      subtitle: "細胞生命科学",
      blurb:
        "水彩画風の細胞・小器官スタジオ。探す・教える・研究の各モードに対応。",
    },
    stellar: {
      title: "Stellar Expanse",
      subtitle: "宇宙艦ギャラリー",
      blurb:
        "大型ヒットターゲットの艦選択、情報パネル、没入型コックピット視点。",
    },
    robots: {
      title: "メックフロンティア",
      subtitle: "ロボット",
      blurb: "産業用アームと関節モデルのインタラクション体験 — 近日公開。",
    },
    planets: {
      title: "プラネットホライズン",
      subtitle: "惑星と環境",
      blurb: "惑星地形・大気・軌道ビュー — 近日公開。",
    },
  },
  pills: { available: "体験可", comingSoon: "準備中" },
  cta: { open: "体験する", waitlist: "近日公開" },
  graphics: { blueprintMark: "···" },
};
