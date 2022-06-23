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
    'plugin:unicorn/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'sonarjs', 'unicorn'],
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
        checkFilenames: false,
        allowList: {
          props: true,
          ref: true,
          Args: true
        }
      }
    ]
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
