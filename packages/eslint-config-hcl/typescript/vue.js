import vueParser from 'vue-eslint-parser';
import vuePlugin from 'eslint-plugin-vue';
import tsParser from '@typescript-eslint/parser';

import tsConfig from './index.js';
import vueRules from '../rules/vue.js';

export default [
  ...tsConfig,
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        project: './tsconfig.json',
        createDefaultProgram: true,
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue: vuePlugin,
    },
  },
  {
    files: ['**/*.vue'],
    ...vueRules,
  },
];