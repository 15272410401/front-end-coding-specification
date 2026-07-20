/**
 * 验证 JS
 */

import { fileURLToPath } from 'url';
import assert from 'assert'
import eslint from 'eslint'
import path from 'path'

function sumBy(arr, key) {
  return arr.reduce((sum, item) => sum + (item[key] || 0), 0);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

describe('校验 JS 配置', () => {
  it('eslint-config 校验', async () => {
    const configPath = path.resolve(__dirname, '../index.js');
    const filePath = path.join(__dirname, './fixtures/index.js');

    const cli = new eslint.ESLint({
      overrideConfigFile: configPath,
      ignore: false,
      cache: false,
    });

    // 验证导出的 config 是否正常
    const config = await cli.calculateConfigForFile(filePath);
    assert.ok(isObject(config));

    // 验证 lint 工作是否正常
    const results = await cli.lintFiles([filePath]);
    assert.equal(sumBy(results, 'fatalErrorCount'), 0);
    assert.notEqual(sumBy(results, 'errorCount'), 0);
    assert.notEqual(sumBy(results, 'warningCount'), 0);
  });

  it('eslint-config/es5 校验', async () => {
    const configPath = path.resolve(__dirname, '../es5.js');
    const filePath = path.join(__dirname, './fixtures/es5.js');

    const cli = new eslint.ESLint({
      overrideConfigFile: configPath,
      ignore: false,
      cache: false,
    });

    // 验证导出的 config 是否正常
    const config = await cli.calculateConfigForFile(filePath);
    assert.ok(isObject(config));

    // 验证 lint 工作是否正常
    const results = await cli.lintFiles([filePath]);
    assert.equal(sumBy(results, 'fatalErrorCount'), 0);
    assert.notEqual(sumBy(results, 'errorCount'), 0);
    assert.equal(sumBy(results, 'warningCount'), 1);

    // 验证 es5 覆盖的规则是否正常，取 comma-dangle 进行测试
    const { messages } = results[0];
    const errorReportedByReactPlugin = messages.filter((result) => {
      return result.ruleId === 'comma-dangle';
    });
    assert.notEqual(errorReportedByReactPlugin.length, 0);
  });

  it('eslint-config/vue 校验', async () => {
    const configPath = path.resolve(__dirname, '../vue.js');
    const filePath = path.join(__dirname, './fixtures/vue.vue');

    const cli = new eslint.ESLint({
      overrideConfigFile: configPath,
      ignore: false,
      cache: false,
    });

    // 验证导出的 config 是否正常
    const config = await cli.calculateConfigForFile(filePath);
    assert.ok(isObject(config));

    // 验证 lint 工作是否正常
    const results = await cli.lintFiles([filePath]);
    assert.equal(sumBy(results, 'fatalErrorCount'), 0);
    assert.notEqual(sumBy(results, 'errorCount'), 0);
    assert.equal(sumBy(results, 'warningCount'), 0);

    // 验证 eslint-plugin-vue 工作是否正常
    const { messages } = results[0];
    const errorReportedByReactPlugin = messages.filter((result) => {
      return result.ruleId && result.ruleId.indexOf('vue/') !== -1;
    });
    assert.notEqual(errorReportedByReactPlugin.length, 0);
  });

  it('eslint-config/essential 校验', async () => {
    const configPath = path.resolve(__dirname, '../essential/index.js');
    const filePath = path.join(__dirname, './fixtures/index.js');

    const cli = new eslint.ESLint({
      overrideConfigFile: configPath,
      ignore: false,
      cache: false,
    });

    // 验证导出的 config 是否正常
    const config = await cli.calculateConfigForFile(filePath);
    assert.ok(isObject(config));

    // 验证 lint 工作是否正常
    const results = await cli.lintFiles([filePath]);
    assert.equal(sumBy(results, 'fatalErrorCount'), 0);
    assert.equal(sumBy(results, 'errorCount'), 1);
    assert.notEqual(sumBy(results, 'warningCount'), 0);

    // 验证黑名单中的规则已关闭
    const { messages } = results[0];

    // 验证 semi 被关闭
    const semiErrors = messages.filter((result) => {
      return result.ruleId === 'semi';
    });
    assert.equal(semiErrors.length, 0);

    // 验证 comma-spacing 被降级
    const commaSpacingErrors = messages.filter((result) => {
      return result.ruleId === 'comma-spacing';
    });
    assert.equal(commaSpacingErrors[0].severity, 1);
  });

  it('eslint-config/essential/es5 校验', async () => {
    const configPath = path.resolve(__dirname, '../essential/es5.js');
    const filePath = path.join(__dirname, './fixtures/es5.js');

    const cli = new eslint.ESLint({
      overrideConfigFile: configPath,
      ignore: false,
      cache: false,
    });

    // 验证导出的 config 是否正常
    const config = await cli.calculateConfigForFile(filePath);
    assert.ok(isObject(config));

    // 验证 lint 工作是否正常
    const results = await cli.lintFiles([filePath]);
    assert.equal(sumBy(results, 'fatalErrorCount'), 0);
    assert.notEqual(sumBy(results, 'errorCount'), 0);
    assert.notEqual(sumBy(results, 'warningCount'), 0);
    // 验证 es5 覆盖的规则是否正常，取 comma-dangle 进行测试
    const { messages } = results[0];
    const errorReportedByReactPlugin = messages.filter((result) => {
      return result.ruleId === 'comma-dangle';
    });
    assert.notEqual(errorReportedByReactPlugin.length, 0);

    // 验证黑名单中的规则已关闭，取 semi 进行测试
    const errorReportedByReactPluginBlackList = messages.filter((result) => {
      return result.ruleId === 'semi';
    });
    assert.equal(errorReportedByReactPluginBlackList.length, 0);
  });

  it('eslint-config/essential/vue 校验', async () => {
    const configPath = path.resolve(__dirname, '../essential/vue.js');
    const filePath = path.join(__dirname, './fixtures/vue.vue');

    const cli = new eslint.ESLint({
      overrideConfigFile: configPath,
      ignore: false,
      cache: false,
    });

    // 验证导出的 config 是否正常
    const config = await cli.calculateConfigForFile(filePath);
    assert.ok(isObject(config));

    // 验证 lint 工作是否正常
    const results = await cli.lintFiles([filePath]);
    assert.equal(sumBy(results, 'fatalErrorCount'), 0);
    assert.notEqual(sumBy(results, 'errorCount'), 0);
    assert.equal(sumBy(results, 'warningCount'), 1);

    // 验证 vue plugin 工作是否正常
    const { messages } = results[0];
    const errorReportedByReactPlugin = messages.filter((result) => {
      return result.ruleId && result.ruleId.indexOf('vue/') !== -1;
    });
    assert.notEqual(errorReportedByReactPlugin.length, 0);

    // 验证黑名单中的规则已关闭
    const errorReportedByReactPluginBlackList = messages.filter((result) => {
      return result.ruleId === 'indent';
    });
    assert.equal(errorReportedByReactPluginBlackList.length, 0);
  });
});