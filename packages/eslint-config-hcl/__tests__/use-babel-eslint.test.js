const assert = require('assert');
const eslint = require('eslint');
const path = require('path');

describe('test/use-babel-eslint.test.js', () => {
  it('@babel/eslint-parser 在 Vue 项目中能正常运行', async () => {
    const configPath = './vue.js';
    const filePath = path.join(__dirname, './fixtures/vue.vue');

    const cli = new eslint.ESLint({
      overrideConfigFile: configPath,
      useEslintrc: false,
      ignore: false,
    });

    const results = await cli.lintFiles([filePath]);
    const { errorCount, fatalErrorCount, warningCount } = results[0];

    assert.equal(fatalErrorCount, 0);
    assert.equal(errorCount, 4);
    assert.equal(warningCount, 0);
  });
});