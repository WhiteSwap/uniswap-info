export default {
  '**/*.ts?(x)': () => 'tsc --project tsconfig.json',
  '*.{js,jsx,ts,tsx}': 'eslint --cache --fix',
  '*.{js,jsx,ts,tsx,json}': 'prettier --write'
}
