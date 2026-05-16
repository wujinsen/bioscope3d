import { Repeat } from "lucide-react";
import { useAppStore } from "@stores/useAppStore";
import { CELLS } from "@data/cells";
import { useT } from "@/i18n/I18nProvider";
import type { CellId } from "@/types";

export function ComparePanel() {
  const t = useT();
  const [a, b] = useAppStore((s) => s.comparePair);
  const swap = useAppStore((s) => s.swapCompare);

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="name">{t.compare.title}</span>
        <span className="info" title={t.compare.tooltip}>i</span>
      </div>
      <div className="compare">
        <CardA cellId={a} youAreHere />
        <button className="swap" title={t.compare.swap} onClick={swap}>
          <Repeat strokeWidth={1.8} width={15} height={15} />
        </button>
        <CardA cellId={b} />
      </div>
      <button className="compare-open">
        <span className="diff-glyph">
          <i />
          <i />
        </span>
        {t.compare.open}
      </button>
    </div>
  );
}

function CardA({ cellId, youAreHere = false }: { cellId: CellId; youAreHere?: boolean }) {
  const t = useT();
  const cell = CELLS[cellId];
  const c = t.cells[cellId];
  return (
    <div className="card">
      <span className="th" style={{ backgroundImage: `url('${cell.thumbnail}')` }} />
      <div>
        <div className="nm">{c.name}</div>
        <div className="yh">{youAreHere ? t.compare.youAreHere : c.subtype}</div>
      </div>
    </div>
  );
}
