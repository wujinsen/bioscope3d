import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { Ship } from "./data/ships";
import { SHIPS } from "./data/ships";
import { HunyuanViewer } from "./HunyuanViewer";
import {
  WORKSPACE_UI_LOCALES,
  type WorkspaceUiLocale,
} from "@bioscope3d/workspace-ui-locale";
import { formatCredits, STELLAR_CHROME } from "./shipChrome";
import { useWorkspaceUiLocale } from "./useWorkspaceUiLocale";

const LOCALE_CHIP: Record<WorkspaceUiLocale, string> = {
  en: "EN",
  zh: "中",
  ja: "日",
};

function Wing({ mirror }: { mirror?: boolean }) {
  return (
    <svg
      className={`wing${mirror ? " mirror" : ""}`}
      viewBox="0 0 52 32"
      aria-hidden
    >
      <g fill="currentColor">
        <rect x="0" y="6" width="22" height="3" rx="1.5" opacity="0.95" />
        <rect x="0" y="14.5" width="16" height="3" rx="1.5" opacity="0.88" />
        <rect x="0" y="23" width="10" height="3" rx="1.5" opacity="0.78" />
        <path
          d="M52 16 L30 2 L26 12 L40 16 L26 20 L30 30 Z"
          opacity="0.92"
        />
        <path d="M46 16 L36 9 L34 13 L42 16 L34 19 L36 23 Z" opacity="0.5" />
      </g>
    </svg>
  );
}

function ClassWingMark() {
  return (
    <svg className="class-wing-mark" viewBox="0 0 28 18" aria-hidden>
      <g fill="currentColor">
        <rect x="0" y="2" width="12" height="2.2" rx="1.1" opacity="0.95" />
        <rect x="0" y="7.5" width="9" height="2.2" rx="1.1" opacity="0.85" />
        <rect x="0" y="13" width="6" height="2.2" rx="1.1" opacity="0.75" />
        <path d="M28 9 L16 1 L14 7 L20 9 L14 11 L16 17 Z" opacity="0.9" />
      </g>
    </svg>
  );
}

function StatBlock({ ship }: { ship: Ship }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const fills = root.querySelectorAll<HTMLElement>(".fill");
    fills.forEach((el) => {
      el.style.width = "0%";
    });
    requestAnimationFrame(() => {
      fills.forEach((el) => {
        const t = el.dataset.target;
        if (t) el.style.width = `${t}%`;
      });
    });
  }, [ship]);

  return (
    <div className="stats-block" ref={rootRef}>
      {ship.bars.map((b, idx) => (
        <div className="stat" key={b.label}>
          <div className="row">
            <span>{b.label}</span>
            <span>{b.value}</span>
          </div>
          <div className="track">
            <div
              className="fill"
              data-target={String(b.pct)}
              style={{
                background: b.color,
                animationDelay: `${idx * 0.38}s`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkspaceLocaleBar({
  active,
  onChange,
  toolbarAria,
  className,
}: {
  active: WorkspaceUiLocale;
  onChange: (l: WorkspaceUiLocale) => void;
  toolbarAria: string;
  className?: string;
}) {
  return (
    <div
      className={["locale-bar", className].filter(Boolean).join(" ")}
      role="toolbar"
      aria-label={toolbarAria}
    >
      {WORKSPACE_UI_LOCALES.map((id) => (
        <button
          key={id}
          type="button"
          className={`locale-chip${id === active ? " on" : ""}`}
          aria-pressed={id === active}
          onClick={() => onChange(id)}
        >
          {LOCALE_CHIP[id]}
        </button>
      ))}
    </div>
  );
}

export function App() {
  const [uiLocale, setUiLocale] = useWorkspaceUiLocale();
  const t = STELLAR_CHROME[uiLocale];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const ship = SHIPS[selectedIndex];

  const applyShip = useCallback((i: number) => {
    setSelectedIndex(i);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      const m = /^Digit([1-9])$/.exec(e.code);
      if (m) {
        const idx = Number(m[1]) - 1;
        if (idx < SHIPS.length) applyShip(idx);
        return;
      }
      if (e.code === "ArrowRight") {
        e.preventDefault();
        setSelectedIndex((j) => (j + 1) % SHIPS.length);
      }
      if (e.code === "ArrowLeft") {
        e.preventDefault();
        setSelectedIndex((j) => (j - 1 + SHIPS.length) % SHIPS.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [applyShip]);

  const carouselGrid: CSSProperties = {
    gridTemplateColumns: `repeat(${SHIPS.length}, 1fr)`,
  };

  return (
    <div className="app">
      <div className="app-shell">
        <div className="shell-head">
          <div className="shell-head-spacer" aria-hidden />
          <header className="masthead" aria-label={t.productMastheadAria}>
            <Wing mirror />
            <div className="title-bar">
              <h1>STELLAR EXPANSE</h1>
            </div>
            <Wing />
          </header>
          <div className="shell-head-locale">
            <WorkspaceLocaleBar
              active={uiLocale}
              onChange={setUiLocale}
              toolbarAria={t.languageToolbar}
            />
          </div>
        </div>

        <div className="main">
          <div className="viewer-wrap" aria-label={t.shipPreviewAria}>
            <div className="viewer-sky-shift" aria-hidden />
            <div className="viewer-stage">
              <HunyuanViewer modelUrl={ship.modelPath} />
            </div>
            <div className="viewer-floor" aria-hidden />
            <span className="cursor-hint" aria-hidden />
          </div>

          <aside className="sidebar" aria-label={t.shipDetailsAria}>
            <div className="sb-head">
              <span className="radio-dot" aria-hidden />
              <div>
                <div className="lbl">{t.selectedShip}</div>
                <div className="name">{ship.name}</div>
              </div>
            </div>
            <img
              className="sb-thumb"
              src={ship.image}
              alt=""
              decoding="async"
              style={{ objectPosition: ship.thumbPos }}
            />
            <div className="meta">
              <div>
                <strong>{t.manufacturer}</strong>{" "}
                <span>{ship.manufacturer}</span>
              </div>
              <div className="meta-class-row">
                <strong>{t.classLabel}</strong>
                <span className="meta-class-value">
                  <span>{ship.cls}</span>
                  <ClassWingMark />
                </span>
              </div>
              <div>
                <strong>{t.role}</strong> <span>{ship.role}</span>
              </div>
            </div>
            <StatBlock ship={ship} />
            <div className="commerce">
              <div className="cost" aria-live="polite">
                <span className="cost-muted">{t.costMutedLabel}</span>{" "}
                <span className="cost-num">
                  {formatCredits(ship.cost, uiLocale)}
                </span>{" "}
                <span className="cost-credits">{t.credits}</span>
              </div>
              <div className="compare">{ship.compare}</div>
            </div>
            <button type="button" className="confirm">
              {t.confirm}
            </button>
          </aside>
        </div>

        <nav
          className="carousel"
          style={carouselGrid}
          aria-label={t.carouselAria}
        >
          {SHIPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`card${i === selectedIndex ? " active" : ""}`}
              aria-pressed={i === selectedIndex}
              aria-label={`${i + 1}. ${s.name}`}
              style={{ "--thumb-pos": s.thumbPos } as CSSProperties}
              onClick={() => applyShip(i)}
            >
              <img src={s.image} alt="" decoding="async" />
              <div className="nm">{s.name}</div>
            </button>
          ))}
        </nav>
      </div>

      <footer className="app-foot" aria-label={t.footAria}>
        <span>
          <kbd>1</kbd>
          <span className="kbd-dash">–</span>
          <kbd>{SHIPS.length}</kbd> {t.footQuick}
        </span>
        <span className="dot" aria-hidden />
        <span>
          <kbd>←</kbd> <kbd>→</kbd> {t.footCycle}
        </span>
        <span className="dot" aria-hidden />
        <span>{t.footRef}</span>
      </footer>
    </div>
  );
}
