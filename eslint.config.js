import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Router aur store config files hain, component files nahi — inme
    // `lazy()` calls aur reducer imports hoti hain jo react-refresh rule
    // ko component-export violation samajh aata hai. Fast refresh in
    // files ke liye relevant nahi hai, isliye rule yahan band hai.
    files: ['src/app/router.jsx', 'src/app/store.js'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
