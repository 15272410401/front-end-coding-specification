import babelParser from '@babel/eslint-parser';
import importPlugin from 'eslint-plugin-import';

import bestPracticesRules from './rules/base/best-practices.js';
import possibleErrorsRules from './rules/base/possible-errors.js';
import styleRules from './rules/base/style.js';
import variablesRules from './rules/base/variables.js';
import es6Rules from './rules/base/es6.js';
import strictRules from './rules/base/strict.js';
import importsRules from './rules/imports.js';
import es5Rules from './rules/es5.js';

export default [
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 5,
        sourceType: 'script',
      },
    },
    plugins: {
      import: importPlugin,
    },
  },
  {
    files: ['**/*.js'],
    ...bestPracticesRules,
  },
  {
    files: ['**/*.js'],
    ...possibleErrorsRules,
  },
  {
    files: ['**/*.js'],
    ...styleRules,
  },
  {
    files: ['**/*.js'],
    ...variablesRules,
  },
  {
    files: ['**/*.js'],
    ...es6Rules,
  },
  {
    files: ['**/*.js'],
    ...strictRules,
  },
  {
    files: ['**/*.js'],
    ...importsRules,
  },
  {
    files: ['**/*.js'],
    ...es5Rules,
  },
];