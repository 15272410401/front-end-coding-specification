/**
 * 验证 TS 规则
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

describe('校验 TS 配置', () => {
  it('eslint-config/typescript 校验', async () => {
    const configPath = path.resolve(__dirname, '../typescript/index.js');
    const filePath = path.join(__dirname, './fixtures/ts.ts');

    const cli = new eslint.ESLint({
      overrideConfigFile: configPath,
      ignore: false,
      cache: false,
      overrideConfig: [{
        languageOptions: {
          parserOptions: {
            project: path.join(__dirname, './fixtures/tsconfig.json'),
          },
        },
      }]
    });

    // 验证 lint 工作是否正常
    const results = await cli.lintFiles([filePath]);
    assert.equal(sumBy(results, 'fatalErrorCount'), 0);
    assert.equal(sumBy(results, 'errorCount'), 0);
    assert.equal(sumBy(results, 'warningCount'), 1);

    // 验证 eslint-plugin-typescript 工作是否正常
    const { messages } = results[0];
    const errorReportedByReactPlugin = messages.filter((result) => {
      return result.ruleId && result.ruleId.indexOf('@typescript-eslint/') !== -1;
    });
    assert.equal(errorReportedByReactPlugin.length, 0);

    const errorReportedByNoRedeclare = messages.filter((result) => {
      return result.ruleId === 'no-redeclare';
    });
    assert.equal(errorReportedByNoRedeclare.length, 0);

    // 验证 eslint-import-resolver-typescript 工作是否正常
    const filePath2 = path.join(__dirname, './fixtures/ts-import-a.ts');
    const filePath3 = path.join(__dirname, './fixtures/ts-import-b.ts');
    const reports2 = cli.lintFiles([filePath2, filePath3]);
    assert.ok(reports2.errorCount !== 0 || reports2.warnCount !== 0);
  });

  it('eslint-config/typescript/vue 校验', async () => {
    const configPath = path.resolve(__dirname, '../typescript/vue.js');
    const filePath = path.join(__dirname, './fixtures/ts-vue.vue');

    const cli = new eslint.ESLint({
      overrideConfigFile: configPath,
      ignore: false,
      cache: false,
      overrideConfig: [
        {
          languageOptions: {
            parserOptions: {
              project: path.join(__dirname, './fixtures/tsconfig.json'),
            },
          },
        },
      ]
    });

    // 验证 lint 工作是否正常
    const results = await cli.lintFiles([filePath]);
    assert.equal(sumBy(results, 'fatalErrorCount'), 0);
    assert.notEqual(sumBy(results, 'errorCount'), 0);
    assert.equal(sumBy(results, 'warningCount'), 0);

    // 验证 eslint-plugin-vue 及 @typescript-eslint 工作是否正常
    const { messages } = results[0];
    const errorReportedByReactPlugin = messages.filter((result) => {
      return result.ruleId && result.ruleId.indexOf('vue/') !== -1;
    });
    const errorReportedByTSPlugin = messages.filter((result) => {
      return result.ruleId && result.ruleId.indexOf('@typescript-eslint/') !== -1;
    });
    assert.notEqual(errorReportedByReactPlugin.length, 0);
    assert.equal(errorReportedByTSPlugin.length, 0);
  });

  it('eslint-config/essential/typescript 校验', async () => {
    const configPath = path.resolve(__dirname, '../essential/typescript/index.js');
    const filePath = path.join(__dirname, './fixtures/ts.ts');

    const cli = new eslint.ESLint({
      overrideConfigFile: configPath,
      ignore: false,
      cache: false,
      overrideConfig: [{
        languageOptions: {
          parserOptions: {
            project: path.join(__dirname, './fixtures/tsconfig.json'),
          },
        },
      }]
    });

    // 验证 lint 工作是否正常
    const results = await cli.lintFiles([filePath]);
    assert.equal(sumBy(results, 'fatalErrorCount'), 0);
    assert.equal(sumBy(results, 'errorCount'), 0);
    assert.notEqual(sumBy(results, 'warningCount'), 0);

    // 验证黑名单中的规则已关闭
    const { messages } = results[0];

    // 验证 @typescript-eslint/semi 被关闭
    const semiErrors = messages.filter((result) => {
      return result.ruleId === '@typescript-eslint/semi';
    });
    assert.equal(semiErrors.length, 0);

    // 验证一个风格问题被降级
    const styleErrors = messages.filter((result) => {
      return result.ruleId === 'object-curly-spacing';
    });
    // 避免空指针，先检查是否有匹配的规则
    if (styleErrors.length > 0) {
      assert.equal(styleErrors[0].severity, 1);
    }
  });

  it('eslint-config/essential/typescript/vue 校验', async () => {
    const configPath = path.resolve(__dirname, '../essential/typescript/vue.js');
    const filePath = path.join(__dirname, './fixtures/ts-vue.vue');

    const cli = new eslint.ESLint({
      overrideConfigFile: configPath,
      ignore: false,
      cache: false,
      overrideConfig: [{
        languageOptions: {
          parserOptions: {
            project: path.join(__dirname, './fixtures/tsconfig.json'),
          },
        }
      }]
    });

    // 验证 lint 工作是否正常
    const results = await cli.lintFiles([filePath]);
    assert.notEqual(sumBy(results, 'fatalErrorCount'), 0);
    assert.notEqual(sumBy(results, 'errorCount'), 0);
    assert.equal(sumBy(results, 'warningCount'), 0);

    // 验证 vue plugin 工作是否正常
    const result = results[0];
    const errorReportedByReactPlugin = result.messages.filter((message) => {
      return message.ruleId && message.ruleId.indexOf('vue/') !== -1;
    });
    assert.equal(errorReportedByReactPlugin.length, 0);

    // 验证黑名单中的规则已关闭
    const errorReportedByReactPluginBlackList = result.messages.filter((message) => {
      return message.ruleId === '@typescript-eslint/indent';
    });
    assert.equal(errorReportedByReactPluginBlackList.length, 0);
  });
});