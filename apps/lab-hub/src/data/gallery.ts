import type { HubTranslations, Locale } from "@/i18n/types";
import {
  buildHeritageGalleryRows,
  type HeritageGalleryRow,
} from "@/data/heritage-taxonomy";

export type DemoCategory = "cells" | "ships" | "robots" | "planets" | "heritage";

export type CoreDemoId = "bioscope3d" | "stellar" | "robots" | "planets";

export type GalleryRow = {
  id: string;
  category: DemoCategory;
  href?: string;
  soon: boolean;
  title: string;
  subtitle: string;
  blurb: string;
  heritageIcon?: string;
};

const bioscope =
  import.meta.env.VITE_URL_BIOSCOPE3D ?? "http://127.0.0.1:5173";
const stellar =
  import.meta.env.VITE_URL_STELLAR_EXPANSE ?? "http://127.0.0.1:5174";

type CoreDemoCore = {
  id: CoreDemoId;
  href?: string;
  category: Exclude<DemoCategory, "heritage">;
  soon?: boolean;
};

const CORE_DEMOS: CoreDemoCore[] = [
  { id: "bioscope3d", href: bioscope, category: "cells" },
  { id: "stellar", href: stellar, category: "ships" },
  { id: "robots", category: "robots", soon: true },
  { id: "planets", category: "planets", soon: true },
];

export function buildCoreGalleryRows(t: HubTranslations): GalleryRow[] {
  return CORE_DEMOS.map((c) => {
    const copy = t.demos[c.id];
    return {
      id: c.id,
      category: c.category,
      href: c.href,
      soon: Boolean(c.soon || !c.href),
      title: copy.title,
      subtitle: copy.subtitle,
      blurb: copy.blurb,
    };
  });
}

export function buildHeritageRows(
  locale: Locale,
  t: HubTranslations
): GalleryRow[] {
  const formatHeritageSubtitle = (
    icon: string,
    use3d: boolean,
    useUi: boolean
  ) => {
    const tags: string[] = [];
    if (use3d) tags.push(t.heritage.tag3d);
    if (useUi) tags.push(t.heritage.tagUi);
    const tagStr = tags.length > 0 ? tags.join(" · ") : t.heritage.theme;
    return `${icon} · ${tagStr}`;
  };

  return buildHeritageGalleryRows(
    locale,
    t.heritage.catalogSubtitle,
    formatHeritageSubtitle
  );
}

export type { HeritageGalleryRow };
