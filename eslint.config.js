import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

const privateFeatureImports = [
  {
    group: [
      '@/features/*/api',
      '@/features/*/api/*',
      '@/features/*/model',
      '@/features/*/model/*',
      '@/features/*/ui',
      '@/features/*/ui/*',
    ],
    message: 'Import another feature through its public index.ts only.',
  },
]

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'no-restricted-imports': ['error', { patterns: privateFeatureImports }],
    },
  },
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            ...privateFeatureImports,
            {
              group: ['@/features/*', '@/features/**'],
              message: 'Shared code must not depend on business features.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/*/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/lib/api',
              message: 'Feature UI must call a controller or feature query, not the legacy API facade.',
            },
            {
              name: '@/shared/api/client',
              message: 'Feature UI must not call the shared API client directly.',
            },
            {
              name: '@/context/ContentContext',
              message: 'New feature UI must not add dependencies on ContentContext.',
            },
          ],
          patterns: privateFeatureImports,
        },
      ],
    },
  },
])
