import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "@google/model-viewer";
import { useAppStore } from "@stores/useAppStore";
import { CELLS } from "@data/cells";
import type { CellId } from "@/types";
import { useT } from "@/i18n/I18nProvider";
import { modelViewerCameraForCell, usesTripoStyleModelViewer } from "@/lib/cameraPreset";
import { modelViewerExposureForTripo } from "@/lib/modelViewerPbr";

type MV = HTMLElement & {
  autoRotate?: boolean;
  src?: string;
  loaded?: boolean;
  cameraOrbit?: string;
  cameraTarget?: string;
  fieldOfView?: string;
  jumpCameraToGoal?: () => void;
};

type ModelViewerCam = ReturnType<typeof modelViewerCameraForCell>;

function pushCameraToModelViewer(el: MV, cam: ModelViewerCam) {
  el.cameraTarget = cam.target;
  el.cameraOrbit = cam.orbit;
  el.fieldOfView = cam.fieldOfView;
  el.jumpCameraToGoal?.();
}

function scheduleCameraApplication(el: MV, cam: ModelViewerCam): () => void {
  const runs = [
    () => pushCameraToModelViewer(el, cam),
    () => requestAnimationFrame(() => pushCameraToModelViewer(el, cam)),
    () =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => pushCameraToModelViewer(el, cam)),
      ),
  ];
  runs.forEach((fn) => fn());
  const ids = [
    window.setTimeout(() => pushCameraToModelViewer(el, cam), 0),
    window.setTimeout(() => pushCameraToModelViewer(el, cam), 80),
    window.setTimeout(() => pushCameraToModelViewer(el, cam), 240),
  ];
  return () => ids.forEach(clearTimeout);
}

/**
 * GLB cells render with Google's `<model-viewer>` — same stack as a plain
 * `model-viewer.dev` export (neutral tone, authored glTF materials, no R3F
 * clone/normalize path that was exploding some Tripo meshes).
 *
 * While a GLB streams in, the stage shows the flat paper backdrop only
 * (`Stage` + `--bg`). On load error, `heroScene` fills the frame like the
 * no-GLB path.
 */
export function CellModelViewer({
  cellId,
  src,
}: {
  cellId: CellId;
  src: string;
}) {
  const t = useT();
  const ref = useRef<MV>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const storeActiveCell = useAppStore((s) => s.activeCell);
  const mode = useAppStore((s) => s.mode);
  const pbrEnhanced = useAppStore((s) => s.pbrEnhanced);
  const autoRotate = useAppStore((s) => s.autoRotate);
  const cameraResetTick = useAppStore((s) => s.cameraResetTick);
  const cell = CELLS[cellId];
  const tripoStyle = usesTripoStyleModelViewer(cell.modelPath);
  const exposure = tripoStyle
    ? modelViewerExposureForTripo(mode, pbrEnhanced)
    : 1;
  const canAutoRotate = !tripoStyle;
  const cam = modelViewerCameraForCell(cell);
  const isLiveCell = cellId === storeActiveCell;

  useLayoutEffect(() => {
    setLoadedSrc((prev) => (prev === src ? prev : null));
    setLoading(true);
  }, [src]);

  useEffect(() => {
    setLoadFailed(false);
  }, [src, cellId]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onLoad = () => {
      setLoadFailed(false);
      setLoading(false);
      setLoadedSrc(src);
      scheduleCameraApplication(el, cam);
    };
    const onError = () => {
      setLoadFailed(true);
      setLoading(false);
      setLoadedSrc(null);
    };
    const onProgress = (e: Event) => {
      const total = (e as CustomEvent<{ totalProgress?: number }>).detail
        ?.totalProgress;
      if (typeof total === "number" && total >= 1) setLoading(false);
    };
    el.addEventListener("load", onLoad);
    el.addEventListener("error", onError);
    el.addEventListener("progress", onProgress);
    const syncIfAlreadyLoaded = () => {
      if (el.loaded) onLoad();
    };
    syncIfAlreadyLoaded();
    requestAnimationFrame(syncIfAlreadyLoaded);
    return () => {
      el.removeEventListener("load", onLoad);
      el.removeEventListener("error", onError);
      el.removeEventListener("progress", onProgress);
    };
  }, [src, cam.orbit, cam.target, cam.fieldOfView]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !isLiveCell) return;
    return scheduleCameraApplication(el, cam);
  }, [
    src,
    cellId,
    storeActiveCell,
    isLiveCell,
    cameraResetTick,
    cam.orbit,
    cam.target,
    cam.fieldOfView,
  ]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isLiveCell) return;
    el.autoRotate = Boolean(autoRotate && canAutoRotate);
  }, [autoRotate, canAutoRotate, isLiveCell]);

  const modelReady = !loadFailed && loadedSrc === src;
  const showLoadingHero = !modelReady && !loadFailed;

  return (
    <div className="cell-scene cell-scene--model-viewer" aria-hidden="true">
      {showLoadingHero ? (
        <img className="model-viewer-loading-hero" src={cell.heroScene} alt="" />
      ) : null}
      {loadFailed ? (
        <>
          <img className="model-viewer-fallback-hero" src={cell.heroScene} alt="" />
          <p className="model-viewer-load-error" role="status">
            {t.stageViewer.loadFailed}
          </p>
        </>
      ) : null}
      {loading && !loadFailed && !modelReady ? (
        <p className="model-viewer-load-hint" aria-live="polite">
          {t.stageViewer.loading}
        </p>
      ) : null}
      <model-viewer
        ref={ref}
        className={
          loadFailed
            ? "model-viewer--load-failed"
            : modelReady
              ? "model-viewer--revealed"
              : "model-viewer--pending"
        }
        src={src}
        alt=""
        camera-controls
        {...{
          "camera-orbit": cam.orbit,
          "camera-target": cam.target,
          "field-of-view": cam.fieldOfView,
          "tone-mapping": "neutral",
          exposure,
          "shadow-intensity": 0,
          "interaction-prompt": "none",
        }}
      />
    </div>
  );
}
