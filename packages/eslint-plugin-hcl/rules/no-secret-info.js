// 规则名称
const RULE_NAME = 'no-secret-info';

// 默认危险关键词
const DEFAULT_DANGEROUS_KEYS = ['secret', 'token', 'password'];

module.exports = {
  meta: {
    type: 'problem',
    fixable: null,
    messages: {
      noSecretInfo: '检测 "{{secret}}" 可能是一个密钥，请检查！',
    },
  },

  create(context) {
    const ruleOptions = context.options[0] || {};
    let { dangerousKeys = [], autoMerge = true } = ruleOptions;
    if (dangerousKeys.length === 0) {
      dangerousKeys = DEFAULT_DANGEROUS_KEYS;
    } else if (autoMerge) {
      dangerousKeys = [...new Set(...DEFAULT_DANGEROUS_KEYS, ...dangerousKeys)];
    }
    const reg = new RegExp(dangerousKeys.join('|'));

    return {
      Literal: function handleRequires(node) {
        if (
          node.value &&
          node.parent &&
          ((node.parent.type === 'VariableDeclarator' &&
            node.parent.id &&
            node.parent.id.name &&
            reg.test(node.parent.id.name.toLocaleLowerCase())) ||
            (node.parent.type === 'Property' &&
              node.parent.key &&
              node.parent.key.name &&
              reg.test(node.parent.key.name.toLocaleLowerCase())))
        ) {
          context.report({
            node,
            messageId: 'noSecretInfo',
            data: {
              secret: node.value,
            },
          });
        }
      },
    };
  },
};
