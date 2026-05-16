import { useAppStore } from "@stores/useAppStore";

/** Ephemeral HUD for Tripo bisection Alt+Shift+0–4; dev-only one-liner probe when no toggles. */
export function TripoDebugHud() {
  const d = useAppStore((s) => s.tripoDebug);
  const probe = useAppStore((s) => s.tripoMaterialProbe);

  const diagOn = d.iblOff || d.noNormalMaps || d.matteForced || d.clearcoatZero;
  const devProbeOnly = Boolean(import.meta.env.DEV && probe && !diagOn);

  if (!diagOn && !devProbeOnly) return null;

  return (
    <div
      className={`tripo-debug-hud${diagOn ? "" : " tripo-debug-hud--probe-only"}`}
      role={diagOn ? "status" : "presentation"}
      aria-live={diagOn ? "polite" : "off"}
    >
      <div className="tripo-debug-hud-title">
        {diagOn ? "Tripo diagnostics" : "Tripo material probe"}
      </div>

      {diagOn && (
        <>
          <ul className="tripo-debug-hud-list">
            {d.iblOff && <li>IBL off · Alt+Shift+1</li>}
            {d.noNormalMaps && <li>Normals stripped · Alt+Shift+2</li>}
            {d.matteForced && (
              <li>Ultra matte (drops rough./metal maps) · Alt+Shift+3</li>
            )}
            {d.clearcoatZero && (
              <li>Clearcoat + sheen off · Alt+Shift+4</li>
            )}
          </ul>
          <div className="tripo-debug-hud-hint">
            Alt+Shift+0 reset · Mac: Option (⌥) + Shift + digit (Shift alone does nothing)
          </div>
        </>
      )}

      {diagOn && probe != null && (
        <div className="tripo-debug-hud-notes">
          {d.clearcoatZero && probe.physicalMaterials === 0 && (
            <p className="tripo-debug-hud-note">
              Alt+Shift+4 only affects MeshPhysicalMaterial — probe shows none, so no expected change.
            </p>
          )}
          {d.clearcoatZero &&
            probe.physicalMaterials > 0 &&
            probe.slotsWithStrongClearcoat === 0 &&
            probe.slotsWithStrongSheen === 0 && (
              <p className="tripo-debug-hud-note">
                Clearcoat and sheen both ≤ probe threshold — Alt+Shift+4 has little to remove; unchanged look is
                expected.
              </p>
            )}
          {d.noNormalMaps && probe.slotsWithNormalOrBump > 0 && (
            <p className="tripo-debug-hud-note">
              One tangent map is stripped; on dense meshes the effect can be subtle — try orbiting to a grazing angle.
            </p>
          )}
        </div>
      )}

      {probe != null && (
        <div className="tripo-debug-hud-probe">
          Std mats {probe.standardMaterialSlots}, bump/normal tex {probe.slotsWithNormalOrBump},
          Physical {probe.physicalMaterials}, clearcoat {">"} 0.02:{" "}
          {probe.slotsWithStrongClearcoat}, sheen {">"} 0.02: {probe.slotsWithStrongSheen}
          {diagOn &&
            probe.slotsWithNormalOrBump === 0 &&
            " · no bump/normal textures in this asset — Alt+Shift+2 is a no-op."}
        </div>
      )}

      {devProbeOnly && (
        <div className="tripo-debug-hud-hint">Use Alt+Shift+1–4 to bisect; this footer only appears when a toggle is on in production builds</div>
      )}
    </div>
  );
}
