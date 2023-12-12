/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ImportMetaEnvironment {
    readonly VITE_TITLE: string
    VITE_TRON_GRAPH: string
    VITE_ETHEREUM_GRAPH: string
    VITE_POLYGON_GRAPH: string
    VITE_GOOGLE_ANALYTICS_ID: string
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnvironment
}
