import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import {
  TRIPO_DEBUG_INITIAL,
  type CellId,
  type HdriPreset,
  type Mode,
  type OrganelleId,
  type StageToneMapping,
  type TripoDebugFlags,
  type TripoMaterialProbe,
} from "@/types";
import {
  readWorkspaceUiLocale,
  writeWorkspaceUiLocale,
} from "@bioscope3d/workspace-ui-locale";
import type { Locale } from "@/i18n/types";
import { CELL_ORDER, CELLS } from "@data/cells";

interface AppStore {
  /* state */
  mode: Mode;
  activeCell: CellId;
  activeOrganelle: OrganelleId | null;
  favorites: CellId[];
  labelsVisible: boolean;
  crossSectionOn: boolean;
  postItDismissed: boolean;
  exportDrawerOpen: boolean;
  touring: boolean;
  pbrPopoverOpen: boolean;
  comparePair: [CellId, CellId];

  /* v0.2 — 3D scene state */
  hdriPreset: HdriPreset;
  autoRotate: boolean;
  pbrEnhanced: boolean;
  postFxEnabled: boolean;
  /** Matches model-viewer "neutral" vs cinematic ACES on the Canvas renderer. */
  stageToneMapping: StageToneMapping;
  /** Increment to trigger a one-shot camera reset (consumed by CameraRig). */
  cameraResetTick: number;

  /* v0.3 — i18n */
  locale: Locale;
  /** True once the user (or auto-detect) has set a locale at least once. */
  localeInitialized: boolean;

  /* v0.4 — Auto Tour state machine (F02/03/12/17–19/60) */
  /** Current tour segment index (into `CELL_ORDER`). */
  tourIndex: number;
  /** Elapsed time within the current segment, in milliseconds. */
  tourElapsedMs: number;
  /** Whether the tour is auto-advancing right now (false = paused). */
  tourPlaying: boolean;

  /* v0.4 — Cinema mode (F08) */
  cinema: boolean;

  /* v0.4 — Screenshot trigger (F28). Incremented to request one capture. */
  screenshotTick: number;

  /** Bisect sparkle on Tripo glTF meshes — session only (excluded from persist). */
  tripoDebug: TripoDebugFlags;

  /** Last GLB introspection — session only (see probeTripoMaterials). */
  tripoMaterialProbe: TripoMaterialProbe | null;

  /* actions */
  setMode: (m: Mode) => void;
  setCell: (c: CellId) => void;
  setOrganelle: (o: OrganelleId | null) => void;
  toggleFavorite: (c: CellId) => void;
  setLabels: (on: boolean) => void;
  toggleLabels: () => void;
  setCrossSection: (on: boolean) => void;
  toggleCrossSection: () => void;
  dismissPostIt: () => void;
  openExport: () => void;
  closeExport: () => void;
  toggleTouring: () => void;
  togglePbrPopover: () => void;
  swapCompare: () => void;

  setHdriPreset: (p: HdriPreset) => void;
  toggleAutoRotate: () => void;
  togglePbrEnhanced: () => void;
  setPbrEnhanced: (on: boolean) => void;
  togglePostFx: () => void;
  setStageToneMapping: (m: StageToneMapping) => void;
  resetCamera: () => void;

  setLocale: (l: Locale) => void;

  /* tour controls */
  startTour: () => void;
  stopTour: () => void;
  toggleTourPlay: () => void;
  jumpTourTo: (index: number) => void;
  /** Internal: advances the tour clock by `dtMs`. */
  tickTour: (dtMs: number) => void;

  /* cinema + screenshot */
  toggleCinema: () => void;
  requestScreenshot: () => void;

  toggleTripoDebugFlag: (key: keyof TripoDebugFlags) => void;
  resetTripoDebug: () => void;

  setTripoMaterialProbe: (p: TripoMaterialProbe | null) => void;
}

export const useAppStore = create<AppStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        mode: "explore",
        activeCell: "plant",
        activeOrganelle: "nucleus",
        favorites: ["plant", "rbc"],
        labelsVisible: false,
        crossSectionOn: false,
        postItDismissed: false,
        exportDrawerOpen: false,
        touring: false,
        pbrPopoverOpen: false,
        comparePair: ["plant", "animal"],

        hdriPreset: "studio",
        autoRotate: true,
        pbrEnhanced: false,
        postFxEnabled: false,
        stageToneMapping: "neutral",
        cameraResetTick: 0,

        locale: "en",
        localeInitialized: false,

        tourIndex: 0,
        tourElapsedMs: 0,
        tourPlaying: false,

        cinema: false,
        screenshotTick: 0,

        tripoDebug: { ...TRIPO_DEBUG_INITIAL },
        tripoMaterialProbe: null,

        setMode: (mode) => set({ mode }),
        setCell: (activeCell) => set({ activeCell }),
        setOrganelle: (activeOrganelle) => set({ activeOrganelle }),
        toggleFavorite: (c) =>
          set((s) => ({
            favorites: s.favorites.includes(c)
              ? s.favorites.filter((id) => id !== c)
              : [...s.favorites, c],
          })),
        setLabels: (labelsVisible) => set({ labelsVisible }),
        toggleLabels: () => set((s) => ({ labelsVisible: !s.labelsVisible })),
        setCrossSection: (crossSectionOn) => set({ crossSectionOn }),
        toggleCrossSection: () => set((s) => ({ crossSectionOn: !s.crossSectionOn })),
        dismissPostIt: () => set({ postItDismissed: true }),
        openExport: () => set({ exportDrawerOpen: true }),
        closeExport: () => set({ exportDrawerOpen: false }),
        toggleTouring: () =>
          set((s) =>
            s.touring
              ? { touring: false, tourPlaying: false, tourElapsedMs: 0 }
              : { touring: true, tourPlaying: true, tourIndex: 0, tourElapsedMs: 0, activeCell: CELL_ORDER[0] }
          ),
        togglePbrPopover: () => set((s) => ({ pbrPopoverOpen: !s.pbrPopoverOpen })),
        swapCompare: () => set((s) => ({ comparePair: [s.comparePair[1], s.comparePair[0]] })),

        setHdriPreset: (hdriPreset) => set({ hdriPreset }),
        toggleAutoRotate: () => set((s) => ({ autoRotate: !s.autoRotate })),
        togglePbrEnhanced: () => set((s) => ({ pbrEnhanced: !s.pbrEnhanced })),
        setPbrEnhanced: (pbrEnhanced) => set({ pbrEnhanced }),
        togglePostFx: () => set((s) => ({ postFxEnabled: !s.postFxEnabled })),
        setStageToneMapping: (stageToneMapping) => set({ stageToneMapping }),
        resetCamera: () => set((s) => ({ cameraResetTick: s.cameraResetTick + 1 })),

        setLocale: (locale) => {
          writeWorkspaceUiLocale(locale);
          set({ locale, localeInitialized: true });
        },

        startTour: () =>
          set({
            touring: true,
            tourPlaying: true,
            tourIndex: 0,
            tourElapsedMs: 0,
            activeCell: CELL_ORDER[0],
          }),
        stopTour: () =>
          set({ touring: false, tourPlaying: false, tourElapsedMs: 0 }),
        toggleTourPlay: () => set((s) => ({ tourPlaying: !s.tourPlaying })),
        jumpTourTo: (index) => {
          const safe = ((index % CELL_ORDER.length) + CELL_ORDER.length) % CELL_ORDER.length;
          set({
            tourIndex: safe,
            tourElapsedMs: 0,
            activeCell: CELL_ORDER[safe],
          });
        },
        tickTour: (dtMs) => {
          const s = useAppStore.getState();
          if (!s.touring || !s.tourPlaying) return;
          const len = CELL_ORDER.length;
          let idx = s.tourIndex;
          if (
            typeof idx !== "number" ||
            !Number.isFinite(idx) ||
            idx < 0 ||
            idx >= len
          ) {
            set({
              tourIndex: 0,
              tourElapsedMs: 0,
              activeCell: CELL_ORDER[0],
            });
            return;
          }
          idx = Math.floor(idx);
          const currentCell = CELL_ORDER[idx];
          const dwellMs = CELLS[currentCell].dwellSeconds * 1000;
          const next = s.tourElapsedMs + dtMs;
          if (next >= dwellMs) {
            const nextIdx = (idx + 1) % CELL_ORDER.length;
            set({
              tourIndex: nextIdx,
              tourElapsedMs: 0,
              activeCell: CELL_ORDER[nextIdx],
            });
          } else {
            set({ tourElapsedMs: next });
          }
        },

        toggleCinema: () => set((s) => ({ cinema: !s.cinema })),
        requestScreenshot: () =>
          set((s) => ({ screenshotTick: s.screenshotTick + 1 })),

        toggleTripoDebugFlag: (key) =>
          set((s) => ({
            tripoDebug: { ...s.tripoDebug, [key]: !s.tripoDebug[key] },
          })),
        resetTripoDebug: () => set({ tripoDebug: { ...TRIPO_DEBUG_INITIAL } }),

        setTripoMaterialProbe: (tripoMaterialProbe) => set({ tripoMaterialProbe }),
      }),
      {
        name: "bioscope3d:app-state",
        version: 10,
        migrate: (persisted, fromVersion) => {
          const p = { ...(persisted ?? {}) } as Record<string, unknown>;
          const isCellId = (id: unknown): id is CellId =>
            typeof id === "string" && id in CELLS;

          if (fromVersion < 10) {
            p.activeCell = isCellId(p.activeCell) ? p.activeCell : "plant";
            if (Array.isArray(p.favorites)) {
              p.favorites = (p.favorites as unknown[]).filter(isCellId);
            }
            if (Array.isArray(p.comparePair) && p.comparePair.length >= 2) {
              const a = p.comparePair[0];
              const b = p.comparePair[1];
              p.comparePair = [
                isCellId(a) ? a : "plant",
                isCellId(b) ? b : "animal",
              ];
            }
            const len = CELL_ORDER.length;
            const tiRaw = p.tourIndex;
            let ti =
              typeof tiRaw === "number" && Number.isFinite(tiRaw)
                ? Math.floor(tiRaw)
                : 0;
            if (ti < 0 || ti >= len) {
              ti = 0;
              p.tourElapsedMs = 0;
              if (p.touring === true) {
                p.touring = false;
                p.tourPlaying = false;
              }
            }
            p.tourIndex = ti;
          }

          if (fromVersion < 9) {
            const len = CELL_ORDER.length;
            const tiRaw = p.tourIndex;
            let ti =
              typeof tiRaw === "number" && Number.isFinite(tiRaw)
                ? Math.floor(tiRaw)
                : 0;
            if (ti < 0 || ti >= len) {
              ti = 0;
              p.tourElapsedMs = 0;
              if (p.touring === true) {
                p.touring = false;
                p.tourPlaying = false;
              }
            }
            p.tourIndex = ti;
          }

          if (fromVersion < 6) {
            Object.assign(p, {
              pbrEnhanced: false,
              postFxEnabled: false,
              stageToneMapping: "neutral",
            });
          }
          if (fromVersion < 7) {
            p.labelsVisible = false;
          }
          if (fromVersion < 8) {
            p.activeCell = isCellId(p.activeCell) ? p.activeCell : "plant";
            if (Array.isArray(p.favorites)) {
              p.favorites = (p.favorites as unknown[]).filter(isCellId);
            }
            if (Array.isArray(p.comparePair) && p.comparePair.length >= 2) {
              const a = p.comparePair[0];
              const b = p.comparePair[1];
              p.comparePair = [
                isCellId(a) ? a : "plant",
                isCellId(b) ? b : "animal",
              ];
            }
          }
          if (p.stageToneMapping !== "neutral" && p.stageToneMapping !== "aces") {
            p.stageToneMapping = "neutral";
          }
          return p;
        },
        partialize: (s) => ({
          mode: s.mode,
          activeCell: s.activeCell,
          activeOrganelle: s.activeOrganelle,
          favorites: s.favorites,
          labelsVisible: s.labelsVisible,
          crossSectionOn: s.crossSectionOn,
          postItDismissed: s.postItDismissed,
          comparePair: s.comparePair,
          hdriPreset: s.hdriPreset,
          autoRotate: s.autoRotate,
          pbrEnhanced: s.pbrEnhanced,
          postFxEnabled: s.postFxEnabled,
          stageToneMapping: s.stageToneMapping,
          locale: s.locale,
          localeInitialized: s.localeInitialized,
        }),
        onRehydrateStorage: () => (persistedState) => {
          if (!persistedState) return;
          queueMicrotask(() => {
            const w = readWorkspaceUiLocale();
            const current = useAppStore.getState().locale;
            if (w && w !== current) {
              useAppStore.getState().setLocale(w);
            } else if (!w) {
              writeWorkspaceUiLocale(current);
            }
          });
        },
      }
    )
  )
);
