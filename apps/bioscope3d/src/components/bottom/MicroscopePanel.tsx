import { useAppStore } from "@stores/useAppStore";
import { CELLS } from "@data/cells";
import { useT } from "@/i18n/I18nProvider";

const VARIANTS = [
  { key: "light"   as const, filter: "brightness(1.05) saturate(1.1)" },
  { key: "stained" as const, filter: "saturate(1.6) hue-rotate(-10deg)" },
  { key: "electron"as const, filter: "grayscale(1) contrast(1.4)" },
];

export function MicroscopePanel() {
  const t = useT();
  const activeCell = useAppStore((s) => s.activeCell);
  const thumb = CELLS[activeCell].thumbnail;

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="name">{t.microscope.title}</span>
        <span className="info" title={t.microscope.tooltip}>i</span>
      </div>
      <div className="micro-thumbs">
        {VARIANTS.map((v) => (
          <div
            key={v.key}
            className="thumb"
            style={{ backgroundImage: `url('${thumb}')`, filter: v.filter }}
          >
            <div className="cap">{t.microscope[v.key]}</div>
          </div>
        ))}
        <div className="thumb add">{t.microscope.addImage}</div>
      </div>
    </div>
  );
}
