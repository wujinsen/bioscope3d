/** Vite `base`-aware URL for files under `public/` (assets, models). */
export function publicUrl(path: string): string {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${clean}`;
}
