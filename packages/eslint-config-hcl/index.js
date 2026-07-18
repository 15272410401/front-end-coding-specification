import babelParser from '@babel/eslint-parser';
import importPlugin from 'eslint-plugin-import';

import bestPracticesRules from './rules/base/best-practices.js';
import possibleErrorsRules from './rules/base/possible-errors.js';
import styleRules from './rules/base/style.js';
import variablesRules from './rules/base/variables.js';
import es6Rules from './rules/base/es6.js';
import strictRules from './rules/base/strict.js';
import importsRules from './rules/imports.js';

export default [
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          globalReturn: false,
          impliedStrict: true,
        },
      },
    },
    plugins: {
      import: importPlugin,
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...bestPracticesRules,
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...possibleErrorsRules,
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...styleRules,
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...variablesRules,
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...es6Rules,
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...strictRules,
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...importsRules,
  },
];