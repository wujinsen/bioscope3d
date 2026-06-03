/* ───────────────────────────────────────────────────────────────────────────
   BioScope3D · i18n types
   Single source of truth for the shape of UI translations.
   - en.ts is the canonical implementation (used to derive the type via Translations).
   - zh.ts and ja.ts must `satisfies Translations` to stay structurally complete.
   ─────────────────────────────────────────────────────────────────────────── */

export const LOCALES = ["en", "zh", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_META: Record<Locale, { short: string; long: string; native: string }> = {
  en: { short: "EN", long: "English",  native: "English"   },
  zh: { short: "中", long: "Chinese",  native: "简体中文"  },
  ja: { short: "日", long: "Japanese", native: "日本語"    },
};

/** UI translation strings. Cells/organelles use string maps keyed by id. */
export interface Translations {
  brand: {
    tagline: string;
  };
  nav: {
    gallery: string;
    library: string;
    notebooks: string;
    quiz: string;
    settings: string;
  };
  mode: {
    explore: { label: string; title: string };
    teach:   { label: string; title: string };
    research:{ label: string; title: string };
  };
  langSwitch: {
    label: string;
    activeAria: string;
  };
  sidebarLeft: {
    cellTypes: string;
    organelles: string;
  };
  sidebarRight: {
    organelleDetails: string;
    biologicalNotes: string;
    whereItOccurs: string;
    aboutNotes: string;
    funFact: string;
    funFactFallback: string;
    yes: string;
    no: string;
    rows: {
      size: string;
      location: string;
      visibleInLM: string;
      label: string;
    };
    nucleusEpithet: string;
    leafTreeAlt: string;
    plantInLeafTitle: string;
  };
  canvasHead: {
    toggleHud: string;
    favorite: string;
    pbrPillTitle: string;
    pbrPillRebake: string;
    pbrPillOriginal: string;
    pbr: {
      title: string;
      baseColor: string;
      normal: string;
      ao: string;
      roughness: string;
      metallic: string;
      materialResponse: string;
      rebake: string;
      original: string;
      toneLabel: string;
      toneNeutral: string;
      toneAces: string;
    };
  };
  microscope: {
    title: string;
    tooltip: string;
    light: string;
    stained: string;
    electron: string;
    addImage: string;
  };
  compare: {
    title: string;
    tooltip: string;
    youAreHere: string;
    swap: string;
    open: string;
  };
  toolbar: {
    measure: string;
    rotate: string;
    isolate: string;
    hideOthers: string;
    reset: string;
    screenshot: string;
    cinema: string;
    cinemaOff: string;
    authorTour: string;
    export: string;
    titles: {
      measure: string;
      rotate: string;
      isolate: string;
      hideOthers: string;
      reset: string;
      screenshot: string;
      cinema: string;
      authorTour: string;
      export: string;
    };
  };
  postIt: {
    title: string;
    drag: string;
    scroll: string;
    pan: string;
    dismiss: string;
  };
  hud: {
    specimen: string;
    scale: string;
    orbit: string;
    hdri: string;
  };
  viewMode: {
    title: string;
    solid: string;
    layered: string;
    point: string;
    labels: string;
    crossSection: string;
  };
  stageViewer: {
    loading: string;
    loadFailed: string;
  };
  exportDrawer: {
    title: string;
    subtitle: string;
    close: string;
    cat: {
      model: string;
      image: string;
      citation: string;
      notebook: string;
    };
    item: {
      glb: string;
      gltf: string;
      usdz: string;
      fbx: string;
      obj: string;
      png4k: string;
      pngLabels: string;
      spin: string;
      tour: string;
      svg: string;
      bibtex: string;
      ris: string;
      apa: string;
      doi: string;
      mdBundle: string;
      notion: string;
      obsidian: string;
      sendNotebook: string;
    };
    opt: {
      umScale: string;
      bakeAo: string;
      selectedOnly: string;
      caveatCallouts: string;
      watermark: string;
      includeRefs: string;
      timestamp: string;
      coverView: string;
      autoLink: string;
    };
  };
  tour: {
    cellOf: (n: number, total: number) => string;
    /** "M:SS / M:SS" — caller passes elapsed and remaining seconds. */
    timecode: (elapsedSec: number, totalSec: number) => string;
    play: string;
    pause: string;
    prev: string;
    next: string;
    jumpToTitle: (cellName: string) => string;
    exit: string;
  };
  cinema: {
    enter: string;
    exit: string;
    hintEsc: string;
  };
  screenshot: {
    title: string;
    successAria: (filename: string) => string;
    failure: string;
    notAvailable: string;
  };
  /** Ephemeral HUD when bloom / PP stack toggles (F2). */
  postFx: {
    toastBloomOn: string;
    toastBloomOff: string;
    hotkeyHint: string;
  };
  cells: Record<CellKey, CellStrings>;
  organelles: {
    /** Per-cell, per-organelle UI strings. Falls back to id when missing. */
    byCell: Record<CellKey, Record<string, OrganelleStrings>>;
    /** Stable count tokens that appear across cells. Numeric counts (×1, ×40) pass through. */
    countTokens: {
      cellulose: string;
      peptidoglycan: string;
      phospho: string;
      biconcave: string;
      net: string;
      patches: string;
      multiLobed: string;
      manyPeripheral: string;
      dense: string;
      many: string;
      infinite: string;
    };
  };
}

export type CellKey =
  | "plant"
  | "animal"
  | "cancer"
  | "bacteria"
  | "rbc"
  | "neuron"
  | "wbc"
  | "muscle";

export interface CellStrings {
  name: string;
  subtype: string;
  oneLiner: string;
  taxonomy: [string, string, string];
}

export interface OrganelleStrings {
  name: string;
  description: string;
  size: string;
  location: string;
  funFact?: string;
}
