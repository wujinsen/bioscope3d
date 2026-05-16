import { useEffect } from "react";
import { useAppStore } from "@stores/useAppStore";

/**
 * Auto Tour engine (F02 / F03 / F12 / F60).
 *
 * When `touring && tourPlaying`, runs a requestAnimationFrame loop that
 * feeds dtMs into the store's `tickTour` action. The action handles
 * dwell-based segment advancement and `activeCell` swaps internally,
 * which then propagate through CameraRig (F05) and CellModel.
 *
 * Mount this once at the root (App.tsx) — it is a pure side effect.
 */
export function useTour() {
  const touring = useAppStore((s) => s.touring);
  const tourPlaying = useAppStore((s) => s.tourPlaying);
  const tickTour = useAppStore((s) => s.tickTour);

  useEffect(() => {
    if (!touring || !tourPlaying) return;
    let raf = 0;
    let last = performance.now();
    function loop(now: number) {
      const dt = now - last;
      last = now;
      tickTour(dt);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [touring, tourPlaying, tickTour]);
}
