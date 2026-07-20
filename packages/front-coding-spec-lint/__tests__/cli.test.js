import path from 'path';
// fs-extra => 提供了 fs 模块的额外功能，如读取 JSON 文件等
import fsExtra from 'fs-extra';
// execa => 跨平台命令执行工具
import { execa } from 'execa';
import { fileURLToPath } from 'url';
import { expect } from 'chai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJson = fsExtra.readJsonSync(path.resolve(__dirname, '../package.json'));

const cli = (args, options) => {
  return execa('node', [path.resolve(__dirname, '../lib/cli.js'), ...args], options);
};

it('--version should output right version', async () => {
  const { stdout } = await cli(['--version']);
  expect(stdout).to.equal(packageJson.version);
});

describe(`'fix' command`, () => {
  const dir = path.resolve(__dirname, './fixtures/autofix');
  const outputFilePath = path.resolve(dir, './temp/temp.js');
  const errorFileContent = fsExtra.readFileSync(path.resolve(dir, './semi-error.js'), 'utf8');
  const expectedFileContent = fsExtra.readFileSync(path.resolve(dir, './semi-expected.js'), 'utf8');

  beforeEach(() => {
    fsExtra.outputFileSync(outputFilePath, errorFileContent, 'utf8');
  });

  it('should autofix problematic code', async () => {
    await cli(['fix'], {
      cwd: path.dirname(`${dir}/result`),
    });
    expect(fsExtra.readFileSync(outputFilePath, 'utf8')).to.deep.equal(expectedFileContent);
  });

  afterEach(() => {
    fsExtra.removeSync(`${dir}/temp`);
  });
});

describe(`'exec' command`, () => {
  const semverRegex = /(\d+)\.(\d+)\.(\d+)/;

  it(`'exec eslint' should work as expected`, async () => {
    const { stdout } = await cli(['exec', 'eslint', '--version']);
    expect(stdout).to.match(semverRegex);
  });

  it(`'exec stylelint' should work as expected`, async () => {
    const { stdout } = await cli(['exec', 'stylelint', '--version']);
    expect(stdout).to.match(semverRegex);
  });

  it(`'exec commitlint' should work as expected`, async () => {
    const { stdout } = await cli(['exec', 'commitlint', '--version']);
    expect(stdout).to.match(semverRegex);
  });
});
