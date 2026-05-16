import { useState } from "react";
import { ChevronDown, ChevronRight, Heart } from "lucide-react";
import { useAppStore } from "@stores/useAppStore";
import { CELLS, CELL_ORDER } from "@data/cells";
import { ORGANELLES_BY_CELL } from "@data/organelles";
import { useT } from "@/i18n/I18nProvider";

export function SidebarLeft() {
  return (
    <aside className="sidebar-left">
      <CellTypesSection />
      <OrganellesSection />
    </aside>
  );
}

function CellTypesSection() {
  const [open, setOpen] = useState(true);
  const t = useT();
  const activeCell = useAppStore((s) => s.activeCell);
  const setCell = useAppStore((s) => s.setCell);
  const favorites = useAppStore((s) => s.favorites);

  return (
    <section className={`sec${open ? "" : " closed"}`}>
      <div className="sec-head" onClick={() => setOpen(!open)}>
        <span className="title">{t.sidebarLeft.cellTypes}</span>
        <ChevronDown className="ic chev" />
      </div>
      <div className="sec-body">
        {CELL_ORDER.map((id) => {
          const cell = CELLS[id];
          const c = t.cells[id];
          const isActive = activeCell === id;
          const isFav = favorites.includes(id);
          return (
            <a
              key={id}
              className={`cell-item${isActive ? " active" : ""}${isFav ? " favorited" : ""}`}
              style={{ ["--accent" as never]: cell.signatureColor }}
              onClick={(e) => {
                e.preventDefault();
                setCell(id);
              }}
            >
              <span
                className="thumb"
                style={{ backgroundImage: `url('${cell.thumbnail}')` }}
              />
              <div className="meta">
                <div className="name">{c.name}</div>
                <div className="sub">{c.subtype}</div>
              </div>
              <Heart className="heart" />
              <ChevronRight className="ind" />
            </a>
          );
        })}
      </div>
    </section>
  );
}

function OrganellesSection() {
  const [open, setOpen] = useState(true);
  const t = useT();
  const activeCell = useAppStore((s) => s.activeCell);
  const activeOrganelle = useAppStore((s) => s.activeOrganelle);
  const setOrganelle = useAppStore((s) => s.setOrganelle);
  const organelles = ORGANELLES_BY_CELL[activeCell];
  const orgStrings = t.organelles.byCell[activeCell];

  return (
    <section className={`sec${open ? "" : " closed"}`}>
      <div className="sec-head" onClick={() => setOpen(!open)}>
        <span className="title">{t.sidebarLeft.organelles}</span>
        <ChevronDown className="ic chev" />
      </div>
      <div className="sec-body">
        {organelles.map((o) => {
          const s = orgStrings[o.id];
          const name = s?.name ?? o.id;
          return (
            <a
              key={o.id}
              className={`org-item${activeOrganelle === o.id ? " active" : ""}`}
              onClick={() => setOrganelle(o.id)}
            >
              <span className="d" style={{ background: o.color }} />
              <span className="n">{name}</span>
              <span className="c">{o.countLabel}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
