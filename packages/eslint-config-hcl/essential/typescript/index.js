import essentialConfig from '../index.js';
import tsRules from '../../rules/typescript.js';
import tsBlacklist from '../rules/ts-blacklist.js';

export default [
  ...essentialConfig,
  {
    files: ['**/*.{ts}'],
    ...tsRules,
  },
  tsBlacklist,
];