import baseConfig from '../index.js';
import setStyleToWarn from './rules/set-style-to-warn.js';
import blacklist from './rules/blacklist.js';
import es6Blacklist from './rules/es6-blacklist.js';

export default [
  ...baseConfig,
  setStyleToWarn,
  blacklist,
  es6Blacklist,
];