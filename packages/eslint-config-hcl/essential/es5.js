import es5Config from '../es5.js';
import setStyleToWarn from './rules/set-style-to-warn.js';
import blacklist from './rules/blacklist.js';

export default [
  ...es5Config,
  setStyleToWarn,
  blacklist,
  {
    files: ['**/*.js'],
    rules: {
      'comma-dangle': ['warn', 'never'],
    },
  },
];