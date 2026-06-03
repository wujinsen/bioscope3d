/** Keep in sync with apps/ancient-chinese-famous-swords/data/taxonomy.json */
import taxonomyJson from "@/data/heritage-taxonomy.json";
import type { Locale } from "@/i18n/types";

export type HeritageTaxonomy = typeof taxonomyJson;

export const heritageTaxonomy: HeritageTaxonomy = taxonomyJson;

const heritageBase =
  import.meta.env.VITE_URL_HERITAGE_BASE ?? "http://127.0.0.1:5175/";

export function resolveHeritageHref(relative: string | null): string | undefined {
  if (!relative) return undefined;
  try {
    const base = heritageBase.endsWith("/") ? heritageBase : `${heritageBase}/`;
    return new URL(relative, base).href;
  } catch {
    return undefined;
  }
}

export function pickLocaleText(
  record: Record<string, string>,
  locale: Locale
): string {
  return record[locale] ?? record.zh ?? "";
}

export type HeritageGalleryRow = {
  id: string;
  category: "heritage";
  href?: string;
  soon: boolean;
  title: string;
  subtitle: string;
  blurb: string;
  heritageIcon: string;
};

export function buildHeritageGalleryRows(
  locale: Locale,
  catalogSubtitle: string,
  formatSubtitle: (icon: string, use3d: boolean, useUi: boolean) => string
): HeritageGalleryRow[] {
  const catalogHref = resolveHeritageHref("./index.html") ?? resolveHeritageHref("./");

  const catalogRow: HeritageGalleryRow = {
    id: "heritage-catalog",
    category: "heritage",
    href: catalogHref,
    soon: !catalogHref,
    title: pickLocaleText(heritageTaxonomy.title, locale),
    subtitle: catalogSubtitle,
    blurb: pickLocaleText(heritageTaxonomy.subtitle, locale),
    heritageIcon: "錄",
  };

  const themeRows: HeritageGalleryRow[] = heritageTaxonomy.categories.map((cat) => {
    const live = cat.status === "live";
    const href = live ? resolveHeritageHref(cat.href) : undefined;
    return {
      id: `heritage-${cat.id}`,
      category: "heritage",
      href,
      soon: !live || !href,
      title: pickLocaleText(cat.title, locale),
      subtitle: formatSubtitle(cat.icon, cat.use3d, cat.useUi),
      blurb: pickLocaleText(cat.blurb, locale),
      heritageIcon: cat.icon,
    };
  });

  return [catalogRow, ...themeRows];
}
