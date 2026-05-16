import { useAppStore } from "@stores/useAppStore";
import { useT } from "@/i18n/I18nProvider";

export function PostIt() {
  const t = useT();
  const dismissed = useAppStore((s) => s.postItDismissed);
  const dismiss = useAppStore((s) => s.dismissPostIt);
  if (dismissed) return null;

  return (
    <div className="postit">
      <span className="ttl">{t.postIt.title}</span>
      <span className="row">✦ {t.postIt.drag}</span>
      <span className="row">✦ {t.postIt.scroll}</span>
      <span className="row">✦ {t.postIt.pan}</span>
      <span className="dismiss" onClick={dismiss} aria-label={t.postIt.dismiss}>
        ×
      </span>
    </div>
  );
}
