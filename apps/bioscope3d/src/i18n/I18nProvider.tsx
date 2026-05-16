import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import {
  detectWorkspaceUiLocale,
  isWorkspaceUiLocale,
  readWorkspaceUiLocale,
  WORKSPACE_UI_LOCALE_STORAGE_KEY,
} from "@bioscope3d/workspace-ui-locale";
import { useAppStore } from "@stores/useAppStore";
import { LOCALES, LOCALE_META, type Locale, type Translations } from "./types";
import { en } from "./locales/en";
import { zh } from "./locales/zh";
import { ja } from "./locales/ja";

const DICTS: Record<Locale, Translations> = { en, zh, ja };

interface I18nContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (l: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);
  const localeInitialized = useAppStore((s) => s.localeInitialized);

  useEffect(() => {
    if (!localeInitialized) {
      setLocale(readWorkspaceUiLocale() ?? detectWorkspaceUiLocale());
    }
  }, [localeInitialized, setLocale]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== WORKSPACE_UI_LOCALE_STORAGE_KEY || !e.newValue) return;
      if (!isWorkspaceUiLocale(e.newValue)) return;
      if (e.newValue !== useAppStore.getState().locale) {
        useAppStore.getState().setLocale(e.newValue);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.body.dataset.locale = locale;
    }
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, t: DICTS[locale], setLocale }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

export function useT(): Translations {
  return useI18n().t;
}

export { LOCALES, LOCALE_META };
export type { Locale, Translations };
