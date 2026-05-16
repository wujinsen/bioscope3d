export const WORKSPACE_UI_LOCALE_STORAGE_KEY = "bioscope3d-workspace:ui-locale";

/** @deprecated Lab Hub ≤0.1 — migrated once at runtime */
const LEGACY_LAB_HUB_LOCALE_KEY = "lab-hub:locale";

export const WORKSPACE_UI_LOCALES = ["en", "zh", "ja"] as const;
export type WorkspaceUiLocale = (typeof WORKSPACE_UI_LOCALES)[number];

export function isWorkspaceUiLocale(s: string): s is WorkspaceUiLocale {
  return (WORKSPACE_UI_LOCALES as readonly string[]).includes(s);
}

export function readWorkspaceUiLocale(): WorkspaceUiLocale | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(WORKSPACE_UI_LOCALE_STORAGE_KEY);
    if (raw && isWorkspaceUiLocale(raw)) return raw;
  } catch {
    /* ignore */
  }
  return null;
}

export function writeWorkspaceUiLocale(l: WorkspaceUiLocale): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(WORKSPACE_UI_LOCALE_STORAGE_KEY, l);
  } catch {
    /* ignore quota / private mode */
  }
}

export function detectWorkspaceUiLocale(): WorkspaceUiLocale {
  if (typeof navigator === "undefined") return "en";
  const tags = (navigator.languages ?? [navigator.language]).map((x) =>
    x.toLowerCase()
  );
  for (const tag of tags) {
    if (tag.startsWith("zh")) return "zh";
    if (tag.startsWith("ja")) return "ja";
    if (tag.startsWith("en")) return "en";
  }
  return "en";
}

/** One-time: move `lab-hub:locale` into the workspace key if the latter is empty. */
export function migrateLegacyLabHubLocaleKey(): void {
  if (typeof localStorage === "undefined") return;
  try {
    const old = localStorage.getItem(LEGACY_LAB_HUB_LOCALE_KEY);
    if (!old || !isWorkspaceUiLocale(old)) return;
    if (!readWorkspaceUiLocale()) writeWorkspaceUiLocale(old);
    localStorage.removeItem(LEGACY_LAB_HUB_LOCALE_KEY);
  } catch {
    /* ignore */
  }
}
