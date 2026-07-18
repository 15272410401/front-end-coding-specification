const path = require('path');
const fs = require('fs-extra');

/**
 * 批量加载目录下所有 .js 文件
 * @param {string} dir - 目录路径
 * @returns {Object} 以文件名为 key，导出内容为 value 的对象
 */
function requireAll(dir) {
  const result = {};
  
  // 确保目录存在，不存在则返回空对象
  if (!fs.existsSync(dir)) {
    return result;
  }
  
  // 读取目录下所有文件
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    // 只处理 .js 文件（排除 index.js 自身，避免无限循环）
    if (file.endsWith('.js') && file !== 'index.js') {
      const name = path.basename(file, '.js');
      // 使用 require 加载模块
      result[name] = require(path.join(dir, file));
    }
  }
  
  return result;
}

// 导出规则
exports.rules = requireAll(path.resolve(__dirname, 'rules'));
// 导出预设配置
exports.configs = requireAll(path.resolve(__dirname, 'configs'));
// 导出处理器（处理 JSON 文件）
exports.processors = {
  '.json': {
    preprocess(text) {
      // 转换为 js 文件
      return [`module.exports = ${text}`];
    },
  },
};