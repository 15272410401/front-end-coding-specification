import vueParser from 'vue-eslint-parser';
import vuePlugin from 'eslint-plugin-vue';

import baseConfig from './index.js';
import vueRules from './rules/vue.js';

export default [
  ...baseConfig,
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
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