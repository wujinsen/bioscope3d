import { useId, useMemo, useState } from "react";
import type { DemoId, HubTranslations } from "@/i18n/types";
import { useI18n } from "@/i18n/I18nProvider";
import { LangSwitch } from "@/components/LangSwitch";

const bioscope =
  import.meta.env.VITE_URL_BIOSCOPE3D ?? "http://127.0.0.1:5173";
const stellar =
  import.meta.env.VITE_URL_STELLAR_EXPANSE ?? "http://127.0.0.1:5174";

type DemoCategory = "cells" | "ships" | "robots" | "planets";
type FilterKey = "all" | DemoCategory;

type DemoCore = {
  id: DemoId;
  href?: string;
  category: DemoCategory;
  soon?: boolean;
};

const DEMO_CORE: DemoCore[] = [
  { id: "bioscope3d", href: bioscope, category: "cells" },
  { id: "stellar", href: stellar, category: "ships" },
  { id: "robots", category: "robots", soon: true },
  { id: "planets", category: "planets", soon: true },
];

const FILTER_ORDER: FilterKey[] = [
  "all",
  "cells",
  "ships",
  "robots",
  "planets",
];

function filterLabel(f: HubTranslations["filters"], key: FilterKey): string {
  switch (key) {
    case "all":
      return f.all;
    case "cells":
      return f.cells;
    case "ships":
      return f.ships;
    case "robots":
      return f.robots;
    case "planets":
      return f.planets;
  }
}

function PreviewCells() {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id={`${id}-cellBg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8e6d0" />
          <stop offset="55%" stopColor="#f5f0e4" />
          <stop offset="100%" stopColor="#dce8c8" />
        </linearGradient>
        <radialGradient id={`${id}-nucleus`} cx="40%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#b76ba0" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#6c8a3a" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#6c8a3a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}-cellBg)`} />
      <circle cx="200" cy="150" r="118" fill="none" stroke="#cfc8b6" strokeWidth="1.2" />
      <circle cx="200" cy="150" r="102" fill={`url(#${id}-nucleus)`} />
      <circle cx="200" cy="150" r="38" fill="#faf4e8" stroke="#8d885a" strokeWidth="2" />
      <circle cx="128" cy="118" r="14" fill="#607a8a" fillOpacity="0.35" />
      <circle cx="268" cy="178" r="11" fill="#b54839" fillOpacity="0.28" />
      <ellipse
        cx="245"
        cy="105"
        rx="22"
        ry="10"
        fill="#554f7c"
        fillOpacity="0.2"
        transform="rotate(-18 245 105)"
      />
      <path
        d="M 52 240 Q 120 200 200 220 T 348 232"
        fill="none"
        stroke="#908ab8"
        strokeWidth="1.5"
        strokeOpacity="0.5"
        strokeDasharray="6 5"
      />
    </svg>
  );
}

function PreviewShips() {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id={`${id}-space`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e2a44" />
          <stop offset="100%" stopColor="#0f1524" />
        </linearGradient>
        <linearGradient id={`${id}-hull`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6a8ab8" />
          <stop offset="100%" stopColor="#3d5a80" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}-space)`} />
      <circle cx="60" cy="48" r="1.2" fill="#e8eaef" fillOpacity="0.7" />
      <circle cx="120" cy="72" r="0.9" fill="#e8eaef" fillOpacity="0.5" />
      <circle cx="330" cy="40" r="1" fill="#e8eaef" fillOpacity="0.6" />
      <circle cx="280" cy="220" r="0.8" fill="#e8eaef" fillOpacity="0.45" />
      <circle cx="90" cy="200" r="0.7" fill="#e8eaef" fillOpacity="0.4" />
      <path
        d="M 115 165 L 285 150 L 248 178 L 248 198 L 188 205 L 152 188 Z"
        fill={`url(#${id}-hull)`}
        stroke="#a8c4e8"
        strokeWidth="1.2"
        strokeOpacity="0.5"
      />
      <path d="M 115 165 L 95 158 L 102 172 Z" fill="#4a6fa5" />
      <ellipse
        cx="210"
        cy="176"
        rx="42"
        ry="8"
        fill="none"
        stroke="#908ab8"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
    </svg>
  );
}

function PreviewRobots() {
  const { t } = useI18n();
  const linesH = Array.from({ length: 9 }, (_, i) => (
    <line key={`h${i}`} x1="40" y1={48 + i * 28} x2="360" y2={48 + i * 28} />
  ));
  const linesV = Array.from({ length: 11 }, (_, i) => (
    <line key={`v${i}`} x1={32 + i * 32} y1="40" x2={32 + i * 32} y2="260" />
  ));
  return (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="400" height="300" fill="#ebe4d4" />
      <g stroke="#cfc8b6" strokeWidth="1">
        {linesH}
        {linesV}
      </g>
      <rect
        x="148"
        y="118"
        width="104"
        height="72"
        rx="10"
        fill="#faf4e8"
        stroke="#8a8467"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
      <text
        x="200"
        y="158"
        textAnchor="middle"
        fill="#8a8467"
        fontFamily="JetBrains Mono, monospace"
        fontSize="13"
      >
        {t.graphics.blueprintMark}
      </text>
    </svg>
  );
}

function PreviewPlanets() {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <radialGradient id={`${id}-planet`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#c4a574" />
          <stop offset="55%" stopColor="#8d6a42" />
          <stop offset="100%" stopColor="#5c4328" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="#e8e4dc" />
      <ellipse cx="200" cy="200" rx="140" ry="28" fill="#cfc8b6" fillOpacity="0.35" />
      <circle cx="200" cy="142" r="62" fill={`url(#${id}-planet)`} stroke="#5d5a36" strokeWidth="1.2" />
      <ellipse
        cx="200"
        cy="142"
        rx="88"
        ry="22"
        fill="none"
        stroke="#908ab8"
        strokeOpacity="0.45"
        strokeWidth="2"
        transform="rotate(-12 200 142)"
      />
      <path
        d="M 120 130 Q 200 108 280 134"
        fill="none"
        stroke="#faf4e8"
        strokeOpacity="0.25"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ModelPreview({ category }: { category: DemoCategory }) {
  switch (category) {
    case "cells":
      return <PreviewCells />;
    case "ships":
      return <PreviewShips />;
    case "robots":
      return <PreviewRobots />;
    case "planets":
      return <PreviewPlanets />;
  }
}

export function App() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<FilterKey>("all");

  const allRows = useMemo(
    () => DEMO_CORE.map((c) => ({ ...c, ...t.demos[c.id] })),
    [t]
  );

  const visible = useMemo(() => {
    if (filter === "all") return allRows;
    return allRows.filter((d) => d.category === filter);
  }, [filter, allRows]);

  return (
    <div className="page">
      <div className="bg-texture" aria-hidden />
      <div className="content">
        <header className="topbar">
          <a className="brand" href="/" aria-label={t.brand.homeAria}>
            <span className="brand-mark" aria-hidden>
              Lh
            </span>
            <span className="brand-text">
              <span className="brand-kicker">{t.brand.kicker}</span>
              <span className="brand-name">{t.brand.name}</span>
            </span>
          </a>
          <div className="topbar-tail">
            <LangSwitch />
          </div>
        </header>

        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">{t.hero.title}</h1>
            <p className="hero-hand">{t.hero.hand}</p>
            <p className="hero-lede">{t.hero.lede}</p>
          </div>
        </section>

        <div className="toolbar" role="toolbar" aria-label={t.filters.label}>
          <span className="toolbar-label">{t.filters.label}</span>
          <div className="filter-group">
            {FILTER_ORDER.map((key) => (
              <button
                key={key}
                type="button"
                className="filter-btn"
                aria-pressed={filter === key}
                onClick={() => setFilter(key)}
              >
                {filterLabel(t.filters, key)}
              </button>
            ))}
          </div>
        </div>

        <section aria-labelledby="gallery-title">
          <div className="section-head">
            <h2 id="gallery-title" className="section-title">
              {t.gallery.title}
            </h2>
            <span className="section-count">{t.gallery.countLine(visible.length)}</span>
          </div>

          <ul className="grid">
            {visible.map((d) => (
              <li key={d.id} className="card-wrap">
                {d.soon || !d.href ? (
                  <div className="card card-soon">
                    <div className="model-frame">
                      <ModelPreview category={d.category} />
                    </div>
                    <div className="card-body">
                      <div className="card-tags">
                        <span className="pill pill-soon">{t.pills.comingSoon}</span>
                        <span className="pill">{d.subtitle}</span>
                      </div>
                      <h2>{d.title}</h2>
                      <p>{d.blurb}</p>
                      <div className="card-footer">
                        <span className="cta">{t.cta.waitlist}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <a className="card" href={d.href} rel="noopener noreferrer">
                    <div className="model-frame">
                      <ModelPreview category={d.category} />
                    </div>
                    <div className="card-body">
                      <div className="card-tags">
                        <span className="pill pill-live">{t.pills.available}</span>
                        <span className="pill">{d.subtitle}</span>
                      </div>
                      <h2>{d.title}</h2>
                      <p>{d.blurb}</p>
                      <div className="card-footer">
                        <span className="cta">
                          {t.cta.open}
                          <span className="cta-arrow" aria-hidden>
                            →
                          </span>
                        </span>
                      </div>
                    </div>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
