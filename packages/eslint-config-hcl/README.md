# eslint-config-hcl

> 基于 ESLint 9 扁平配置的基础通用 JavaScript、TypeScript、Vue 编码规范

支持配套的 [eslint 可共享配置](https://www.npmjs.com/package/markdownlint#optionsconfig)。

提供了多套配置文件以支持 `JavaScript`、`TypeScript`、`Vue` 等多种项目类型。

## JavaScript 项目 - eslint-config-hcl

针对未使用 `Vue` 的原生 `JavaScript` 项目，使用 `ESLint` 原生规则和 [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import) 规则，使用 [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser) 作为 `parser`，是本包的默认配置。

### 依赖

- [@babel/core](https://www.npmjs.com/package/@babel/core)@^7.24.0
- [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser)@^7.24.5
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)@^2.31.0

### 安装

```bash
npm install @babel/core @babel/eslint-parser eslint-plugin-import --save-dev
```

安装本包：

```bash
npm install eslint-config-hcl --save-dev
```

### 配置

配置文件 `eslint.config.js`，内容如下：

```javascript
// eslint.config.js
import eslintConfigHcl from 'eslint-config-hcl';

export default [
  ...eslintConfigHcl,
  // 你的自定义配置
];
```

## JavaScript + Vue 项目 - eslint-config-hcl/vue

针对 `JS Vue` 的项目，继承了默认配置，并启用了 [eslint-plugin-vue](https://www.npmjs.com/package/eslint-plugin-vue) 插件的规则，使用 [vue-eslint-parser](https://www.npmjs.com/package/vue-eslint-parser) 作为 parser。

### 依赖

- [@babel/core](https://www.npmjs.com/package/@babel/core)@^7.24.0
- [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser)@^7.24.5
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)@^2.31.0
- [vue-eslint-parser](https://www.npmjs.com/package/vue-eslint-parser)@^9.4.3
- [eslint-plugin-vue](https://www.npmjs.com/package/eslint-plugin-vue)@^9.33.0

### 安装

```bash
npm install @babel/core @babel/eslint-parser eslint-plugin-import vue-eslint-parser eslint-plugin-vue --save-dev
```

安装本包：

```bash
npm install eslint-config-hcl --save-dev
```

### 配置

配置文件 `eslint.config.js`，内容如下：

```javascript
// eslint.config.js
import eslintConfigHclVue from 'eslint-config-hcl/vue';

export default [
  ...eslintConfigHclVue,
  // 你的自定义配置
];
```

## TypeScript 项目 - eslint-config-hcl/typescript

针对未使用 `Vue` 的 `TypeScript` 项目，继承了默认配置，并启用了 [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin) 插件的规则，使用 [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser) 作为 parser。

### 依赖

- [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser)@^8.5.0
- [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)@^8.5.0
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)@^2.31.0
- [eslint-import-resolver-typescript](https://www.npmjs.com/package/eslint-import-resolver-typescript)@^4.0.0

### 安装

```bash
npm install @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-import eslint-import-resolver-typescript --save-dev
```

安装本包：

```bash
npm install eslint-config-hcl --save-dev
```

### 配置

配置文件 `eslint.config.js`，内容如下：

```javascript
// eslint.config.js
import eslintConfigHclTS from 'eslint-config-hcl/typescript';

export default [
  ...eslintConfigHclTS,
  // 你的自定义配置
];
```

需保证项目已安装 `typescript` 依赖，另外如果项目的 `TS` 配置文件不是 `./tsconfig.json`，则需要设置 `languageOptions.parserOptions.project` 字段 ，例如：

```javascript
// eslint.config.js
import eslintConfigHclTS from 'eslint-config-hcl/typescript';

export default [
  ...eslintConfigHclTS,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
  },
];
```

## TypeScript + Vue 项目 - eslint-config-hcl/typescript/vue

针对 `TS Vue` 项目，继承了 `JS Vue` 的配置，并启用了 [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin) 插件的规则，使用 [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser) 作为 `parser`。

### 依赖

- [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser)@^8.5.0
- [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)@^8.5.0
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)@^2.31.0
- [eslint-import-resolver-typescript](https://www.npmjs.com/package/eslint-import-resolver-typescript)@^4.0.0
- [vue-eslint-parser](https://www.npmjs.com/package/vue-eslint-parser)@^9.4.3
- [eslint-plugin-vue](https://www.npmjs.com/package/eslint-plugin-vue)@^9.33.0

### 安装

```bash
npm install @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-import eslint-import-resolver-typescript vue-eslint-parser eslint-plugin-vue --save-dev
```

安装本包：

```bash
npm install eslint-config-hcl --save-dev
```

### 配置

配置文件 `eslint.config.js`，内容如下：

```javascript
// eslint.config.js
import eslintConfigHclTSVue from 'eslint-config-hcl/typescript/vue';

export default [
  ...eslintConfigHclTSVue,
  // 你的自定义配置
];
```

## 配合 Prettier 使用

如果你的项目使用 [Prettier](https://prettier.io/) 进行代码格式化，本包的一些规则可能会跟 Prettier 格式化结果有冲突，[例如这条规则](https://github.com/typescript-eslint/typescript-eslint/issues/372)。为了避免冲突，你需要手动安装 [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)：

### 安装

```bash
npm install eslint-config-prettier --save-dev
```

### 配置

并修改 `eslint.config.js`，在配置数组中增加 `prettier` 配置（需放在最后，以覆盖冲突规则）：

```javascript
// eslint.config.js
import eslintConfigHclTSVue from 'eslint-config-hcl/typescript/vue';

export default [
  ...eslintConfigHclTSVue,
  // 放在最后，以覆盖冲突规则
  'prettier',
  // 你的自定义配置
];
```

了解更多请阅读 [Prettier - Integrating with Linters](https://prettier.io/docs/en/integrating-with-linters.html)。

## 将风格问题降级

为了保证一致的编码风格，本包中大量风格相关的规则被设为了 `error` 级别，以引起开发者的足够重视。如果你觉得风格问题不足以是 `error` 级别（有些用户根据 ESLint error 进行流程卡点），本包还提供了一套名为 'essential' 的配置文件，这套配置将所有风格问题降级为 `warn` 级别，仅将必要问题报告为 `error`，引用方式为在相应配置的 `eslint-config` 后面加上 `/essential`，如对 `JS Vue` 项目为 `eslint-config/essential/Vue`、对 `TS Vue` 项目为 `eslint-config/essential/typescript/vue`

## 了解更多

- 如果你对 ESLint 还不熟悉，可以阅读官网的 [Getting Started](https://eslint.org/docs/user-guide/getting-started) 快速入门。
- 了解如何为 IDE 配置 ESLint，可以参考官网的 [Integrations](http://eslint.org/docs/user-guide/integrations)。
- 了解如何在继承本包的基础上对项目 ESLint 进行个性化配置，可参考官网的 [Configuring ESLint](https://eslint.org/docs/user-guide/configuring)。下面简介下 ESLint 配置中的几个常用字段：
  - `extends`: 继承一组规则集。`"extends": "eslint-config",` 表示继承本包定义的规则配置。
  - `rules`: 配置规则，这里定义的规则会覆盖 `extends` 的规则。如果觉得本包开启的某条规则过于严格，你可以暂时在这里将其关闭。
  - `parser`: 设置 ESLint 的解析器。ESLint 使用 Espree 作为默认的解析器，可以通过这个参数指定其他的解析器。比如指定为 [@babel/eslint-parser](https://npmjs.com/package/@babel/eslint-parser)，以解析 Babel 支持但 ESLint 默认解析器不支持的语法（本包不同配置文件使用的解析器可在简介表格中的「依赖 parser」一列查看）。
  - `globals`: 指定代码中可能用到的全局变量，以免全局变量被 [no-undef](http://eslint.org/docs/rules/no-undef) 规则报错。
  - `env`: 指定代码的运行环境，每个环境预定义了一组对应的全局变量，本包已开启的环境有 browser、node、jquery、es6 及几个测试框架的环境。
- 了解常用的 ESLint 命令，如 `--fix`、`--ext`，可参考官网的 [Command Line Interface](http://eslint.org/docs/user-guide/command-line-interface)。