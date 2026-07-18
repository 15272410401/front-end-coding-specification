# eslint-plugin-hcl

> 自定义 ESLint 规则插件，提供编码规范相关规则

## 安装

需要先行安装 [ESlint](https://eslint.org/)：

```bash
npm install eslint --save-dev
```

安装本包：

```bash
npm install eslint-plugin-hcl --save-dev
```

## 使用

### 引入插件

```javascript
// eslint.config.js
import eslintPluginHcl from 'eslint-plugin-hcl';

export default [
  {
    plugins: {
      hcl: eslintPluginHcl,
    },
    rules: {
      'hcl/no-secret-info': 'error',
    },
  },
];
```

### 使用预设配置

```javascript
// eslint.config.js
import eslintPluginHcl from 'eslint-plugin-hcl';

export default [
  eslintPluginHcl.configs.recommended,
];
```

### 自定义配置

```javascript
// eslint.config.js
import eslintPluginHcl from 'eslint-plugin-hcl';

export default [
  {
    plugins: {
      hcl: eslintPluginHcl,
    },
    rules: {
      'hcl/no-secret-info': ['error', {
        allowedKeys: ['PUBLIC_KEY'],
      }],
      'hcl/no-http-url': 'warn',
      'hcl/no-broad-semantic-versioning': 'error',
      'hcl/no-js-in-ts-project': 'error',
    },
  },
];
```

## 支持的规则

- [`no-broad-semantic-versioning`](https://15272410401.github.io/front-end-coding-specification/npm/eslint-plugin-hcl.html) 不要指定宽泛的版本范围
- [`no-http-url`](https://15272410401.github.io/front-end-coding-specification/npm/eslint-plugin-hcl.html) 使用 HTTPS 协议头的 URL，而不是 HTTP
- [`no-js-in-ts-project`](https://15272410401.github.io/front-end-coding-specification/npm/eslint-plugin-hcl.html) 不要在 TS 项目中使用 JS
- [`no-secret-info`](https://15272410401.github.io/front-end-coding-specification/npm/eslint-plugin-hcl.html) 不要在代码中直接设置 `password` `token` and `secret` 信息
