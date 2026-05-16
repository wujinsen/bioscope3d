import { useAppStore } from "@stores/useAppStore";
import { CELLS } from "@data/cells";
import { CellStageSlide } from "./CellStageSlide";
import { useT } from "@/i18n/I18nProvider";
import { PostIt } from "./PostIt";
import { Callouts } from "./Callouts";
import { ViewModePanel } from "./ViewModePanel";
import { HudCorners } from "./HudCorners";
import { ScaleBar } from "./ScaleBar";
import { StageToolbar } from "./StageToolbar";
import { TourBar } from "./TourBar";
import { PostFxToast } from "./PostFxToast";
import { TripoDebugHud } from "./TripoDebugHud";
import { ExportDrawer } from "./ExportDrawer";

export function Stage() {
  const t = useT();
  const activeCell = useAppStore((s) => s.activeCell);
  const cell = CELLS[activeCell];
  const cellName = t.cells[activeCell].name;

  const hasModel = Boolean(cell.modelPath);
  const paperFallback = cell.stageFallback === "paper";
  const showHero = !hasModel && !paperFallback;

  return (
    <div className={`stage${hasModel || paperFallback ? " stage--solid-backdrop" : ""}`}>
      {/* Hero watercolor: full-bleed fallback for cells without a GLB. When a GLB
          mounts, skip the image so the stage paper matches the app shell (--bg). */}
      {showHero ? (
        <img className="hero" src={cell.heroScene} alt={`${cellName} cross-section`} />
      ) : null}
      {hasModel && cell.modelPath ? (
        <CellStageSlide activeCell={activeCell} src={cell.modelPath} />
      ) : null}
      <div className="vignette" />

      <Callouts />
      <PostIt />
      <HudCorners />
      <ViewModePanel />
      <ScaleBar />
      <TourBar />
      <PostFxToast />
      <TripoDebugHud />
      <ExportDrawer />
      <StageToolbar />
    </div>
  );
}
