import { Canvas } from "@react-three/fiber";
import { Loader, useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import { useAppStore } from "@stores/useAppStore";
import { CELLS } from "@data/cells";
import { CellModel } from "./CellModel";
import { CameraRig } from "./CameraRig";
import { SceneEnvironment } from "./SceneEnvironment";
import { PostFx } from "./PostFx";
import { RendererToneMappingSync } from "./RendererToneMappingSync";

/**
 * Legacy R3F specimen canvas (not mounted from `Stage` as of v0.5 — live GLB
 * cells use `<model-viewer>` in `CellModelViewer` for glTF-identical output).
 * Kept for future clipping / post-FX / custom shaders without re-scaffolding.
 *
 * When re-enabled: Canvas + Loader + CellModel + CameraRig + optional PostFx;
 * `preserveDrawingBuffer` required for canvas `toBlob` screenshots.
 */
export function CellScene() {
  const activeCell = useAppStore((s) => s.activeCell);
  const iblOff = useAppStore((s) => s.tripoDebug.iblOff);
  const cell = CELLS[activeCell];

  if (!cell.modelPath) return null;

  return (
    <div className="cell-scene" aria-hidden="true">
      <Canvas
        camera={{ position: [2.6, 1.4, 2.6], fov: 35, near: 0.05, far: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          localClippingEnabled: true,
          preserveDrawingBuffer: true,
          toneMapping: THREE.NeutralToneMapping,
          toneMappingExposure: 1,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <RendererToneMappingSync />

        {!iblOff && <SceneEnvironment />}

        <ambientLight intensity={0.34} />
        <directionalLight position={[4, 6, 3]} intensity={0.72} />
        <directionalLight position={[-3.2, 2.8, -2]} intensity={0.38} color="#e8eef8" />

        <Suspense fallback={null}>
          <CellModel src={cell.modelPath} />
        </Suspense>

        <CameraRig />
        <PostFx />
      </Canvas>
      {/* Sibling to Canvas hooks global LoadingManager — HDRI fetch + heavy GLBs can take tens of seconds. */}
      <Loader
        dataInterpolation={(p) => `${Math.floor(p)}%`}
        containerStyles={{
          background: "rgba(242, 236, 224, 0.78)",
          zIndex: 2,
          pointerEvents: "none",
        }}
        innerStyles={{ width: 132 }}
        barStyles={{ height: 3, background: "rgba(90, 100, 60, 0.35)" }}
        dataStyles={{ color: "#5a5648", fontSize: 11, fontFamily: "var(--font-mono)", marginTop: 8 }}
      />
    </div>
  );
}

// Preload known GLBs so cell switches feel instant after first session warm-up.
Object.values(CELLS).forEach((c) => {
  if (c.modelPath) useGLTF.preload(c.modelPath);
});
