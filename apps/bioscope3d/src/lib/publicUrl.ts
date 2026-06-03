/** Vite `base`-aware URL for files under `public/` (assets, models). */
export function publicUrl(path: string): string {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${clean}`;
}

/** GLB URLs with a deploy-time cache-bust query (avoids stale LFS pointer responses). */
export function publicModelUrl(path: string): string {
  const bust = import.meta.env.VITE_MODEL_CACHE_BUST ?? "1";
  const base = publicUrl(path);
  return `${base}${base.includes("?") ? "&" : "?"}v=${bust}`;
}
