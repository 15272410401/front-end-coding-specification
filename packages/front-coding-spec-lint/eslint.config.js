import hclConfig from 'eslint-config-hcl';
import prettier from 'eslint-config-prettier';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';


export default [
  ...hclConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
    },
  },
  {
    settings: {
      'import/resolver': {
        node: {},
      },
    },
    rules: {
      'import/no-unresolved': ['error', {
        ignore: ['@typescript-eslint/*'],
      }],
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.git/**',
      '**/*.min.js',
      '**/*.d.ts',
      '**/.eslintcache',
      '**/pnpm-lock.yaml',
      '**/package-lock.json',
      '**/yarn.lock',
    ],
  },
  // 通用规则覆盖
  {
    files: ['**/*.{js,ts,vue}'],
    rules: {
      // 在这里覆盖 hcl 的规则
      // 例如：'no-console': 'warn',
    },
  },
  prettier,
];
