import tsEssentialConfig from './index.js';
import vueRules from '../../rules/vue.js';

export default [
  ...tsEssentialConfig,
  {
    files: ['**/*.vue'],
    // vue 要置于最后，因为里面用了 vue-parser 插件，需要在 ts 规则之后执行
    ...vueRules,
  },
];