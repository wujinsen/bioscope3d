import * as THREE from "three";
import type { TripoDebugFlags, TripoMaterialProbe } from "@/types";
import { PBR_ENV_MAP_INTENSITY_CEILING } from "@/lib/pbr";

const TEXTURE_KEYS_STD: (keyof THREE.MeshStandardMaterial)[] = [
  "map",
  "lightMap",
  "aoMap",
  "emissiveMap",
  "bumpMap",
  "normalMap",
  "displacementMap",
  "roughnessMap",
  "metalnessMap",
  "alphaMap",
];

/**
 * Evidence-backed mitigations for specular aliasing on dense glTF+PBR meshes:
 *  - Normal maps must stay in non-color data space (THREE manual / GLTF pipelines).
 *  - Anisotropic filtering reduces shimmer on oblique grazing angles.
 *  - Prefer trilinear mip minification when the asset left normals at LINEAR only
 *    (Khronos glTF-WebGL-PBR #87 discusses harsh pixels without mip-aware sampling).
 */
export function tuneTripoTextures(root: THREE.Object3D, maxAnisotropy: number): void {
  const aniso = THREE.MathUtils.clamp(maxAnisotropy || 4, 1, 16);
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const raw of mats) {
      if (!(raw instanceof THREE.MeshStandardMaterial)) continue;
      const m = raw;
      for (const key of TEXTURE_KEYS_STD) {
        const tex = m[key];
        if (tex instanceof THREE.Texture) {
          tex.anisotropy = aniso;
          if (key === "normalMap" || key === "bumpMap") {
            tex.colorSpace = THREE.NoColorSpace;
            if (tex.minFilter === THREE.LinearFilter || tex.minFilter === THREE.NearestFilter) {
              tex.minFilter = THREE.LinearMipmapLinearFilter;
              tex.generateMipmaps = true;
              tex.needsUpdate = true;
            }
          }
        }
      }
      stabilizeTripoOrganicMaterial(m);
      mitigateNormalMappedSpecularAliasing(m);
      const envMap = m.envMap;
      if (envMap instanceof THREE.Texture) {
        envMap.anisotropy = aniso;
      }
      if (m instanceof THREE.MeshPhysicalMaterial) {
        const cct = m.clearcoatNormalMap;
        if (cct instanceof THREE.Texture) {
          cct.anisotropy = aniso;
          cct.colorSpace = THREE.NoColorSpace;
          if (cct.minFilter === THREE.LinearFilter || cct.minFilter === THREE.NearestFilter) {
            cct.minFilter = THREE.LinearMipmapLinearFilter;
            cct.generateMipmaps = true;
            cct.needsUpdate = true;
          }
        }
      }
    }
  });
}

function stabilizeTripoOrganicMaterial(m: THREE.MeshStandardMaterial): void {
  if (!m.name.startsWith("tripo_material")) return;

  m.metalness = 0;
  m.metalnessMap = null;
  m.roughness = Math.max(m.roughness, 0.92);
  m.roughnessMap = null;
  m.envMapIntensity = Math.min(m.envMapIntensity, PBR_ENV_MAP_INTENSITY_CEILING);
  m.normalMap = null;
  if (m.normalScale) m.normalScale.set(1, 1);
  m.needsUpdate = true;
}

const NORMAL_MAPPED_ROUGHNESS_FLOOR = 0.78;
const NORMAL_MAPPED_ROUGHNESS_TARGET = 0.8;

/** B2: grazing-angle slots — roughness bias only (mip fix lives above). */
function mitigateNormalMappedSpecularAliasing(m: THREE.MeshStandardMaterial): void {
  if (m.name.startsWith("tripo_material")) return;
  if (!m.normalMap && !m.bumpMap) return;
  if (m.roughness < NORMAL_MAPPED_ROUGHNESS_FLOOR) {
    m.roughness = THREE.MathUtils.lerp(
      m.roughness,
      NORMAL_MAPPED_ROUGHNESS_TARGET,
      0.45,
    );
  }
  m.needsUpdate = true;
}

const SPECULAR_AA_NORMAL_SCALE = 0.88;
const SPECULAR_AA_ROUGHNESS_FLOOR = 0.78;
const SPECULAR_AA_SNAP_KEY = "__specularAA_snap";

interface SpecularAASnap {
  roughness: number;
  normalScale: THREE.Vector2;
}

/** B3: Research-mode heuristic — attenuate normal detail + floor roughness (reversible). */
export function applySpecularAAMitigation(root: THREE.Object3D, enabled: boolean): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const raw of mats) {
      if (!(raw instanceof THREE.MeshStandardMaterial)) continue;
      const m = raw;
      const ud = m.userData as Record<string, unknown>;

      if (enabled) {
        if (!m.normalMap && !m.bumpMap) continue;
        if (!ud[SPECULAR_AA_SNAP_KEY]) {
          ud[SPECULAR_AA_SNAP_KEY] = {
            roughness: m.roughness,
            normalScale: m.normalScale.clone(),
          } satisfies SpecularAASnap;
        }
        const snap = ud[SPECULAR_AA_SNAP_KEY] as SpecularAASnap;
        m.roughness = Math.max(snap.roughness, SPECULAR_AA_ROUGHNESS_FLOOR);
        m.normalScale.copy(snap.normalScale).multiplyScalar(SPECULAR_AA_NORMAL_SCALE);
      } else if (ud[SPECULAR_AA_SNAP_KEY]) {
        const snap = ud[SPECULAR_AA_SNAP_KEY] as SpecularAASnap;
        m.roughness = snap.roughness;
        m.normalScale.copy(snap.normalScale);
        delete ud[SPECULAR_AA_SNAP_KEY];
      }
      m.needsUpdate = true;
    }
  });
}

export function probeTripoMaterials(root: THREE.Object3D): TripoMaterialProbe {
  let standardMaterialSlots = 0;
  let slotsWithNormalOrBump = 0;
  let physicalMaterials = 0;
  let slotsWithStrongClearcoat = 0;
  let slotsWithStrongSheen = 0;
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const raw of mats) {
      if (!(raw instanceof THREE.MeshStandardMaterial)) continue;
      standardMaterialSlots++;
      const m = raw;
      if (m.normalMap || m.bumpMap) slotsWithNormalOrBump++;
      if (m instanceof THREE.MeshPhysicalMaterial) {
        physicalMaterials++;
        if (m.clearcoat > 0.02) slotsWithStrongClearcoat++;
        if (m.sheen > 0.02) slotsWithStrongSheen++;
      }
    }
  });
  return {
    standardMaterialSlots,
    slotsWithNormalOrBump,
    physicalMaterials,
    slotsWithStrongClearcoat,
    slotsWithStrongSheen,
  };
}

interface MatteSnap {
  r: number;
  metal: number;
  env: number;
  roughMap: THREE.Texture | null;
  metalMap: THREE.Texture | null;
  phys?: {
    specularIntensity: number;
    specularIntensityMap: THREE.Texture | null;
    sheen: number;
  };
}

interface NormSnap {
  bump: THREE.Texture | null;
  normal: THREE.Texture | null;
  bumpScale: number;
  ns: THREE.Vector2;
}

interface CcSnap {
  cc: number;
  ccr: number;
  ccn: THREE.Texture | null;
  ccns: THREE.Vector2;
  sheen: number;
}

/**
 * Applies store-driven bisection flags AFTER `enhancePBR`; restores originals when toggled off.
 */
export function applyTripoDebugMaterialPasses(root: THREE.Object3D, flags: TripoDebugFlags): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const raw of mats) {
      if (!(raw instanceof THREE.MeshStandardMaterial)) continue;
      const m = raw;
      const ud = m.userData as Record<string, unknown>;

      if (flags.matteForced) {
        if (!ud.__tripoDbg_matte_snap) {
          const snap: MatteSnap = {
            r: m.roughness,
            metal: m.metalness,
            env: m.envMapIntensity,
            roughMap: m.roughnessMap ?? null,
            metalMap: m.metalnessMap ?? null,
          };
          if (m instanceof THREE.MeshPhysicalMaterial) {
            snap.phys = {
              specularIntensity: m.specularIntensity,
              specularIntensityMap: m.specularIntensityMap ?? null,
              sheen: m.sheen,
            };
          }
          ud.__tripoDbg_matte_snap = snap;
        }
        m.roughnessMap = null;
        m.metalnessMap = null;
        m.roughness = 1;
        m.metalness = 0;
        m.envMapIntensity = 0;
        if (m instanceof THREE.MeshPhysicalMaterial) {
          m.specularIntensity = 0;
          m.specularIntensityMap = null;
          m.sheen = 0;
        }
      } else if (ud.__tripoDbg_matte_snap) {
        const s = ud.__tripoDbg_matte_snap as MatteSnap;
        m.roughness = s.r;
        m.metalness = s.metal;
        m.envMapIntensity = s.env;
        m.roughnessMap = s.roughMap;
        m.metalnessMap = s.metalMap;
        if (s.phys !== undefined && m instanceof THREE.MeshPhysicalMaterial) {
          m.specularIntensity = s.phys.specularIntensity;
          m.specularIntensityMap = s.phys.specularIntensityMap;
          m.sheen = s.phys.sheen;
        }
        delete ud.__tripoDbg_matte_snap;
      }

      if (flags.noNormalMaps) {
        if (!ud.__tripoDbg_norm_snap) {
          ud.__tripoDbg_norm_snap = {
            bump: m.bumpMap ?? null,
            normal: m.normalMap ?? null,
            bumpScale: m.bumpScale,
            ns: m.normalScale.clone(),
          } satisfies NormSnap;
        }
        m.bumpMap = null;
        m.normalMap = null;
        m.bumpScale = 0;
        m.normalScale.set(1, 1);
      } else if (ud.__tripoDbg_norm_snap) {
        const s = ud.__tripoDbg_norm_snap as NormSnap;
        m.bumpMap = s.bump;
        m.normalMap = s.normal;
        m.bumpScale = s.bumpScale;
        m.normalScale.copy(s.ns);
        delete ud.__tripoDbg_norm_snap;
      }

      if (m instanceof THREE.MeshPhysicalMaterial) {
        if (flags.clearcoatZero) {
          if (!ud.__tripoDbg_cc_snap) {
            const matteSnap = ud.__tripoDbg_matte_snap as MatteSnap | undefined;
            let sheenForSnap = m.sheen;
            if (flags.matteForced && matteSnap?.phys !== undefined) {
              sheenForSnap = matteSnap.phys.sheen;
            }
            ud.__tripoDbg_cc_snap = {
              cc: m.clearcoat,
              ccr: m.clearcoatRoughness,
              ccn: m.clearcoatNormalMap ?? null,
              ccns: m.clearcoatNormalScale.clone(),
              sheen: sheenForSnap,
            } satisfies CcSnap;
          }
          m.clearcoat = 0;
          m.clearcoatRoughness = 1;
          m.clearcoatNormalMap = null;
          m.clearcoatNormalScale.set(1, 1);
          m.sheen = 0;
        } else if (ud.__tripoDbg_cc_snap) {
          const s = ud.__tripoDbg_cc_snap as CcSnap;
          m.clearcoat = s.cc;
          m.clearcoatRoughness = s.ccr;
          m.clearcoatNormalMap = s.ccn;
          m.clearcoatNormalScale.copy(s.ccns);
          if (!flags.matteForced) {
            m.sheen = s.sheen;
          }
          delete ud.__tripoDbg_cc_snap;
        }
      }

      m.needsUpdate = true;
    }
  });
}
