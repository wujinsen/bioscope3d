import { Heart, Info } from "lucide-react";
import { useAppStore } from "@stores/useAppStore";
import { ORGANELLES_BY_CELL } from "@data/organelles";
import { useT } from "@/i18n/I18nProvider";

export function SidebarRight() {
  return (
    <aside className="sidebar-right">
      <OrganelleDetails />
      <BiologicalNotes />
      <WhereItOccurs />
    </aside>
  );
}

function OrganelleDetails() {
  const t = useT();
  const activeCell = useAppStore((s) => s.activeCell);
  const activeOrganelle = useAppStore((s) => s.activeOrganelle);
  const organelles = ORGANELLES_BY_CELL[activeCell];
  const o = organelles.find((x) => x.id === activeOrganelle) ?? organelles[0];
  const s = t.organelles.byCell[activeCell][o.id];

  return (
    <div className="panel org-detail">
      <div className="panel-head">
        <span className="name">{t.sidebarRight.organelleDetails}</span>
        <span className="heart filled">
          <Heart fill="currentColor" />
        </span>
      </div>
      <div className="org-hero">
        <div className="av" />
        <div>
          <div className="nm">{s?.name ?? o.id}</div>
          <div className="yh">{t.sidebarRight.nucleusEpithet}</div>
        </div>
      </div>
      <div className="org-data">
        <div className="row">
          <span className="k">{t.sidebarRight.rows.size}</span>
          <span className="v mono">{s?.size ?? "—"}</span>
        </div>
        <div className="row">
          <span className="k">{t.sidebarRight.rows.location}</span>
          <span className="v">{s?.location ?? "—"}</span>
        </div>
        <div className="row">
          <span className="k">{t.sidebarRight.rows.visibleInLM}</span>
          <span className="v">{o.visibleInLM ? t.sidebarRight.yes : t.sidebarRight.no}</span>
        </div>
        <div className="row">
          <span className="k">{t.sidebarRight.rows.label}</span>
          <span className="switch on" />
        </div>
      </div>
    </div>
  );
}

function BiologicalNotes() {
  const t = useT();
  const activeCell = useAppStore((s) => s.activeCell);
  const activeOrganelle = useAppStore((s) => s.activeOrganelle);
  const organelles = ORGANELLES_BY_CELL[activeCell];
  const o = organelles.find((x) => x.id === activeOrganelle) ?? organelles[0];
  const s = t.organelles.byCell[activeCell][o.id];
  const fact = s?.funFact ?? t.sidebarRight.funFactFallback;

  return (
    <div className="panel notes">
      <div className="panel-head">
        <span className="name">{t.sidebarRight.biologicalNotes}</span>
        <span className="info" title={t.sidebarRight.aboutNotes}>
          <Info className="ic-sm" />
        </span>
      </div>
      <p>{s?.description}</p>
      <div className="fun">
        <span className="star">✦</span>
        <span>{t.sidebarRight.funFact} &mdash; {fact}</span>
      </div>
    </div>
  );
}

function WhereItOccurs() {
  const t = useT();
  return (
    <div className="panel occurs">
      <div className="panel-head">
        <span className="name">{t.sidebarRight.whereItOccurs}</span>
      </div>
      <div className="scene">
        <img src="/assets/scenes/where_tree.png" alt={t.sidebarRight.leafTreeAlt} />
        <div className="marker" title={t.sidebarRight.plantInLeafTitle}>
          <svg className="ic-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
            <circle cx="12" cy="12" r="3" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>
        <div className="play">
          <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
