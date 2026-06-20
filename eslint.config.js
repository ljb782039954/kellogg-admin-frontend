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
      '**/features/*/api',
      '**/features/*/api/*',
      '**/features/*/model',
      '**/features/*/model/*',
      '**/features/*/ui',
      '**/features/*/ui/*',
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
              group: ['@/features/*', '@/features/**', '**/features/*', '**/features/**'],
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
              name: '@/shared/api/client',
              message: 'Feature UI must not call the shared API client directly.',
            },
          ],
          patterns: [
            ...privateFeatureImports,
            {
              group: ['**/lib/api', '**/shared/api/client', '**/context/ContentContext',
                      '**/admin/components', '**/admin/pageBuilder'],
              message: 'Feature UI must not use legacy admin paths.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/*/api/**/*.{ts,tsx}', 'src/features/*/model/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/ui/**', '**/ui/primitives/**', '**/ui/themes/**'],
              message: 'Feature api/model must not depend on ui.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/shared/api/client',
              message: 'UI must not call the API client directly.',
            },
          ],
          patterns: [
            {
              group: ['**/features/*/api/**', '**/features/*/model/**', '**/features/*/ui/**'],
              message: 'UI must not import feature internal paths.',
            },
          ],
        },
      ],
    },
  },
])
