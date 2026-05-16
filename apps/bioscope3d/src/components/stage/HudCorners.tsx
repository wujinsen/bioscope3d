import { CreditCard, Ruler, RotateCcw, Sun } from "lucide-react";
import { useT } from "@/i18n/I18nProvider";

export function HudCorners() {
  const t = useT();
  return (
    <>
      <div className="hud-corner hud-tl" title={t.hud.specimen}>
        <CreditCard />
        <span className="h-label">{t.hud.specimen}</span>
        <span className="h-val">#SP-0418 v1.2</span>
      </div>
      <div className="hud-corner hud-tr" title={t.hud.scale}>
        <Ruler />
        <span className="h-label">{t.hud.scale}</span>
        <span className="h-val">0.21 µm</span>
      </div>
      <div className="hud-corner hud-bl" title={t.hud.orbit}>
        <RotateCcw />
        <span className="h-label">{t.hud.orbit}</span>
        <span className="h-val">0.1 rpm</span>
      </div>
      <div className="hud-corner hud-br" title={t.hud.hdri}>
        <Sun />
        <span className="h-label">{t.hud.hdri}</span>
        <span className="h-val">Aurora-7</span>
      </div>
    </>
  );
}
