import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: import.meta.env.VITE_TRON_GRAPH,
  documents: ['src/service/queries/*.ts'],
  emitLegacyCommonJSImports: false,
  ignoreNoDocuments: true,
  generates: {
    './src/service/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-operations']
    }
  }
}

export default config
