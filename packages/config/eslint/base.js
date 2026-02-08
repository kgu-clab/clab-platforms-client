import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', ['parent', 'sibling'], 'index'],
          pathGroups: [
            { pattern: '@/app/**', group: 'external', position: 'after' },
            { pattern: '@/pages/**', group: 'external', position: 'after' },
            { pattern: '@/model/**', group: 'external', position: 'after' },
            { pattern: '@/types/**', group: 'external', position: 'after' },
            { pattern: '@/components/**', group: 'external', position: 'after' },
            { pattern: '@/shared/**', group: 'external', position: 'after' },
            { pattern: '@/**', group: 'external', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
    },
  },
  // Prettier와 충돌하는 ESLint 규칙 비활성화 (semi, quotes, indent, comma-dangle 등)
  eslintConfigPrettier,
];
