import { Canvas } from "@react-three/fiber";
import { Center, Loader, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

/** Served from `public/models/` (stable URL, not emitted via `import …?url`). */
const DEFAULT_MODEL_URL = "/models/hunyuan3d-stellar-expanse.glb";

useGLTF.preload(DEFAULT_MODEL_URL);

function GltfShip({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return (
    <Center top>
      <primitive object={scene} />
    </Center>
  );
}

export type HunyuanViewerProps = {
  modelUrl?: string;
};

export function HunyuanViewer({ modelUrl }: HunyuanViewerProps) {
  const url = modelUrl ?? DEFAULT_MODEL_URL;
  return (
    <div className="viewer-canvas" aria-label="Ship 3D preview">
      <Canvas
        camera={{ position: [2.4, 1.1, 2.8], fov: 42, near: 0.08, far: 200 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[4.5, 6, 3]} intensity={0.85} />
        <directionalLight
          position={[-3.5, 2.5, -2.2]}
          intensity={0.35}
          color="#e4e8ff"
        />
        <Suspense fallback={null}>
          <GltfShip key={url} url={url} />
        </Suspense>
        <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
      </Canvas>
      <Loader
        dataInterpolation={(p) => `${Math.floor(p)}%`}
        containerStyles={{
          background: "rgba(240, 241, 246, 0.82)",
          zIndex: 8,
          pointerEvents: "none",
        }}
        innerStyles={{ width: 140 }}
        barStyles={{ height: 3, background: "rgba(45, 107, 206, 0.35)" }}
        dataStyles={{
          color: "#3a3850",
          fontSize: 11,
          fontFamily: "Inter, system-ui, sans-serif",
          marginTop: 8,
        }}
      />
    </div>
  );
}
