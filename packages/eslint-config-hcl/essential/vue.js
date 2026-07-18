import vueConfig from '../vue.js';
import setStyleToWarn from './rules/set-style-to-warn.js';
import blacklist from './rules/blacklist.js';
import es6Blacklist from './rules/es6-blacklist.js';

export default [
  ...vueConfig,
  setStyleToWarn,
  blacklist,
  es6Blacklist,
];