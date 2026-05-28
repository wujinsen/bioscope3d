import { Environment } from "@react-three/drei";
import { Suspense } from "react";
import { useAppStore } from "@stores/useAppStore";
import type { HdriPreset } from "@/types";
import { PBR_HDRI_ENVIRONMENT_INTENSITY } from "@/lib/pbr";

/**
 * Three HDRI presets exposed to the UI map to drei's built-in HDR files.
 *
 *  studio → clean neutral whitebox · best for inspecting form
 *  lab    → cool, slightly cyan industrial light · clinical feel
 *  sunset → warm, low-angle key · cinematic / botanical look
 *
 * Network note: drei loads these HDRs from a CDN. If offline, the <Suspense>
 * fallback keeps the rest of the scene rendering with ambient + directional
 * lights only — the materials just won't have IBL reflections.
 *
 * Dense Tripo meshes + tangents + PMREM amplify specular speckle. Intensity stays
 * very low; diffuse fill lights in CellScene carry most of the read.
 */
const PRESET_MAP: Record<HdriPreset, "studio" | "warehouse" | "sunset"> = {
  studio: "studio",
  lab: "warehouse",
  sunset: "sunset",
};

export function SceneEnvironment() {
  const preset = useAppStore((s) => s.hdriPreset);
  return (
    <Suspense fallback={null}>
      <Environment
        preset={PRESET_MAP[preset]}
        background={false}
        environmentIntensity={PBR_HDRI_ENVIRONMENT_INTENSITY}
      />
    </Suspense>
  );
}
