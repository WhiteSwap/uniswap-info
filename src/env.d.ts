/// <reference types="vite/client" />

interface ImportMetaEnvironment {
  readonly VITE_APP_TITLE: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnvironment
}
