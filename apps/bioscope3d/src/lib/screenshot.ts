/**
 * F28 — Stage screenshot.
 *
 * Prefer `<model-viewer>.toBlob()` when the specimen uses the model-viewer
 * path (canvas lives in shadow DOM). Otherwise fall back to any `.cell-scene
 * canvas` from a legacy R3F embed.
 */
type ModelViewerCapture = HTMLElement & {
  toBlob?: (opts?: { idealAspect?: boolean }) => Promise<Blob | null>;
};

function downloadPngBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function captureStage(cellId: string): boolean {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp =
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    "-" +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds());
  const filename = `bioscope3d-${cellId}-${stamp}.png`;

  const mv = document.querySelector(".cell-scene model-viewer") as ModelViewerCapture | null;
  if (mv && typeof mv.toBlob === "function") {
    void mv
      .toBlob({ idealAspect: false })
      .then((blob) => {
        if (!blob) return;
        downloadPngBlob(blob, filename);
      })
      .catch((err: unknown) => {
        console.error("[BioScope3D] model-viewer screenshot failed:", err);
      });
    return true;
  }

  const canvas = document.querySelector<HTMLCanvasElement>(".cell-scene canvas");
  if (!canvas) return false;

  try {
    canvas.toBlob((blob) => {
      if (!blob) return;
      downloadPngBlob(blob, filename);
    }, "image/png");
    return true;
  } catch (err) {
    console.error("[BioScope3D] screenshot failed:", err);
    return false;
  }
}
