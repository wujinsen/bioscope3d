import type { Mode } from "@/types";

/** Default Tripo stage exposure (C1 — aligns with docs/06-pbr-tripo-mitigation). */
export const MV_TRIPO_EXPOSURE_DEFAULT = 0.88;

/** Research mode: slightly darker to mimic B3 intent on the MV path. */
export const MV_TRIPO_EXPOSURE_RESEARCH = 0.82;

/**
 * `<model-viewer>` has no `enhancePBR`; exposure is the main live-stage knob for Tripo GLBs.
 * "Original" (pbrEnhanced off) restores authored brightness for A/B comparison.
 */
export function modelViewerExposureForTripo(
  mode: Mode,
  pbrEnhanced: boolean,
): number {
  if (!pbrEnhanced) return 1;
  if (mode === "research") return MV_TRIPO_EXPOSURE_RESEARCH;
  return MV_TRIPO_EXPOSURE_DEFAULT;
}
