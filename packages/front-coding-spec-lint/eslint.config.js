import hclConfig from 'eslint-config-hcl';
import prettier from 'eslint-config-prettier';

export default [
  ...hclConfig,
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
