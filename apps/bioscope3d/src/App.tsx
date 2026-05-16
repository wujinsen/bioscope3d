import { useEffect } from "react";
import { useAppStore } from "@stores/useAppStore";
import { useGlobalHotkeys } from "@hooks/useKeyboard";
import { useTour } from "@hooks/useTour";
import { StudioLayout } from "./layouts/StudioLayout";

export default function App() {
  const mode = useAppStore((s) => s.mode);
  const activeCell = useAppStore((s) => s.activeCell);
  const exportDrawerOpen = useAppStore((s) => s.exportDrawerOpen);
  const touring = useAppStore((s) => s.touring);
  const labelsVisible = useAppStore((s) => s.labelsVisible);
  const cinema = useAppStore((s) => s.cinema);
  const postFxEnabled = useAppStore((s) => s.postFxEnabled);

  useGlobalHotkeys();
  useTour();

  // Sync state onto <body> so existing v3.2 CSS selectors keep working
  useEffect(() => {
    document.body.dataset.mode = mode;
    document.body.dataset.cell = activeCell;
    document.body.classList.toggle("export-open", exportDrawerOpen);
    document.body.classList.toggle("touring", touring);
    document.body.classList.toggle("no-labels", !labelsVisible);
    document.body.classList.toggle("cinema", cinema);
    document.body.dataset.postfx = postFxEnabled ? "on" : "off";
  }, [mode, activeCell, exportDrawerOpen, touring, labelsVisible, cinema, postFxEnabled]);

  return <StudioLayout />;
}
