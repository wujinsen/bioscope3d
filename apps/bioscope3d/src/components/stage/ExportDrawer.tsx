import { X, Boxes, Image as ImageIcon, FileText, NotebookPen } from "lucide-react";
import { useAppStore } from "@stores/useAppStore";
import { useT } from "@/i18n/I18nProvider";
import type { Translations } from "@/i18n/types";

type CatKey = "model" | "image" | "citation" | "notebook";
type ItemKey = keyof Translations["exportDrawer"]["item"];
type OptKey = keyof Translations["exportDrawer"]["opt"];

interface CategoryDef {
  key: CatKey;
  icon: typeof Boxes;
  items: { itemKey: ItemKey; ext: string }[];
  optKeys: OptKey[];
}

const CATEGORIES: CategoryDef[] = [
  {
    key: "model",
    icon: Boxes,
    items: [
      { itemKey: "glb",  ext: ".glb" },
      { itemKey: "gltf", ext: ".gltf" },
      { itemKey: "usdz", ext: ".usdz" },
      { itemKey: "fbx",  ext: ".fbx" },
      { itemKey: "obj",  ext: ".obj" },
    ],
    optKeys: ["umScale", "bakeAo", "selectedOnly"],
  },
  {
    key: "image",
    icon: ImageIcon,
    items: [
      { itemKey: "png4k",     ext: ".png" },
      { itemKey: "pngLabels", ext: ".png" },
      { itemKey: "spin",      ext: ".mp4" },
      { itemKey: "tour",      ext: ".mp4" },
      { itemKey: "svg",       ext: ".svg" },
    ],
    optKeys: ["caveatCallouts", "watermark"],
  },
  {
    key: "citation",
    icon: FileText,
    items: [
      { itemKey: "bibtex", ext: ".bib" },
      { itemKey: "ris",    ext: ".ris" },
      { itemKey: "apa",    ext: "copy" },
      { itemKey: "doi",    ext: "copy" },
    ],
    optKeys: ["includeRefs", "timestamp"],
  },
  {
    key: "notebook",
    icon: NotebookPen,
    items: [
      { itemKey: "mdBundle",     ext: ".zip" },
      { itemKey: "notion",       ext: "link" },
      { itemKey: "obsidian",     ext: ".md" },
      { itemKey: "sendNotebook", ext: "save" },
    ],
    optKeys: ["coverView", "autoLink"],
  },
];

export function ExportDrawer() {
  const t = useT();
  const close = useAppStore((s) => s.closeExport);
  const ed = t.exportDrawer;

  return (
    <div className="export-drawer" role="dialog" aria-label={ed.title}>
      <div className="head">
        <div>
          <div className="title">{ed.title}</div>
          <div className="sub">{ed.subtitle}</div>
        </div>
        <button className="close" onClick={close} aria-label={ed.close}>
          <X width={14} height={14} />
        </button>
      </div>
      <div className="export-grid">
        {CATEGORIES.map(({ key, icon: Icon, items, optKeys }) => (
          <div className="export-cat" key={key}>
            <div className="cat-head">
              <Icon />
              <span className="nm">{ed.cat[key]}</span>
            </div>
            <ul>
              {items.map((it) => (
                <li key={it.itemKey}>
                  {ed.item[it.itemKey]}
                  <span className="ext">{it.ext}</span>
                </li>
              ))}
            </ul>
            {optKeys.map((ok, i) => (
              <label key={ok} className="opt">
                <input type="checkbox" defaultChecked={i < 2} /> {ed.opt[ok]}
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
