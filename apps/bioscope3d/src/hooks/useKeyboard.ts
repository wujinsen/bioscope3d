import { useHotkeys } from "react-hotkeys-hook";
import { useAppStore } from "@stores/useAppStore";
import { CELL_ORDER } from "@data/cells";

/**
 * Global keyboard layer.
 *
 *  Cells & UI
 *  ─────────
 *  1–7 ............... switch cell type (F09)
 *  L   ............... toggle labels
 *  X   ............... toggle cross-section (F25)
 *  E   ............... open export drawer
 *  Esc ............... close drawer / leave cinema mode
 *
 *  Camera (3D)
 *  ───────────
 *  R   ............... reset camera to current cell's preset (F23)
 *  F   ............... toggle Cinema mode — full-screen 3D, no chrome (F08)
 *  F1  ............... toggle idle auto-rotate
 *  F2  ............... toggle bloom / post-processing (top-row F2 key, not digit 2;
 *                       on Mac sometimes Fn+F2, or enable standard F-keys)
 *
 *  Tripo / glTF sparkle bisection (session only; excluded from persisted state)

 *  Alt+Shift+1 ....... toggle IBL / Environment entirely off vs on

 *  Alt+Shift+2 ....... strip normal (+ bump) maps on loaded GLB materials

 *  Alt+Shift+3 ....... force matte-ish BRDF locally (full roughness; no metals; kill env boosts)

 *  Alt+Shift+4 ....... clearcoat + clearcoat normal off on MeshPhysicalMaterials

 *  Alt+Shift+0 ....... reset all Tripo-debug toggles above
 *
 *  Auto Tour (F02 / F12 / F17 / F18)
 *  ─────────────────────────────────
 *  Space ............. enter / leave Auto Tour mode
 *  K     ............. play / pause within Auto Tour
 *  ← / →  ............ previous / next segment
 */
export function useGlobalHotkeys() {
  const setCell            = useAppStore((s) => s.setCell);
  const toggleLabels       = useAppStore((s) => s.toggleLabels);
  const toggleCrossSection = useAppStore((s) => s.toggleCrossSection);
  const toggleTouring      = useAppStore((s) => s.toggleTouring);
  const toggleTourPlay     = useAppStore((s) => s.toggleTourPlay);
  const jumpTourTo         = useAppStore((s) => s.jumpTourTo);
  const openExport         = useAppStore((s) => s.openExport);
  const closeExport        = useAppStore((s) => s.closeExport);
  const toggleAutoRotate   = useAppStore((s) => s.toggleAutoRotate);
  const togglePostFx       = useAppStore((s) => s.togglePostFx);
  const resetCamera        = useAppStore((s) => s.resetCamera);
  const toggleCinema       = useAppStore((s) => s.toggleCinema);

  CELL_ORDER.forEach((cellId, idx) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useHotkeys(String(idx + 1), () => setCell(cellId), { preventDefault: true });
  });
  useHotkeys("l", toggleLabels, { preventDefault: true });
  useHotkeys("x", toggleCrossSection, { preventDefault: true });
  useHotkeys("space", (e) => { e.preventDefault(); toggleTouring(); });
  useHotkeys("k", (e) => { e.preventDefault(); toggleTourPlay(); });
  useHotkeys("left",  (e) => {
    e.preventDefault();
    const s = useAppStore.getState();
    if (s.touring) jumpTourTo(s.tourIndex - 1);
  });
  useHotkeys("right", (e) => {
    e.preventDefault();
    const s = useAppStore.getState();
    if (s.touring) jumpTourTo(s.tourIndex + 1);
  });
  useHotkeys("e", openExport, { preventDefault: true });
  useHotkeys("esc", () => {
    const s = useAppStore.getState();
    if (s.exportDrawerOpen) closeExport();
    else if (s.cinema) toggleCinema();
    else if (s.touring) toggleTouring();
  });

  useHotkeys("f1", (e) => { e.preventDefault(); toggleAutoRotate(); });
  useHotkeys("f2", (e) => { e.preventDefault(); togglePostFx(); });
  useHotkeys("r", resetCamera, { preventDefault: true });
  useHotkeys("f", (e) => { e.preventDefault(); toggleCinema(); });

  useHotkeys("alt+shift+1", (e) => {
    e.preventDefault();
    useAppStore.getState().toggleTripoDebugFlag("iblOff");
  });
  useHotkeys("alt+shift+2", (e) => {
    e.preventDefault();
    useAppStore.getState().toggleTripoDebugFlag("noNormalMaps");
  });
  useHotkeys("alt+shift+3", (e) => {
    e.preventDefault();
    useAppStore.getState().toggleTripoDebugFlag("matteForced");
  });
  useHotkeys("alt+shift+4", (e) => {
    e.preventDefault();
    useAppStore.getState().toggleTripoDebugFlag("clearcoatZero");
  });
  useHotkeys("alt+shift+0", (e) => {
    e.preventDefault();
    useAppStore.getState().resetTripoDebug();
  });
}
