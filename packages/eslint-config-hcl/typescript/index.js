import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import importResolverTypescript from 'eslint-import-resolver-typescript';

import baseConfig from '../index.js';
import tsRules from '../rules/typescript.js';

export default [
  ...baseConfig,
  {
    files: ['**/*.{ts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        createDefaultProgram: true,
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.d.ts'],
      },
      'import/resolver': {
        typescript: importResolverTypescript,
      },
      'import/extensions': ['.js', '.ts', '.mjs'],
    },
  },
  {
    files: ['**/*.{ts}'],
    ...tsRules,
  },
];