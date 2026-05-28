export const LOCALES = ["en", "zh", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_META: Record<
  Locale,
  { short: string; long: string; native: string }
> = {
  en: { short: "EN", long: "English", native: "English" },
  zh: { short: "中", long: "Chinese", native: "简体中文" },
  ja: { short: "日", long: "Japanese", native: "日本語" },
};

export type DemoId = "bioscope3d" | "stellar" | "robots" | "planets";

export interface DemoCopy {
  title: string;
  subtitle: string;
  blurb: string;
}

export interface HubTranslations {
  meta: { pageTitle: string };
  langSwitch: { label: string };
  brand: { kicker: string; name: string; homeAria: string };
  hero: { title: string; hand: string; lede: string };
  filters: {
    label: string;
    all: string;
    cells: string;
    ships: string;
    robots: string;
    planets: string;
    heritage: string;
  };
  gallery: { title: string; countLine: (n: number) => string };
  demos: Record<DemoId, DemoCopy>;
  heritage: {
    catalogSubtitle: string;
    theme: string;
    tag3d: string;
    tagUi: string;
  };
  pills: { available: string; comingSoon: string };
  cta: { open: string; waitlist: string };
  graphics: { blueprintMark: string };
}
