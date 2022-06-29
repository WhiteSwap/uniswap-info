module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:react/jsx-runtime',
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'sonarjs', 'unicorn', 'import', 'no-relative-import-paths'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'react/prop-types': 0,
    // TODO: restore cognitive complexity to 15
    'sonarjs/cognitive-complexity': ['error', 50],
    'unicorn/prefer-module': 0,
    'unicorn/prefer-node-protocol': 0,
    'unicorn/no-array-reduce': 0,
    'unicorn/no-useless-undefined': 0,
    'unicorn/no-null': 0,
    'unicorn/no-nested-ternary': 0,
    'unicorn/prefer-query-selector': 0,
    'unicorn/no-array-for-each': 0,
    'unicorn/prefer-object-from-entries': 0,
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          camelCase: true,
          pascalCase: true
        },
        ignore: ['^react-app-env\\.d\\.ts$']
      }
    ],
    'unicorn/prevent-abbreviations': [
      'error',
      {
        allowList: {
          env: true,
          props: true,
          ref: true,
          Args: true
        }
      }
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['../*'],
            message: 'Usage of relative parent imports is not allowed.'
          }
        ]
      }
    ],
    'no-relative-import-paths/no-relative-import-paths': ['warn', { allowSameFolder: true, rootDir: 'src' }],
    'import/no-named-as-default-member': 0,
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'object', 'type', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'builtin',
            position: 'before'
          }
        ],
        pathGroupsExcludedImportTypes: ['react'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ]
  },
  settings: {
    'react': {
      version: 'detect'
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true
      },
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  }
}
