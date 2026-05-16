import type { CellId, Organelle, CalloutAnchor } from "@/types";

/**
 * Per-cell organelle lists.
 *
 * Coordinates for callout label/anchor/target are in percent (0-100)
 * of the stage area.  They are tuned for the v3.2 reference hero
 * image of a plant cell.  When R3F replaces the hero, these will be
 * recomputed from 3D world-positions via OrganelleLabels3D.
 */

export const ORGANELLES_BY_CELL: Record<CellId, Organelle[]> = {
  plant: [
    {
      id: "nucleus",
      name: "Nucleus",
      color: "var(--lilac)",
      countLabel: "×1",
      visibleInLM: true,
      description: "The control center, enclosed by a double membrane with regulated pores.",
      size: "5–10 µm in diameter",
      location: "Usually central",
      funFact: "The nucleus was one of the first cell structures ever discovered.",
    },
    { id: "nucleolus",    name: "Nucleolus",    color: "#a17ec5", countLabel: "×1",        visibleInLM: false, description: "Ribosome factory inside the nucleus.", size: "1–3 µm", location: "Inside nucleus" },
    { id: "chloroplast",  name: "Chloroplast",  color: "var(--cell-plant)", countLabel: "×40", visibleInLM: true, description: "Photosynthesis happens here.", size: "5–10 µm", location: "Cytoplasm" },
    { id: "vacuole",      name: "Vacuole",      color: "#3da59a", countLabel: "×1",        visibleInLM: true,  description: "Stores water, nutrients, and waste.", size: "up to 90% of cell volume", location: "Central" },
    { id: "mitochondria", name: "Mitochondria", color: "var(--cell-rbc)", countLabel: "×120", visibleInLM: false, description: "Power generators — ATP production.", size: "0.5–10 µm", location: "Throughout cytoplasm" },
    { id: "rough-er",     name: "Rough ER",     color: "#c2864a", countLabel: "net",       visibleInLM: false, description: "Studded with ribosomes — protein synthesis.", size: "Network", location: "Surrounding nucleus" },
    { id: "cell-wall",    name: "Cell Wall",    color: "#8a7a5e", countLabel: "cellulose", visibleInLM: true,  description: "Rigid outer layer made of cellulose.", size: "0.1–10 µm thick", location: "Outermost layer" },
    { id: "membrane",     name: "Membrane",     color: "#967a4e", countLabel: "phospho",   visibleInLM: false, description: "Selectively permeable phospholipid bilayer.", size: "7–10 nm thick", location: "Inside cell wall" },
  ],
  animal: [
    { id: "nucleus",      name: "Nucleus",      color: "var(--lilac)", countLabel: "×1",  visibleInLM: true,  description: "Control center.", size: "5–10 µm", location: "Usually central" },
    { id: "mitochondria", name: "Mitochondria", color: "var(--cell-rbc)", countLabel: "×500", visibleInLM: false, description: "ATP factories.", size: "0.5–10 µm", location: "Cytoplasm" },
    { id: "rough-er",     name: "Rough ER",     color: "#c2864a", countLabel: "net",       visibleInLM: false, description: "Protein synthesis.", size: "Network", location: "Around nucleus" },
    { id: "golgi",        name: "Golgi",        color: "#b58aa4", countLabel: "×3",        visibleInLM: false, description: "Packages & ships proteins.", size: "1–2 µm", location: "Near ER" },
    { id: "lysosome",     name: "Lysosome",     color: "#7e6cad", countLabel: "×300",      visibleInLM: false, description: "Cellular digestion.", size: "0.1–1 µm", location: "Cytoplasm" },
    { id: "centrosome",   name: "Centrosome",   color: "#a99478", countLabel: "×1",        visibleInLM: false, description: "Cell-division spindle hub.", size: "0.5 µm", location: "Near nucleus" },
    { id: "membrane",     name: "Membrane",     color: "#967a4e", countLabel: "phospho",   visibleInLM: false, description: "Plasma membrane.", size: "7–10 nm", location: "Outermost layer" },
  ],
  cancer: [
    { id: "nucleus",      name: "Nucleus",      color: "var(--lilac)", countLabel: "×1 (atypical)", visibleInLM: true,  description: "Often enlarged; chromatin and division programs are dysregulated.", size: "5–12 µm", location: "Usually central" },
    { id: "mitochondria", name: "Mitochondria", color: "var(--cell-rbc)", countLabel: "×many", visibleInLM: false, description: "Metabolic wiring shifts to support rapid proliferation.", size: "0.5–10 µm", location: "Cytoplasm" },
    { id: "rough-er",     name: "Rough ER",     color: "#c2864a", countLabel: "net",       visibleInLM: false, description: "Protein synthesis load often increased.", size: "Network", location: "Around nucleus" },
    { id: "golgi",        name: "Golgi",        color: "#b58aa4", countLabel: "×3",        visibleInLM: false, description: "Secretory and processing hub.", size: "1–2 µm", location: "Near ER" },
    { id: "lysosome",     name: "Lysosome",     color: "#7e6cad", countLabel: "×300",      visibleInLM: false, description: "Degradation and turnover.", size: "0.1–1 µm", location: "Cytoplasm" },
    { id: "centrosome",   name: "Centrosome",   color: "#a99478", countLabel: "×1",        visibleInLM: false, description: "Mitotic spindle organization — frequently amplified in some cancers.", size: "0.5 µm", location: "Near nucleus" },
    { id: "membrane",     name: "Membrane",     color: "#967a4e", countLabel: "phospho",   visibleInLM: false, description: "Plasma membrane; adhesion and signaling often altered.", size: "7–10 nm", location: "Outermost layer" },
  ],
  bacteria: [
    { id: "nucleus",      name: "Nucleoid",     color: "#b09060", countLabel: "×1",        visibleInLM: false, description: "Bacterial 'nucleus' — DNA loop, no membrane.", size: "~1 µm", location: "Center" },
    { id: "ribosome",     name: "Ribosomes",    color: "#9a7d56", countLabel: "×∞",        visibleInLM: false, description: "70S protein factories.", size: "20 nm", location: "Cytoplasm" },
    { id: "cell-wall",    name: "Cell Wall",    color: "#8a7a5e", countLabel: "peptidoglycan", visibleInLM: true, description: "Rigid peptidoglycan layer.", size: "20–80 nm", location: "Outside membrane" },
    { id: "membrane",     name: "Membrane",     color: "#967a4e", countLabel: "phospho",   visibleInLM: false, description: "Plasma membrane.", size: "7–10 nm", location: "Inside wall" },
  ],
  rbc: [
    { id: "membrane",     name: "Membrane",     color: "var(--cell-rbc)", countLabel: "biconcave", visibleInLM: true, description: "Flexible biconcave envelope.", size: "7–8 µm wide", location: "Surface" },
  ],
  neuron: [
    { id: "nucleus",      name: "Nucleus",      color: "var(--lilac)",    countLabel: "×1",        visibleInLM: true,  description: "Within the soma.", size: "5 µm", location: "Cell body" },
    { id: "mitochondria", name: "Mitochondria", color: "var(--cell-rbc)", countLabel: "×many",     visibleInLM: false, description: "Power for action potentials.", size: "0.5–1 µm", location: "Throughout" },
    { id: "rough-er",     name: "Nissl bodies", color: "#c2864a",         countLabel: "patches",   visibleInLM: false, description: "Stacks of rough ER in neurons.", size: "Patches", location: "Soma" },
  ],
  wbc: [
    { id: "nucleus",      name: "Lobed nucleus",color: "var(--lilac-dk)", countLabel: "multi-lobed", visibleInLM: true,  description: "Multi-lobed nucleus typical of granulocytes.", size: "5 µm", location: "Off-center" },
    { id: "lysosome",     name: "Granules",     color: "#7e6cad",         countLabel: "×many",     visibleInLM: false, description: "Cytoplasmic granules with enzymes.", size: "0.1 µm", location: "Cytoplasm" },
  ],
  muscle: [
    { id: "nucleus",      name: "Nuclei",       color: "var(--lilac)",    countLabel: "×many (peripheral)", visibleInLM: true,  description: "Multinucleated, pushed to edges.", size: "5 µm", location: "Periphery" },
    { id: "mitochondria", name: "Mitochondria", color: "var(--cell-rbc)", countLabel: "×dense",   visibleInLM: false, description: "Between myofibrils.", size: "0.5–2 µm", location: "Sarcoplasm" },
  ],
};

/**
 * Plant-cell callouts tuned for the v3.2 hero image (`/assets/scenes/hero_plant.png`).
 * Coordinates are in percent (0–100) of the stage.
 */
export const PLANT_CALLOUTS: CalloutAnchor[] = [
  { organelle: "nucleus",      label: "Nucleus",       sub: "×1",         labelPos: [46, 6],  anchorPos: [47, 9],  targetPos: [50, 44] },
  { organelle: "chloroplast",  label: "Chloroplast",   sub: "×40",        labelPos: [76, 7],  anchorPos: [74, 10], targetPos: [66, 36] },
  { organelle: "vacuole",      label: "Vacuole",       sub: "×1",         labelPos: [5,  47], anchorPos: [8,  47], targetPos: [28, 50] },
  { organelle: "mitochondria", label: "Mitochondria",  sub: "×120",       labelPos: [94, 47], anchorPos: [92, 47], targetPos: [70, 52] },
  { organelle: "cell-wall",    label: "Cell Wall",     sub: "cellulose",  labelPos: [9,  91], anchorPos: [11, 88], targetPos: [17, 76] },
  { organelle: "rough-er",     label: "Rough ER",      sub: "network",    labelPos: [84, 87], anchorPos: [82, 84], targetPos: [70, 73] },
];

export function calloutsFor(cell: CellId): CalloutAnchor[] {
  if (cell === "plant") return PLANT_CALLOUTS;
  return PLANT_CALLOUTS; // TODO: per-cell callouts once each cell has its own hero
}
