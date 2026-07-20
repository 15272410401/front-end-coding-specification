export default {
  // 1. 继承你的共享配置（或基础配置）
  extends: 'stylelint-config-hcl',
  
  // 2. 忽略规则：将原来的 .stylelintignore 内容迁移到这里
  ignoreFiles: [],
  
  // 3. 如果有额外的插件或规则，可以在这里配置
  // plugins: [],
  // rules: {},
};