import type { HubTranslations } from "../types";

export const zh: HubTranslations = {
  meta: { pageTitle: "Lab Hub — 3D 模型橱窗" },
  langSwitch: { label: "语言" },
  brand: {
    kicker: "3D 互动实验室",
    name: "Lab Hub",
    homeAria: "Lab Hub 首页",
  },
  hero: {
    title: "3D 模型橱窗",
    hand: "探索 · 学习 · 沉浸浏览",
    lede: "选择下方卡片，进入对应的互动场景。",
  },
  filters: {
    label: "分类",
    all: "全部",
    cells: "生命 · 细胞",
    ships: "航天 · 载具",
    robots: "机械 · 机器人",
    planets: "星球 · 环境",
  },
  gallery: {
    title: "精选体验",
    countLine: (n) => `共 ${n} 个`,
  },
  demos: {
    bioscope3d: {
      title: "BioScope3D",
      subtitle: "细胞生命科学",
      blurb: "水彩绘本风格的细胞与细胞器之旅，支持探索、课堂演示与精读模式。",
    },
    stellar: {
      title: "Stellar Expanse",
      subtitle: "星舰主题展厅",
      blurb: "星际舰船互动陈列：舰型浏览、信息面板与沉浸式座舱视角。",
    },
    robots: {
      title: "机械纪元",
      subtitle: "机器人互动",
      blurb: "工业机械臂与关节模型互动体验，敬请期待。",
    },
    planets: {
      title: "行星视界",
      subtitle: "星球与环境",
      blurb: "行星地貌、大气与轨道漫游场景，敬请期待。",
    },
  },
  pills: { available: "可体验", comingSoon: "筹备中" },
  cta: { open: "立即体验", waitlist: "敬请期待" },
  graphics: { blueprintMark: "待绘" },
};
