# markdownlint-config-hcl

> 基于 markdownlint 配置的基础通用的 Markdown 规范

支持配套的 [markdownlint 可共享配置](https://www.npmjs.com/package/markdownlint#optionsconfig)。

## 安装

需要先行安装 [markdownlint](https://www.npmjs.com/package/markdownlint)：

```bash
npm install markdownlint --save-dev
```

安装本包：

```bash
npm install markdownlint-config-hcl --save-dev
```

## 使用

在 `.markdownlint.json` 中继承本包:

```json
{
  "extends": "markdownlint-config-hcl"
}
```