#!/usr/bin/env node
/**
 * Read-only glTF/GLB audit for Tripo-style PBR speckle triage (A1).
 * Usage: node apps/bioscope3d/scripts/audit-tripo-gltf.mjs path/to/model.glb [...]
 */
/* eslint-disable no-console */
globalThis.self = globalThis;

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const APP_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_MODELS_DIR = join(APP_ROOT, "public/models");

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const FILTER = {
  [THREE.NearestFilter]: "Nearest",
  [THREE.LinearFilter]: "Linear",
  [THREE.NearestMipmapNearestFilter]: "NearestMipmapNearest",
  [THREE.LinearMipmapNearestFilter]: "LinearMipmapNearest",
  [THREE.NearestMipmapLinearFilter]: "NearestMipmapLinear",
  [THREE.LinearMipmapLinearFilter]: "LinearMipmapLinear",
};

function filterName(tex) {
  if (!tex) return "—";
  return FILTER[tex.minFilter] ?? String(tex.minFilter);
}

function auditScene(scene, label) {
  const rows = [];
  scene.traverse((obj) => {
    const mesh = obj;
    if (!mesh.isMesh || !mesh.material) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const raw of mats) {
      if (!(raw instanceof THREE.MeshStandardMaterial)) continue;
      const m = raw;
      rows.push({
        material: m.name || "(unnamed)",
        roughness: m.roughness.toFixed(3),
        metalness: m.metalness.toFixed(3),
        normal: m.normalMap ? "yes" : "no",
        normalMin: filterName(m.normalMap),
        roughMap: m.roughnessMap ? "yes" : "no",
        metalMap: m.metalnessMap ? "yes" : "no",
        env: m.envMapIntensity.toFixed(3),
        clearcoat:
          m instanceof THREE.MeshPhysicalMaterial && m.clearcoat > 0.02
            ? m.clearcoat.toFixed(2)
            : "—",
      });
    }
  });

  console.log(`\n=== ${label} ===`);
  if (rows.length === 0) {
    console.log("  (no MeshStandardMaterial slots)");
    return;
  }
  const warnMip = rows.filter((r) => r.normal === "yes" && r.normalMin === "Linear");
  const warnGlossy = rows.filter((r) => Number(r.roughness) < 0.5);
  console.table(rows);
  if (warnMip.length) {
    console.log(
      `  ⚠ ${warnMip.length} slot(s) with normal map but LINEAR minFilter (no mips) — see docs/06-pbr-tripo-mitigation.md B2`,
    );
  }
  if (warnGlossy.length) {
    console.log(
      `  ⚠ ${warnGlossy.length} slot(s) with roughness < 0.5 — likely speckle under IBL`,
    );
  }
}

const rawArgs = process.argv.slice(2);
let paths = rawArgs.map((p) => resolve(p));

if (rawArgs.includes("--all")) {
  paths = readdirSync(DEFAULT_MODELS_DIR)
    .filter((f) => f.endsWith(".glb"))
    .map((f) => join(DEFAULT_MODELS_DIR, f));
}

if (paths.length === 0) {
  console.error(
    "Usage: node apps/bioscope3d/scripts/audit-tripo-gltf.mjs <file.glb> [...] | --all",
  );
  process.exit(1);
}

const loader = new GLTFLoader();

for (const p of paths) {
  try {
    const buf = readFileSync(p);
    const scene = await new Promise((res, rej) => {
      loader.parse(
        buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
        "",
        (gltf) => res(gltf.scene),
        rej,
      );
    });
    auditScene(scene, p);
  } catch (e) {
    console.error("FAIL", p, e instanceof Error ? e.message : e);
    process.exitCode = 1;
  }
}
