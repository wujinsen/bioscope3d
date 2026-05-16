import { useEffect, useRef, useState } from "react";
import { useI18n, LOCALES, LOCALE_META } from "@/i18n/I18nProvider";

function GlobeIcon() {
  return (
    <svg
      className="ic-globe"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
export function LangSwitch() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const meta = LOCALE_META[locale];

  return (
    <div className={`lang-switch${open ? " open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="lang-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.langSwitch.label}
        title={t.langSwitch.label}
        onClick={() => setOpen((o) => !o)}
      >
        <GlobeIcon />
        <span className="lang-short">{meta.short}</span>
      </button>

      {open && (
        <div className="lang-pop" role="listbox" aria-label={t.langSwitch.label}>
          <div className="lang-pop-curl" aria-hidden />
          <div className="lang-pop-head">
            <span className="lang-pop-title">{t.langSwitch.label}</span>
          </div>
          <ul>
            {LOCALES.map((id) => {
              const m = LOCALE_META[id];
              const active = id === locale;
              return (
                <li key={id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={`lang-row${active ? " on" : ""}`}
                    onClick={() => {
                      setLocale(id);
                      setOpen(false);
                    }}
                  >
                    <span className="lang-glyph">{m.short}</span>
                    <span className="lang-native">{m.native}</span>
                    {active && (
                      <span className="lang-tick" aria-hidden>
                        ✦
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
