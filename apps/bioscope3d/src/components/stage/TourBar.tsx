import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import { useT } from "@/i18n/I18nProvider";
import { useAppStore } from "@stores/useAppStore";
import { CELL_ORDER, CELLS } from "@data/cells";

/**
 * Live tour HUD bar.
 *
 *   ◀  ⏸/▶  ▮▮▮▮▮▮▮  ✕     ← timecode runs in the left label
 *   │  │    │       │
 *   │  │    │       └── exit tour
 *   │  │    └────────── 7 segment dots; click any to jump
 *   │  └─────────────── play / pause toggle
 *   └────────────────── previous segment
 *
 * All values come from the store; the parent App.tsx mounts useTour()
 * which advances tourIndex / tourElapsedMs over time.
 */
export function TourBar() {
  const t = useT();
  const tourIndex = useAppStore((s) => s.tourIndex);
  const tourElapsedMs = useAppStore((s) => s.tourElapsedMs);
  const tourPlaying = useAppStore((s) => s.tourPlaying);
  const jumpTourTo = useAppStore((s) => s.jumpTourTo);
  const toggleTourPlay = useAppStore((s) => s.toggleTourPlay);
  const stopTour = useAppStore((s) => s.stopTour);

  const currentCellId = CELL_ORDER[tourIndex];
  const dwellSec = CELLS[currentCellId].dwellSeconds;
  const elapsedSec = tourElapsedMs / 1000;
  const progress = Math.min(1, elapsedSec / dwellSec);

  return (
    <div className="tour-bar" role="region" aria-label={t.toolbar.titles.authorTour}>
      <button
        className="tb-ctl"
        title={t.tour.prev}
        aria-label={t.tour.prev}
        onClick={() => jumpTourTo(tourIndex - 1)}
      >
        <ChevronLeft />
      </button>

      <button
        className="tb-ctl tb-play"
        title={tourPlaying ? t.tour.pause : t.tour.play}
        aria-label={tourPlaying ? t.tour.pause : t.tour.play}
        onClick={toggleTourPlay}
      >
        {tourPlaying ? <Pause /> : <Play />}
      </button>

      <span className="label tb-status">
        {t.tour.cellOf(tourIndex + 1, CELL_ORDER.length)}
        <span className="tb-sep">·</span>
        {t.tour.timecode(elapsedSec, dwellSec)}
      </span>

      <div className="track">
        <div className="fill" style={{ width: `${progress * 100}%` }} />
        <div className="dots">
          {CELL_ORDER.map((cellId, i) => (
            <button
              key={cellId}
              type="button"
              className={i === tourIndex ? "current" : ""}
              title={t.tour.jumpToTitle(t.cells[cellId].name)}
              aria-label={t.tour.jumpToTitle(t.cells[cellId].name)}
              aria-current={i === tourIndex ? "step" : undefined}
              onClick={() => jumpTourTo(i)}
            />
          ))}
        </div>
      </div>

      <button
        className="tb-ctl"
        title={t.tour.next}
        aria-label={t.tour.next}
        onClick={() => jumpTourTo(tourIndex + 1)}
      >
        <ChevronRight />
      </button>

      <button
        className="tb-ctl tb-exit"
        title={t.tour.exit}
        aria-label={t.tour.exit}
        onClick={stopTour}
      >
        <X />
      </button>
    </div>
  );
}
