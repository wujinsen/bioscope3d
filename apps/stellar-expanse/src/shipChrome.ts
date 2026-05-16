import type { WorkspaceUiLocale } from "@bioscope3d/workspace-ui-locale";

export function formatCredits(n: number, loc: WorkspaceUiLocale): string {
  const tag = loc === "en" ? "en-US" : loc === "zh" ? "zh-CN" : "ja-JP";
  return n.toLocaleString(tag);
}

export interface StellarChrome {
  productMastheadAria: string;
  languageToolbar: string;
  shipPreviewAria: string;
  shipDetailsAria: string;
  selectedShip: string;
  manufacturer: string;
  classLabel: string;
  role: string;
  costMutedLabel: string;
  credits: string;
  confirm: string;
  carouselAria: string;
  footQuick: string;
  footCycle: string;
  footRef: string;
  footAria: string;
}

export const STELLAR_CHROME: Record<WorkspaceUiLocale, StellarChrome> = {
  en: {
    productMastheadAria: "Product title",
    languageToolbar: "Interface language",
    shipPreviewAria: "Ship preview",
    shipDetailsAria: "Ship details",
    selectedShip: "Selected Ship",
    manufacturer: "Manufacturer",
    classLabel: "Class",
    role: "Role",
    costMutedLabel: "Cost:",
    credits: "Credits",
    confirm: "Confirm Selection",
    carouselAria: "Ship roster",
    footQuick: "quick select",
    footCycle: "cycle roster",
    footRef: "Hangar UI ref: b7-stellar-hifi",
    footAria: "Keyboard shortcuts",
  },
  zh: {
    productMastheadAria: "作品标题",
    languageToolbar: "界面语言",
    shipPreviewAria: "舰船预览",
    shipDetailsAria: "舰船详情",
    selectedShip: "当前舰船",
    manufacturer: "制造商",
    classLabel: "级别",
    role: "定位",
    costMutedLabel: "费用：",
    credits: "信用点",
    confirm: "确认选择",
    carouselAria: "舰船列表",
    footQuick: "快速选择",
    footCycle: "循环列表",
    footRef: "机库界面参考：b7-stellar-hifi",
    footAria: "键盘快捷键",
  },
  ja: {
    productMastheadAria: "作品タイトル",
    languageToolbar: "表示言語",
    shipPreviewAria: "艦船プレビュー",
    shipDetailsAria: "艦船詳細",
    selectedShip: "選択中の艦",
    manufacturer: "製造元",
    classLabel: "クラス",
    role: "役割",
    costMutedLabel: "コスト:",
    credits: "クレジット",
    confirm: "選択を確定",
    carouselAria: "艦船一覧",
    footQuick: "クイック選択",
    footCycle: "ロスターを切替",
    footRef: "UI 参照: b7-stellar-hifi",
    footAria: "キーボードショートカット",
  },
};
