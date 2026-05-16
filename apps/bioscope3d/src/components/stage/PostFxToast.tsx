import { useEffect, useRef, useState, type AnimationEvent } from "react";
import { createPortal } from "react-dom";
import { useAppStore } from "@stores/useAppStore";
import { useT } from "@/i18n/I18nProvider";

/**
 * Brief HUD when bloom / PP stack toggles (F2).
 * Portals to `document.body` with `position: fixed` so `.stage { overflow:hidden }`
 * never clips the banner.
 */
export function PostFxToast() {
  const t = useT();
  const postFxEnabled = useAppStore((s) => s.postFxEnabled);
  const prevEnabled = useRef<boolean | null>(null);
  const [toast, setToast] = useState<{ stamp: number; on: boolean } | null>(null);

  useEffect(() => {
    if (prevEnabled.current === null) {
      prevEnabled.current = postFxEnabled;
      return;
    }
    if (prevEnabled.current !== postFxEnabled) {
      prevEnabled.current = postFxEnabled;
      setToast({ stamp: Date.now(), on: postFxEnabled });
    }
  }, [postFxEnabled]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(id);
  }, [toast]);

  if (!toast || typeof document === "undefined") return null;

  function handleAnimationEnd(e: AnimationEvent<HTMLDivElement>) {
    if (e.animationName !== "postfx-toast-cycle") return;
    setToast(null);
  }

  return createPortal(
    <div
      key={toast.stamp}
      className="postfx-toast"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      onAnimationEnd={handleAnimationEnd}
    >
      <span className="postfx-toast-msg">{toast.on ? t.postFx.toastBloomOn : t.postFx.toastBloomOff}</span>
      <span className="postfx-toast-hint">{t.postFx.hotkeyHint}</span>
    </div>,
    document.body
  );
}
