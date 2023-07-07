import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.REACT_APP_TRON_API,
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
