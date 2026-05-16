import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  detectWorkspaceUiLocale,
  isWorkspaceUiLocale,
  migrateLegacyLabHubLocaleKey,
  readWorkspaceUiLocale,
  writeWorkspaceUiLocale,
  WORKSPACE_UI_LOCALE_STORAGE_KEY,
} from "@bioscope3d/workspace-ui-locale";
import type { HubTranslations, Locale } from "./types";
import { en } from "./locales/en";
import { zh } from "./locales/zh";
import { ja } from "./locales/ja";

const DICTS: Record<Locale, HubTranslations> = { en, zh, ja };

function initialLocale(): Locale {
  migrateLegacyLabHubLocaleKey();
  return readWorkspaceUiLocale() ?? detectWorkspaceUiLocale();
}

interface I18nContextValue {
  locale: Locale;
  t: HubTranslations;
  setLocale: (l: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    writeWorkspaceUiLocale(l);
  }, []);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== WORKSPACE_UI_LOCALE_STORAGE_KEY || !e.newValue) return;
      if (!isWorkspaceUiLocale(e.newValue)) return;
      if (e.newValue !== locale) setLocaleState(e.newValue);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [locale]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale;
    document.body.dataset.locale = locale;
    document.title = DICTS[locale].meta.pageTitle;
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, t: DICTS[locale], setLocale }),
    [locale, setLocale]
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

export { LOCALES, LOCALE_META } from "./types";
export type { Locale, HubTranslations };
