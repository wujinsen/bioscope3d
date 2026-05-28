import type { HubTranslations } from "../types";

export const en: HubTranslations = {
  meta: { pageTitle: "Lab Hub — 3D gallery" },
  langSwitch: { label: "Language" },
  brand: {
    kicker: "3D interactive lab",
    name: "Lab Hub",
    homeAria: "Lab Hub home",
  },
  hero: {
    title: "3D model gallery",
    hand: "Explore · learn · immerse",
    lede: "Pick a card below to open its interactive scene.",
  },
  filters: {
    label: "Categories",
    all: "All",
    cells: "Life · cells",
    ships: "Space · vehicles",
    robots: "Mech · robots",
    planets: "Planets · worlds",
    heritage: "Heritage · China",
  },
  gallery: {
    title: "Featured experiences",
    countLine: (n) => `${n} experiences`,
  },
  demos: {
    bioscope3d: {
      title: "BioScope3D",
      subtitle: "Cell biology",
      blurb:
        "Watercolor cell studio with Explore, Teach, and Research modes — organelles, stories, and precision readouts.",
    },
    stellar: {
      title: "Stellar Expanse",
      subtitle: "Ship gallery",
      blurb:
        "Starship browsing with large hit targets, detail panels, and a cockpit-ready layout.",
    },
    robots: {
      title: "Mech frontier",
      subtitle: "Robotics",
      blurb: "Industrial arms and articulated rigs — interactive walkthrough coming soon.",
    },
    planets: {
      title: "Planet horizon",
      subtitle: "Worlds & terrain",
      blurb: "Planetary surfaces, atmospheres, and orbital views — coming soon.",
    },
  },
  heritage: {
    catalogSubtitle: "8-theme catalog",
    theme: "Heritage theme",
    tag3d: "3D",
    tagUi: "UI",
  },
  pills: { available: "Open", comingSoon: "In progress" },
  cta: { open: "Enter", waitlist: "Coming soon" },
  graphics: { blueprintMark: "…" },
};
