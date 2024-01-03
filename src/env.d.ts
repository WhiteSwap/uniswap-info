/// <reference types="vite/client" />

declare const thing: typeof object

declare module '*.svg' {
  import * as React from 'react'
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>
}

declare namespace NodeJS {
  interface ImportMetaEnvironment {
    VITE_ENV: string
    VITE_VERSION: string
    VITE_TRON_GRAPH: string
    VITE_ETHEREUM_GRAPH: string
    VITE_POLYGON_GRAPH: string
    VITE_POLYGON_ZKEVM_GRAPH: string

    VITE_GOOGLE_ANALYTICS_ID: string
    VITE_GTM_ID: string

    VITE_SENTRY_DSN: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnvironment
  }
}
