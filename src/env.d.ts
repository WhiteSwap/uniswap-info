/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ImportMetaEnvironment {
    readonly VITE_APP_TITLE: string
    VITE_APP_TRON_GRAPH: string
    VITE_APP_ETHEREUM_GRAPH: string
    VITE_APP_POLYGON_GRAPH: string
    VITE_APP_GOOGLE_ANALYTICS_ID: string
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnvironment
}
