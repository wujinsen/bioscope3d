import {
  Ruler,
  RotateCw,
  Eye,
  EyeOff,
  RefreshCcw,
  Camera,
  ClipboardCheck,
  Boxes,
  CircleDashed,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useAppStore } from "@stores/useAppStore";
import { useT } from "@/i18n/I18nProvider";
import { captureStage } from "@/lib/screenshot";
import { CELLS } from "@data/cells";

export function StageToolbar() {
  const t = useT();
  const openExport = useAppStore((s) => s.openExport);
  const toggleTour = useAppStore((s) => s.toggleTouring);
  const resetCamera = useAppStore((s) => s.resetCamera);
  const toggleCinema = useAppStore((s) => s.toggleCinema);
  const cinema = useAppStore((s) => s.cinema);
  const activeCell = useAppStore((s) => s.activeCell);

  const tb = t.toolbar;
  const tt = t.toolbar.titles;

  function onScreenshot() {
    if (!CELLS[activeCell].modelPath) {
      // Flat hero image — user-agent can save it via right-click.
      // Keep the action silent; future toast will surface t.screenshot.notAvailable.
      return;
    }
    captureStage(activeCell);
  }

  return (
    <div className="stage-toolbar">
      <button className="tool-btn tool-measure" title={tt.measure}>
        <Ruler />
        {tb.measure}
      </button>
      <span className="sep" />

      <button className="tool-btn" title={tt.rotate}>
        <RotateCw />
        {tb.rotate}
      </button>
      <button className="tool-btn" title={tt.isolate}>
        <CircleDashed />
        {tb.isolate}
      </button>
      <button className="tool-btn" title={tt.hideOthers}>
        <EyeOff />
        {tb.hideOthers}
      </button>
      <button className="tool-btn" title={tt.reset} onClick={resetCamera}>
        <RefreshCcw />
        {tb.reset}
      </button>

      <span className="sep" />
      <button className="tool-btn" title={tt.screenshot} onClick={onScreenshot}>
        <Camera />
        {tb.screenshot}
      </button>
      <button
        className={`tool-btn${cinema ? " active" : ""}`}
        title={tt.cinema}
        aria-pressed={cinema}
        onClick={toggleCinema}
      >
        {cinema ? <Minimize2 /> : <Maximize2 />}
        {cinema ? tb.cinemaOff : tb.cinema}
      </button>
      <button
        className="tool-btn tool-author primary"
        title={tt.authorTour}
        onClick={toggleTour}
      >
        <ClipboardCheck />
        {tb.authorTour}
      </button>
      <button
        className="tool-btn tool-export primary"
        title={tt.export}
        onClick={openExport}
      >
        <Boxes />
        {tb.export}
      </button>

      {/* Eye kept as side effect to keep lucide tree-shake honest */}
      <Eye style={{ display: "none" }} />
    </div>
  );
}
