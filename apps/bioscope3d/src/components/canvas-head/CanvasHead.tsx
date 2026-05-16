import { Heart, Eye } from "lucide-react";
import { useAppStore } from "@stores/useAppStore";
import { useT } from "@/i18n/I18nProvider";

export function CanvasHead() {
  const t = useT();
  const activeCell = useAppStore((s) => s.activeCell);
  const c = t.cells[activeCell];

  return (
    <div className="canvas-head">
      <div>
        <Breadcrumb />
        <h1>{c.name}</h1>
        <div className="sub">{c.oneLiner}</div>
      </div>
      <div className="head-right">
        <PipelineBadge />
        <button className="iconbtn" title={t.canvasHead.toggleHud}>
          <Eye className="ic" />
        </button>
        <button className="iconbtn heart-on" title={t.canvasHead.favorite}>
          <Heart className="ic" />
        </button>
      </div>
    </div>
  );
}

function Breadcrumb() {
  const t = useT();
  const activeCell = useAppStore((s) => s.activeCell);
  const tax = t.cells[activeCell].taxonomy;
  return (
    <div className="crumb">
      <span className="dot" />
      <a href="#">{tax[0]}</a>
      <span className="sep">·</span>
      <a href="#">{tax[1]}</a>
      <span className="sep">·</span>
      <span style={{ color: "var(--olive-dk)", fontWeight: 600 }}>{tax[2]}</span>
    </div>
  );
}

function PipelineBadge() {
  const t = useT();
  const open = useAppStore((s) => s.pbrPopoverOpen);
  const toggle = useAppStore((s) => s.togglePbrPopover);
  const pbrEnhanced = useAppStore((s) => s.pbrEnhanced);
  const stageToneMapping = useAppStore((s) => s.stageToneMapping);
  const setPbrEnhanced = useAppStore((s) => s.setPbrEnhanced);
  const setStageToneMapping = useAppStore((s) => s.setStageToneMapping);
  const p = t.canvasHead.pbr;
  const pillLabel = pbrEnhanced ? t.canvasHead.pbrPillRebake : t.canvasHead.pbrPillOriginal;

  return (
    <span
      className={`pill${open ? " open" : ""}`}
      title={t.canvasHead.pbrPillTitle}
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
    >
      <span className="dot" /> {pillLabel}
      <div className="pill-popover">
        <div className="pop-title">{p.title}</div>
        <div className="pop-row"><span>{p.baseColor}</span><span className="v">4096²</span></div>
        <div className="pop-row"><span>{p.normal}</span><span className="v">AI-derived</span></div>
        <div className="pop-row"><span>{p.ao}</span><span className="v">baked 1024 spp</span></div>
        <div className="pop-row"><span>{p.roughness}</span><span className="v">μ=0.42 σ=0.08</span></div>
        <div className="pop-row"><span>{p.metallic}</span><span className="v">μ=0.05</span></div>
        <div className="pop-muted-title">{p.materialResponse}</div>
        <div className="pop-actions">
          <button
            type="button"
            className={pbrEnhanced ? "is-on" : ""}
            onClick={(e) => {
              e.stopPropagation();
              setPbrEnhanced(true);
            }}
          >
            {p.rebake}
          </button>
          <button
            type="button"
            className={!pbrEnhanced ? "is-on" : ""}
            onClick={(e) => {
              e.stopPropagation();
              setPbrEnhanced(false);
            }}
          >
            {p.original}
          </button>
        </div>
        <div className="pop-muted-title">{p.toneLabel}</div>
        <div className="pop-actions">
          <button
            type="button"
            className={stageToneMapping === "neutral" ? "is-on" : ""}
            onClick={(e) => {
              e.stopPropagation();
              setStageToneMapping("neutral");
            }}
          >
            {p.toneNeutral}
          </button>
          <button
            type="button"
            className={stageToneMapping === "aces" ? "is-on" : ""}
            onClick={(e) => {
              e.stopPropagation();
              setStageToneMapping("aces");
            }}
          >
            {p.toneAces}
          </button>
        </div>
      </div>
    </span>
  );
}
