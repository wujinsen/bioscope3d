import { useState } from "react";
import { Circle, Layers, Dot } from "lucide-react";
import { useAppStore } from "@stores/useAppStore";
import { useT } from "@/i18n/I18nProvider";

type ShadingMode = "solid" | "layered" | "point";

export function ViewModePanel() {
  const t = useT();
  const [shading, setShading] = useState<ShadingMode>("solid");
  const labelsOn = useAppStore((s) => s.labelsVisible);
  const toggleLabels = useAppStore((s) => s.toggleLabels);
  const xsOn = useAppStore((s) => s.crossSectionOn);
  const toggleXs = useAppStore((s) => s.toggleCrossSection);
  const vm = t.viewMode;

  return (
    <div className="view-mode">
      <div className="lbl">{vm.title}</div>
      <div className="toggle-grp">
        <button
          className={shading === "solid" ? "on" : ""}
          title={vm.solid}
          onClick={() => setShading("solid")}
        >
          <Circle className="ic" />
        </button>
        <button
          className={shading === "layered" ? "on" : ""}
          title={vm.layered}
          onClick={() => setShading("layered")}
        >
          <Layers className="ic" />
        </button>
        <button
          className={shading === "point" ? "on" : ""}
          title={vm.point}
          onClick={() => setShading("point")}
        >
          <Dot className="ic" />
        </button>
      </div>
      <div className="row">
        <span>{vm.labels}</span>
        <span className={`switch${labelsOn ? " on" : ""}`} onClick={toggleLabels} />
      </div>
      <div className="row">
        <span>{vm.crossSection}</span>
        <span className={`switch${xsOn ? " on" : ""}`} onClick={toggleXs} />
      </div>
    </div>
  );
}
