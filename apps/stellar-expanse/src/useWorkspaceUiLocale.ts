import { useCallback, useEffect, useState } from "react";
import {
  detectWorkspaceUiLocale,
  isWorkspaceUiLocale,
  readWorkspaceUiLocale,
  writeWorkspaceUiLocale,
  WORKSPACE_UI_LOCALE_STORAGE_KEY,
  type WorkspaceUiLocale,
} from "@bioscope3d/workspace-ui-locale";

export function useWorkspaceUiLocale(): readonly [
  WorkspaceUiLocale,
  (next: WorkspaceUiLocale) => void,
] {
  const [loc, setLoc] = useState<WorkspaceUiLocale>(
    () => readWorkspaceUiLocale() ?? detectWorkspaceUiLocale()
  );

  const setUiLocale = useCallback((next: WorkspaceUiLocale) => {
    writeWorkspaceUiLocale(next);
    setLoc(next);
  }, []);

  useEffect(() => {
    if (!readWorkspaceUiLocale()) writeWorkspaceUiLocale(loc);
  }, [loc]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = loc;
    document.body.dataset.locale = loc;
  }, [loc]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== WORKSPACE_UI_LOCALE_STORAGE_KEY || !e.newValue) return;
      if (!isWorkspaceUiLocale(e.newValue)) return;
      setLoc(e.newValue);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return [loc, setUiLocale] as const;
}
