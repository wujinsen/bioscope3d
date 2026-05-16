import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useAppStore } from "@stores/useAppStore";

/**
 * Post-processing stack.
 *  - Bloom: gentle highlight bloom on the brighter HDRI specular hits.
 *
 * N8AO was removed: any pass with `needsDepthTexture` (N8AOPostPass) makes
 * pmndrs `EffectComposer` allocate a stable depth target and call
 * `glBlitFramebuffer` every frame after `RenderPass`. On Chrome + ANGLE that
 * path can throw `GL_INVALID_OPERATION: ... same image` and corrupt the
 * framebuffer even when internal MSAA is off (`multisampling={0}`). Bloom does
 * not read depth, so no stable-depth blit runs and the pipeline stays valid.
 * Revisit AO via baked contact shadow in GLB, a different effect, or a
 * future three/postprocessing fix.
 *
 * Tone mapping is set on the renderer (gl.toneMapping = ACESFilmic in
 * CellScene), so we do NOT add a ToneMapping effect here — that would
 * apply it twice and crush the highlights.
 *
 * Gated by store.postFxEnabled (F2). The R3F `<EffectComposer>` wrapper
 * defaults multisampling to 8; we keep **`multisampling={0}`** so internal
 * ping-pong targets never use MSRTT resolve blits.
 */
export function PostFx() {
  const enabled = useAppStore((s) => s.postFxEnabled);
  if (!enabled) return null;
  return (
    <EffectComposer
      multisampling={0}
      stencilBuffer={false}
      depthBuffer
      enableNormalPass={false}
    >
      <Bloom luminanceThreshold={0.92} intensity={0.22} mipmapBlur />
    </EffectComposer>
  );
}
