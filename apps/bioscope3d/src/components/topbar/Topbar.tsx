import { useState } from "react";
import {
  LayoutGrid,
  BookOpen,
  Notebook,
  HelpCircle,
  Settings,
  ChevronDown,
  Eye,
  Presentation,
  Microscope,
} from "lucide-react";
import { useAppStore } from "@stores/useAppStore";
import { useT } from "@/i18n/I18nProvider";
import { LangSwitch } from "./LangSwitch";
import type { Mode } from "@/types";

const NAV_TABS = [
  { id: "gallery",   key: "gallery"   as const, icon: LayoutGrid },
  { id: "library",   key: "library"   as const, icon: BookOpen },
  { id: "notebooks", key: "notebooks" as const, icon: Notebook },
  { id: "quiz",      key: "quiz"      as const, icon: HelpCircle, isNew: true },
  { id: "settings",  key: "settings"  as const, icon: Settings },
];

const MODES: { id: Mode; icon: typeof Eye }[] = [
  { id: "explore",  icon: Eye },
  { id: "teach",    icon: Presentation },
  { id: "research", icon: Microscope },
];

export function Topbar() {
  return (
    <header className="topbar">
      <Brand />
      <Nav />
      <ModeSwitch />
      <UserMenu />
    </header>
  );
}

function Brand() {
  const t = useT();
  return (
    <div className="brand">
      <div className="mark" />
      <div>
        <div className="name">
          <em>BioScope</em>3D
        </div>
        <div className="tag">{t.brand.tagline}</div>
      </div>
    </div>
  );
}

function Nav() {
  const t = useT();
  const [active, setActive] = useState("gallery");
  return (
    <nav className="nav">
      {NAV_TABS.map(({ id, key, icon: Icon, isNew }) => (
        <a
          key={id}
          className={`nav-item${active === id ? " active" : ""}`}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActive(id);
          }}
        >
          <Icon className="ico" />
          {t.nav[key]}
          {isNew && <span className="new-dot" aria-label="new" />}
        </a>
      ))}
    </nav>
  );
}

function ModeSwitch() {
  const t = useT();
  const mode = useAppStore((s) => s.mode);
  const setMode = useAppStore((s) => s.setMode);
  return (
    <div className="mode-switch" role="tablist" aria-label="View Mode">
      {MODES.map(({ id, icon: Icon }) => {
        const m = t.mode[id];
        return (
          <button
            key={id}
            className={mode === id ? "on" : ""}
            title={m.title}
            onClick={() => setMode(id)}
            role="tab"
            aria-selected={mode === id}
          >
            <Icon strokeWidth={1.8} />
            {m.label}
          </button>
        );
      })}
    </div>
  );
}

function UserMenu() {
  return (
    <div className="user-cluster">
      <LangSwitch />
      <div className="user">
        <div className="avatar" />
        <ChevronDown className="ic chev" />
      </div>
    </div>
  );
}
