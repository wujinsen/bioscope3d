/* Core domain types */

export type Mode = "explore" | "teach" | "research";

export type HdriPreset = "studio" | "lab" | "sunset";

/** WebGLRenderer tone curve — Neutral aligns with model-viewer defaults. */
export type StageToneMapping = "neutral" | "aces";

export type CellId =
  | "plant"
  | "animal"
  | "cancer"
  | "bacteria"
  | "rbc"
  | "neuron"
  | "wbc"
  | "muscle";

export type OrganelleId =
  | "nucleus"
  | "nucleolus"
  | "chloroplast"
  | "vacuole"
  | "mitochondria"
  | "rough-er"
  | "cell-wall"
  | "membrane"
  | "ribosome"
  | "golgi"
  | "lysosome"
  | "centrosome"
  | "smooth-er";

/**
 * Per-cell camera rig (v0.4).
 * Position and target are in world units, applied with a damped lerp when the
 * user switches cells or presses R / F23 reset. Tuned to mimic the "fixed-camera
 * with slow self-rotation" framing seen in the reference Tripo video.
 */
export interface CameraPreset {
  position: [x: number, y: number, z: number];
  target:   [x: number, y: number, z: number];
  /** Optional vertical field of view in degrees. Defaults to 35. */
  fov?: number;
}

export interface CellMeta {
  id: CellId;
  name: string;
  subtype: string;
  oneLiner: string;
  taxonomy: [kingdom: string, group: string, type: string];
  signatureColor: string;
  thumbnail: string;
  heroScene: string;
  modelPath?: string;
  /**
   * Tripo GLB orientation differs per asset: thin along X → broad face YZ (camera on ±X);
   * thin along Z → broad face XY (camera on ±Z). Only used when wiring presets into
   * `<model-viewer>` (`cameraPreset.ts`).
   */
  tripoThinAlong?: "x" | "z";
  /**
   * `<model-viewer>` orbit radius as % of framed scene bounds (Tripo models only).
   * Lower pulls the camera in so the mesh fills more of the viewport. Default 108.
   */
  tripoViewerRadiusPct?: number;
  /**
   * Tripo `<model-viewer>` polar angle (degrees). Lower ≈ more top-down — useful for
   * hemisphere “dish” meshes where the cross-section faces upward. Default 78.
   */
  tripoViewerPhiDeg?: number;
  stageFallback?: "hero" | "paper";
  estimatedSize: string;
  /** Seconds this cell dwells during Auto Tour (F03). Matches video segment lengths. */
  dwellSeconds: number;
  /** Camera framing used when entering this cell or pressing R (F05 + F23). */
  cameraPreset: CameraPreset;
}

export interface Organelle {
  id: OrganelleId;
  name: string;
  color: string;
  countLabel: string;
  visibleInLM: boolean;
  description: string;
  size: string;
  location: string;
  funFact?: string;
}

export interface CalloutAnchor {
  organelle: OrganelleId;
  label: string;
  sub?: string;
  labelPos: [x: number, y: number];
  anchorPos: [x: number, y: number];
  targetPos: [x: number, y: number];
}

export interface CellContent {
  cell: CellMeta;
  organelles: Organelle[];
  callouts: CalloutAnchor[];
  whereItOccurs: { sceneImage: string; description: string };
}

export interface AppState {
  mode: Mode;
  activeCell: CellId;
  activeOrganelle: OrganelleId | null;
  favorites: Set<CellId>;
  labelsVisible: boolean;
  crossSectionOn: boolean;
  hudOn: boolean;
  exportDrawerOpen: boolean;
  touring: boolean;
  pbrPopoverOpen: boolean;
}

/** Bisect Tripo/glTF sparkle (IBL/spec/clearcoat/normals) — ephemeral; never persisted. */
export interface TripoDebugFlags {
  iblOff: boolean;
  noNormalMaps: boolean;
  matteForced: boolean;
  clearcoatZero: boolean;
}

export const TRIPO_DEBUG_INITIAL: TripoDebugFlags = {
  iblOff: false,
  noNormalMaps: false,
  matteForced: false,
  clearcoatZero: false,
};

/** Counted after CellModel clones materials — explains when Alt+Shift+2/4 have little effect. */
export interface TripoMaterialProbe {
  standardMaterialSlots: number;
  slotsWithNormalOrBump: number;
  physicalMaterials: number;
  slotsWithStrongClearcoat: number;
  slotsWithStrongSheen: number;
}
