import { useAppStore } from "@stores/useAppStore";
import { calloutsFor } from "@data/organelles";
import { useT } from "@/i18n/I18nProvider";

export function Callouts() {
  const t = useT();
  const activeCell = useAppStore((s) => s.activeCell);
  const setOrganelle = useAppStore((s) => s.setOrganelle);
  const callouts = calloutsFor(activeCell);
  const orgStrings = t.organelles.byCell[activeCell];

  return (
    <div className="callouts" aria-hidden={false}>
      <svg
        className="lines"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {callouts.map((c) => (
          <g key={c.organelle}>
            <path
              d={`M ${c.anchorPos[0]} ${c.anchorPos[1]} Q ${
                (c.anchorPos[0] + c.targetPos[0]) / 2
              } ${(c.anchorPos[1] + c.targetPos[1]) / 2 - 4} ${c.targetPos[0]} ${
                c.targetPos[1]
              }`}
            />
            <circle className="anchor" cx={c.anchorPos[0]} cy={c.anchorPos[1]} r="0.7" />
            <circle className="target" cx={c.targetPos[0]} cy={c.targetPos[1]} r="1.1" />
          </g>
        ))}
      </svg>
      {callouts.map((c) => {
        const name = orgStrings[c.organelle]?.name ?? c.label;
        return (
          <div
            key={c.organelle}
            className="callout-label"
            style={{ left: `${c.labelPos[0]}%`, top: `${c.labelPos[1]}%` }}
            onClick={() => setOrganelle(c.organelle)}
          >
            {name}
            {c.sub && <span className="sub">{c.sub}</span>}
          </div>
        );
      })}
    </div>
  );
}
