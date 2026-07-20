import tsEssentialConfig from './index.js';
import vueRules from '../../rules/vue.js';

import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import vuePlugin from 'eslint-plugin-vue';

export default [
  ...tsEssentialConfig,
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vuePlugin.parser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'vue': vuePlugin,
    },
    // vue 要置于最后，因为里面用了 vue-parser 插件，需要在 ts 规则之后执行
    ...vueRules,
  },
];