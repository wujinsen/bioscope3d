/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ASSET_BASE?: string;
  readonly VITE_PLAUSIBLE_DOMAIN?: string;
  readonly VITE_ENABLE_TIMELINE?: string;
  readonly VITE_ENABLE_QUIZ?: string;
  readonly VITE_ENABLE_CLIPPING?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.glb" {
  const src: string;
  export default src;
}

declare module "*.hdr" {
  const src: string;
  export default src;
}
