import essentialConfig from '../index.js';
import tsRules from '../../rules/typescript.js';
import tsBlacklist from '../rules/ts-blacklist.js';
// // 显式导入并注册 @typescript-eslint
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';

export default [
  ...essentialConfig,
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
    ...tsRules,
  },
  tsBlacklist,
];