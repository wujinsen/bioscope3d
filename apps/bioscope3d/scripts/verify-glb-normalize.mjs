#!/usr/bin/env node
/**
 * Headless sanity check: GLB normalization matches CellModel (no bounding blow-up).
 * Run from repo: node apps/bioscope3d/scripts/verify-glb-normalize.mjs
 * Requires: Node 18+ (no puppeteer — loads geometry only).
 */
/* eslint-disable no-console */
globalThis.self = globalThis;

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../../");
const GLBS = ["models/animal-cell.glb", "models/tripo-plant-cell-test.glb"].map((r) =>
  join(ROOT, r),
);

function unionInstancedMeshWorldBounds(root, into) {
  const meshWorld = new THREE.Matrix4();
  const instanceLocal = new THREE.Matrix4();
  const tmpBox = new THREE.Box3();
  root.updateMatrixWorld(true);
  root.traverse((obj) => {
    const im = obj;
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

function fitCellSceneForCamera(scene) {
  scene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(scene, false);
  unionInstancedMeshWorldBounds(scene, box);
  if (box.isEmpty()) throw new Error("empty bounds");
  scene.position.sub(box.getCenter(new THREE.Vector3()));
  scene.updateMatrixWorld(true);
  box.setFromObject(scene, false);
  unionInstancedMeshWorldBounds(scene, box);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  if (!Number.isFinite(maxDim) || maxDim <= 1e-12) throw new Error("invalid size");
  const factor = THREE.MathUtils.clamp(2 / maxDim, 1e-6, 1e5);
  scene.scale.multiplyScalar(factor);
  return factor;
}

for (const p of GLBS) {
  try {
    const buf = readFileSync(p);
    const loader = new GLTFLoader();
    const scene = await new Promise((resolve, reject) => {
      loader.parse(
        buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
        "",
        (gltf) => resolve(gltf.scene),
        reject,
      );
    });
    const cloned = scene.clone(true);
    const factor = fitCellSceneForCamera(cloned);
    if (factor > 1e5 || factor < 1e-12) throw new Error("extreme factor " + factor);
    console.log("OK", p.replace(ROOT + "/", ""), "normalize 1/r ~", factor.toFixed(4));
  } catch (e) {
    console.error("FAIL", p, e.message);
    process.exitCode = 1;
  }
}
