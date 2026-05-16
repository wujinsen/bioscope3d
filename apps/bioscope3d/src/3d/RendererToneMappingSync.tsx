import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import * as THREE from "three";
import { useAppStore } from "@stores/useAppStore";

/**
 * Keeps the WebGLRenderer tone curve aligned with store.stageToneMapping.
 * Default Neutral matches `<model-viewer tone-mapping="neutral">` — less
 * highlight crunch than ACES on dense Tripo normals + IBL.
 */
export function RendererToneMappingSync() {
  const gl = useThree((s) => s.gl);
  const stageToneMapping = useAppStore((s) => s.stageToneMapping);

  useLayoutEffect(() => {
    if (stageToneMapping === "neutral") {
      gl.toneMapping = THREE.NeutralToneMapping;
      gl.toneMappingExposure = 1;
    } else {
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.05;
    }
  }, [gl, stageToneMapping]);

  return null;
}
