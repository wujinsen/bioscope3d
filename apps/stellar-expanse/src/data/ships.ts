export type ShipBar = {
  label: string;
  value: string;
  pct: number;
  color: string;
};

export type Ship = {
  id: string;
  image: string;
  /** Optional GLB under `public/` (e.g. `/models/nomad.glb`). Omit to use the bundled hero model. */
  modelPath?: string;
  name: string;
  cls: string;
  role: string;
  manufacturer: string;
  heroPos: string;
  thumbPos: string;
  cost: number;
  compare: string;
  bars: ShipBar[];
};

export const SHIPS: Ship[] = [
  {
    id: "artemis-hauler",
    image: "/stellar/ship-1.svg",
    name: "Artemis-Class Hauler",
    cls: "Artemis",
    role: "Hauler",
    manufacturer: "Omni-Tech",
    heroPos: "36% 43%",
    thumbPos: "50% 52%",
    cost: 2600,
    compare: "Compared to current ship: +400 Cargo Capacity",
    bars: [
      { label: "Cargo Capacity", value: "1,000", pct: 96, color: "var(--bar-cargo)" },
      { label: "Jump Range", value: "16 LY", pct: 52, color: "var(--bar-jump)" },
      { label: "Hull Integrity", value: "850", pct: 82, color: "var(--bar-hull)" },
      { label: "Shield Rating", value: "200", pct: 24, color: "var(--bar-shield)" },
    ],
  },
  {
    id: "nomad",
    image: "/stellar/ship-2.svg",
    name: "The Nomad",
    cls: "Nomad",
    role: "Hauler",
    manufacturer: "Omni-Tech",
    heroPos: "38% 44%",
    thumbPos: "50% 52%",
    cost: 3200,
    compare: "Compared to current ship: +200 Cargo Capacity",
    bars: [
      { label: "Cargo Capacity", value: "1,000", pct: 96, color: "var(--bar-cargo)" },
      { label: "Jump Range", value: "16 LY", pct: 50, color: "var(--bar-jump)" },
      { label: "Hull Integrity", value: "850", pct: 80, color: "var(--bar-hull)" },
      { label: "Shield Rating", value: "200", pct: 24, color: "var(--bar-shield)" },
    ],
  },
  {
    id: "vanguard",
    image: "/stellar/ship-3.svg",
    name: "Vanguard Explorer",
    cls: "Vanguard",
    role: "Explorer",
    manufacturer: "Omni-Tech",
    heroPos: "40% 44%",
    thumbPos: "50% 52%",
    cost: 3200,
    compare: "Compared to current ship: +200 Cargo Capacity",
    bars: [
      { label: "Cargo Capacity", value: "920", pct: 88, color: "var(--bar-cargo)" },
      { label: "Jump Range", value: "22 LY", pct: 72, color: "var(--bar-jump)" },
      { label: "Hull Integrity", value: "780", pct: 74, color: "var(--bar-hull)" },
      { label: "Shield Rating", value: "280", pct: 32, color: "var(--bar-shield)" },
    ],
  },
  {
    id: "falcon",
    image: "/stellar/ship-4.svg",
    name: "Falcon MK II",
    cls: "Falcon",
    role: "Hauler",
    manufacturer: "Omni-Tech",
    heroPos: "35% 43%",
    thumbPos: "50% 52%",
    cost: 5200,
    compare: "Compared to current ship: +700 Cargo Capacity",
    bars: [
      { label: "Cargo Capacity", value: "1,000", pct: 96, color: "var(--bar-cargo)" },
      { label: "Jump Range", value: "16 LY", pct: 36, color: "var(--bar-jump)" },
      { label: "Hull Integrity", value: "850", pct: 74, color: "var(--bar-hull)" },
      { label: "Shield Rating", value: "200", pct: 22, color: "var(--bar-shield)" },
    ],
  },
  {
    id: "artemis-g6",
    image: "/stellar/ship-5.svg",
    name: "Artemis G-6",
    cls: "Artemis",
    role: "Hauler",
    manufacturer: "Omni-Tech",
    heroPos: "37% 44%",
    thumbPos: "50% 52%",
    cost: 500,
    compare: "Compared to current ship: +8,000 Cargo Capacity",
    bars: [
      { label: "Cargo Capacity", value: "1,000", pct: 96, color: "var(--bar-cargo)" },
      { label: "Jump Range", value: "16 LY", pct: 58, color: "var(--bar-jump)" },
      { label: "Hull Integrity", value: "850", pct: 86, color: "var(--bar-hull)" },
      { label: "Shield Rating", value: "200", pct: 22, color: "var(--bar-shield)" },
    ],
  },
];
