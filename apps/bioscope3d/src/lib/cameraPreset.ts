import type { CameraPreset, CellMeta } from "@/types";

/** Broad face YZ — camera on ±X (theta 90°). Default radius overridden via CellMeta. */
const TRIPO_DEFAULT_RADIUS_PCT = 108;
/** Same vertical lens for all Tripo GLBs in `<model-viewer>` so stage framing stays comparable. */
const TRIPO_MODEL_VIEWER_FOV = 34;

export function usesTripoStyleModelViewer(modelPath?: string): boolean {
  if (!modelPath) return false;
  if (modelPath.includes("/models/tripo-")) return true;
  return (
    modelPath.includes("animal-cell.glb") ||
    modelPath.includes("cancer-cell.glb") ||
    modelPath.includes("neuron-cell.glb") ||
    modelPath.includes("white-blood-cell.glb") ||
    modelPath.includes("muscle-cell.glb")
  );
}

/** Default polar angle — slight tilt from horizontal orbit (Tripo plate-style cells). */
const TRIPO_DEFAULT_PHI_DEG = 78;

function tripoModelViewerOrbit(
  thinAlong: "x" | "z" | undefined,
  radiusPct: number,
  phiDeg = TRIPO_DEFAULT_PHI_DEG,
): string {
  const r = `${Math.round(radiusPct)}%`;
  const phi = `${Math.round(phiDeg)}deg`;
  return thinAlong === "z" ? `0deg ${phi} ${r}` : `90deg ${phi} ${r}`;
}

/** model-viewer spherical orbit derived from a world-space rig preset. */
export function cameraPresetToModelViewer(
  preset: CameraPreset,
  modelPath?: string,
  tripoThinAlong?: "x" | "z",
  tripoViewerRadiusPct?: number,
  tripoViewerPhiDeg?: number,
): {
  orbit: string;
  target: string;
  fieldOfView: string;
} {
  const fov = preset.fov ?? 35;

  if (usesTripoStyleModelViewer(modelPath)) {
    const pct = tripoViewerRadiusPct ?? TRIPO_DEFAULT_RADIUS_PCT;
    const phi = tripoViewerPhiDeg ?? TRIPO_DEFAULT_PHI_DEG;
    return {
      orbit: tripoModelViewerOrbit(tripoThinAlong, pct, phi),
      target: "auto auto auto",
      fieldOfView: `${TRIPO_MODEL_VIEWER_FOV}deg`,
    };
  }

  const [px, py, pz] = preset.position;
  const [tx, ty, tz] = preset.target;
  const dx = px - tx;
  const dy = py - ty;
  const dz = pz - tz;
  const radius = Math.hypot(dx, dy, dz);

  if (radius < 1e-9) {
    return {
      orbit: "0deg 75deg 105%",
      target: `${tx}m ${ty}m ${tz}m`,
      fieldOfView: `${fov}deg`,
    };
  }

  const thetaDeg = (Math.atan2(dx, dz) * 180) / Math.PI;
  const phiDeg = (Math.acos(Math.max(-1, Math.min(1, dy / radius))) * 180) / Math.PI;

  return {
    orbit: `${thetaDeg.toFixed(1)}deg ${phiDeg.toFixed(1)}deg 105%`,
    target: `${tx}m ${ty}m ${tz}m`,
    fieldOfView: `${fov}deg`,
  };
}

export function modelViewerCameraForCell(
  cell: Pick<
    CellMeta,
    | "cameraPreset"
    | "modelPath"
    | "tripoThinAlong"
    | "tripoViewerRadiusPct"
    | "tripoViewerPhiDeg"
  >,
) {
  return cameraPresetToModelViewer(
    cell.cameraPreset,
    cell.modelPath,
    cell.tripoThinAlong,
    cell.tripoViewerRadiusPct,
    cell.tripoViewerPhiDeg,
  );
}
