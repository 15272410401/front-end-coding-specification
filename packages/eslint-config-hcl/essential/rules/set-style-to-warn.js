/**
 * 将 error 级别的 style 规则降级为 warn
 */
import styleRules from '../../rules/base/style.js';

// 将传入 config 中 error 级别规则都改为 warn 级别
function setErrorRulesToWarn(config) {
  const rules = { ...config.rules };

  for (const ruleName in rules) {
    if (Object.prototype.hasOwnProperty.call(rules, ruleName)) {
      const ruleValue = rules[ruleName];
      if (Array.isArray(ruleValue)) {
        if (ruleValue[0] === 'error') {
          rules[ruleName] = ['warn', ...ruleValue.slice(1)];
        }
      } else if (ruleValue === 'error') {
        rules[ruleName] = 'warn';
      }
    }
  }

  return { rules };
}

export default setErrorRulesToWarn(styleRules);