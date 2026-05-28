import * as THREE from "three";

/**
 * Why this exists: Tripo3D and Hunyuan3D GLBs ship with PBR materials that
 * are technically valid but visually flat — roughness pegged near 1, no AO,
 * envMapIntensity baked at 1 with a heavy diffuse-only look. The "Re-bake"
 * pill in the UI flips this enhancement on; "Original" turns it off.
 *
 * We snapshot the original values onto material.userData.__pbrOriginal the
 * first time we touch a material, so toggling between modes is lossless.
 */

interface OriginalPbr {
  roughness?: number;
  metalness?: number;
  envMapIntensity?: number;
  normalScale?: THREE.Vector2;
}

const SNAPSHOT_KEY = "__pbrOriginal";

/** Per-material envMap cap after re-bake / stabilize (C1 — aligns with matte bisect). */
export const PBR_ENV_MAP_INTENSITY_CEILING = 0.28;

/** drei `<Environment environmentIntensity>` — global IBL strength (C1). */
export const PBR_HDRI_ENVIRONMENT_INTENSITY = 0.16;

function snapshot(mat: THREE.MeshStandardMaterial): OriginalPbr {
  const existing = mat.userData[SNAPSHOT_KEY] as OriginalPbr | undefined;
  if (existing) return existing;
  const snap: OriginalPbr = {
    roughness: mat.roughness,
    metalness: mat.metalness,
    envMapIntensity: mat.envMapIntensity,
    normalScale: mat.normalScale ? mat.normalScale.clone() : undefined,
  };
  mat.userData[SNAPSHOT_KEY] = snap;
  return snap;
}

function isStandard(mat: THREE.Material): mat is THREE.MeshStandardMaterial {
  return mat instanceof THREE.MeshStandardMaterial;
}

function eachMaterial(root: THREE.Object3D, fn: (m: THREE.MeshStandardMaterial) => void) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const m of mats) if (isStandard(m)) fn(m);
  });
}

/**
 * Apply (or restore) the PBR enhancement pass.
 *
 * Enhanced mode tweaks (Tripo-aware, B4 + C1):
 *  - roughness: do not pull values down (legacy 0.96× / 0.42 floor caused HDRI speckle);
 *    matte slots only nudge toward 1, never toward mid-shine.
 *  - envMapIntensity: no re-bake bump — clamp to a low ceiling only.
 *  - Physical clearcoat capped after enhancements (Tripo sparkle control).
 *
 * Original mode restores from the snapshot.
 */
export function enhancePBR(scene: THREE.Object3D, enhanced: boolean): void {
  eachMaterial(scene, (m) => {
    const orig = snapshot(m);

    if (enhanced) {
      if (orig.roughness !== undefined) {
        const r = orig.roughness;
        m.roughness =
          r >= 0.82
            ? THREE.MathUtils.clamp(Math.max(r, 0.94), 0.9, 1)
            : THREE.MathUtils.clamp(r, r, 0.96);
      }
      const baseEnv = orig.envMapIntensity ?? 1;
      m.envMapIntensity = THREE.MathUtils.clamp(
        baseEnv,
        0.08,
        PBR_ENV_MAP_INTENSITY_CEILING,
      );
      if (orig.normalScale && m.normalScale) m.normalScale.copy(orig.normalScale);
    } else {
      if (orig.roughness !== undefined) m.roughness = orig.roughness;
      if (orig.metalness !== undefined) m.metalness = orig.metalness;
      if (orig.envMapIntensity !== undefined) m.envMapIntensity = orig.envMapIntensity;
      if (orig.normalScale && m.normalScale) m.normalScale.copy(orig.normalScale);
    }
    meshPhysicalClampClearcoatForSparkle(m);
    m.needsUpdate = true;
  });
}

/** Tripo MeshPhysical exports often ship clearcoat — second lobes sparkle under IBL (not in __pbrOriginal). */
function meshPhysicalClampClearcoatForSparkle(m: THREE.MeshStandardMaterial): void {
  if (!(m instanceof THREE.MeshPhysicalMaterial)) return;
  if (m.clearcoat <= 0.05) return;
  m.clearcoat = THREE.MathUtils.clamp(m.clearcoat * 0.35, 0, 0.12);
  m.clearcoatRoughness = Math.max(m.clearcoatRoughness, 0.55);
}

/**
 * Apply or clear a world-space clipping plane on every standard material in
 * the scene. Used by the cross-section toggle. Pass `null` to clear.
 */
export function setClippingPlane(scene: THREE.Object3D, plane: THREE.Plane | null): void {
  const planes = plane ? [plane] : [];
  eachMaterial(scene, (m) => {
    m.clippingPlanes = planes;
    m.clipShadows = true;
    m.needsUpdate = true;
  });
}
