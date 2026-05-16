import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type ComponentRef } from "react";
import * as THREE from "three";
import { useAppStore } from "@stores/useAppStore";
import { CELLS } from "@data/cells";

import { usesTripoStyleModelViewer } from "@/lib/cameraPreset";

/**
 * OrbitControls wrapper that listens to the store for:
 *  - autoRotate flag         (F1 key)
 *  - activeCell change       (F05: animate camera to that cell's preset)
 *  - cameraResetTick counter (F23 / R key — re-applies the current preset)
 *
 * Motion model: when activeCell or resetTick changes, capture the per-cell
 * preset as a target and run a damped lerp in useFrame until convergence.
 * Auto-rotate is gated off during the transition so the animation reads as
 * a single smooth "cut to preset" rather than a fight between two motions.
 *
 * We don't allow panning (cells should always stay centered) and we cap
 * the zoom range so the user can't lose the model.
 */
export function CameraRig() {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const { camera } = useThree();

  const activeCell = useAppStore((s) => s.activeCell);
  const autoRotate = useAppStore((s) => s.autoRotate);
  const resetTick = useAppStore((s) => s.cameraResetTick);
  const cell = CELLS[activeCell];
  const canAutoRotate = !usesTripoStyleModelViewer(cell.modelPath);

  // Animation targets and a "still transitioning" flag.
  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const transitioning = useRef(false);

  useEffect(() => {
    const preset = cell.cameraPreset;
    targetPos.current.fromArray(preset.position);
    targetLookAt.current.fromArray(preset.target);
    transitioning.current = true;

    const perspectiveCam = camera as THREE.PerspectiveCamera;
    if (preset.fov && perspectiveCam.isPerspectiveCamera) {
      perspectiveCam.fov = preset.fov;
      perspectiveCam.updateProjectionMatrix();
    }
  }, [activeCell, resetTick, camera, cell]);

  useFrame((_, dt) => {
    const controls = controlsRef.current;
    if (!controls || !transitioning.current) return;

    // Critically-damped lerp: ~250ms time-to-target at 60fps.
    const k = Math.min(1, dt * 5.5);
    camera.position.lerp(targetPos.current, k);
    controls.target.lerp(targetLookAt.current, k);
    controls.update();

    const dPos = camera.position.distanceTo(targetPos.current);
    const dTgt = controls.target.distanceTo(targetLookAt.current);
    if (dPos < 0.005 && dTgt < 0.005) {
      camera.position.copy(targetPos.current);
      controls.target.copy(targetLookAt.current);
      controls.update();
      transitioning.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      enablePan={false}
      minDistance={1}
      maxDistance={6}
      autoRotate={autoRotate && canAutoRotate && !transitioning.current}
      autoRotateSpeed={0.45}
    />
  );
}
