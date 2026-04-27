/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DISABLE_AUTH?: string;
  readonly VITE_USE_INMEMORY_DB?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

