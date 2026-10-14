import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import perfectionist from 'eslint-plugin-perfectionist'

export default [
  // Global ignores
  {
    ignores: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/__tests__/**',
      '**/dist/**',
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-interfaces': ['error'],
      'perfectionist/sort-objects': ['error', { type: 'alphabetical' }],
    },
    settings: {
      perfectionist: {
        partitionByComment: true,
        type: 'line-length',
      },
    },
  },
]
