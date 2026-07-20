import { fileURLToPath } from 'url';
import assert from 'assert'
import eslint from 'eslint'
import path from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('test/use-babel-eslint.test.js', () => {
  it('@babel/eslint-parser 在 Vue 项目中能正常运行', async () => {
    const configPath = path.resolve(__dirname, '../vue.js');
    const filePath = path.join(__dirname, './fixtures/vue.vue');

    const cli = new eslint.ESLint({
      overrideConfigFile: configPath,
      ignore: false,
      cache: false,
    });

    const results = await cli.lintFiles([filePath]);
    const { errorCount, fatalErrorCount, warningCount } = results[0];

    assert.equal(fatalErrorCount, 0);
    assert.equal(errorCount, 4);
    assert.equal(warningCount, 0);
  });
});