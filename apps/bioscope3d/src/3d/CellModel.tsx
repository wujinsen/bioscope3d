import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { useAppStore } from "@stores/useAppStore";
import { enhancePBR, setClippingPlane } from "@/lib/pbr";
import {
  applySpecularAAMitigation,
  applyTripoDebugMaterialPasses,
  probeTripoMaterials,
  tuneTripoTextures,
} from "@/lib/tripoDebug";

/** Deep-clone MeshStandard materials so toggle / snapshot bookkeeping never leaks into drei's loader cache */
function detachMaterials(scene: THREE.Object3D): void {
  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;
    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map((m) => m.clone()) as THREE.Material[];
    } else {
      mesh.material = mesh.material.clone();
    }
  });
}

function unionInstancedMeshWorldBounds(root: THREE.Object3D, into: THREE.Box3): void {
  const meshWorld = new THREE.Matrix4();
  const instanceLocal = new THREE.Matrix4();
  const tmpBox = new THREE.Box3();
  root.updateMatrixWorld(true);
  root.traverse((obj) => {
    const im = obj as THREE.InstancedMesh;
    if (!im.isInstancedMesh || !im.geometry) return;
    const geom = im.geometry;
    if (geom.boundingBox === null) geom.computeBoundingBox();
    if (!geom.boundingBox || geom.boundingBox.isEmpty()) return;
    const localHull = geom.boundingBox.clone();
    meshWorld.copy(im.matrixWorld);
    for (let i = 0; i < im.count; i++) {
      im.getMatrixAt(i, instanceLocal);
      tmpBox.copy(localHull).applyMatrix4(instanceLocal).applyMatrix4(meshWorld);
      into.union(tmpBox);
    }
  });
}

/**
 * Center at origin, then uniform scale so the model fits ~diameter 2 (CameraRig
 * presets assume ~unit-scale framing). Matches the spirit of a plain glTF
 * viewer (e.g. model-viewer export): **no** `skeleton.pose()` and **no**
 * `setFromObject(..., true)` here — on some Tripo GLBs, precise deformed-vertex
 * sampling after `clone(true)` produced near-zero radii and `1/r` vertex blow-up.
 *
 * Bounds use geometry AABBs in world space (`precise: false`), plus
 * `unionInstancedMeshWorldBounds` so InstancedMesh hulls are not missed.
 */
function fitCellSceneForCamera(scene: THREE.Object3D): void {
  scene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(scene, false);
  unionInstancedMeshWorldBounds(scene, box);
  if (box.isEmpty()) return;

  const center = new THREE.Vector3();
  box.getCenter(center);
  scene.position.sub(center);

  scene.updateMatrixWorld(true);
  box.setFromObject(scene, false);
  unionInstancedMeshWorldBounds(scene, box);

  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  if (!Number.isFinite(maxDim) || maxDim <= 1e-12) return;

  const targetDiameter = 2;
  const factor = THREE.MathUtils.clamp(targetDiameter / maxDim, 1e-6, 1e5);
  scene.scale.multiplyScalar(factor);
}

export function CellModel({ src }: { src: string }) {
  const { scene: source } = useGLTF(src);
  const gl = useThree((s) => s.gl);
  const pbrEnhanced = useAppStore((s) => s.pbrEnhanced);
  const mode = useAppStore((s) => s.mode);
  const crossSectionOn = useAppStore((s) => s.crossSectionOn);
  const tripoDebug = useAppStore((s) => s.tripoDebug);
  const setTripoMaterialProbe = useAppStore((s) => s.setTripoMaterialProbe);

  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(1, 0, 0), 0), []);

  const model = useMemo(() => {
    const scene = source.clone(true);
    detachMaterials(scene);
    fitCellSceneForCamera(scene);
    return scene;
  }, [source, src]);

  useLayoutEffect(() => {
    const maxA = gl.capabilities.getMaxAnisotropy() || 4;
    tuneTripoTextures(model, maxA);
  }, [model, gl]);

  useLayoutEffect(() => {
    setTripoMaterialProbe(probeTripoMaterials(model));
    return () => {
      setTripoMaterialProbe(null);
    };
  }, [model, setTripoMaterialProbe]);

  useLayoutEffect(() => {
    enhancePBR(model, pbrEnhanced);
    applyTripoDebugMaterialPasses(model, tripoDebug);
  }, [model, pbrEnhanced, tripoDebug]);

  useLayoutEffect(() => {
    applySpecularAAMitigation(model, mode === "research");
  }, [model, mode]);

  useLayoutEffect(() => {
    setClippingPlane(model, crossSectionOn ? clipPlane : null);
  }, [model, crossSectionOn, clipPlane]);

  return <primitive object={model} dispose={null} />;
}
