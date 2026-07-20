import path from 'path';
// fs-extra => 提供了 fs 模块的额外功能，如读取 JSON 文件等
import fsExtra from 'fs-extra';
import encodeFeLint from '../lib/index.js';
import { fileURLToPath } from 'url';
import { expect } from 'chai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { init } = encodeFeLint;

describe('init', () => {
  const templatePath = path.resolve(__dirname, './fixtures/template/init');
  const outputPath = path.resolve(__dirname, './fixtures/template/temp');

  beforeEach(() => {
    fsExtra.removeSync(outputPath);
    fsExtra.copySync(templatePath, outputPath);
    const vscodeSrc = `${outputPath}/_vscode`;
    const vscodeDest = `${outputPath}/.vscode`;
    if (fsExtra.existsSync(vscodeDest)) {
      fsExtra.removeSync(vscodeDest);
    }
    if (fsExtra.existsSync(vscodeSrc)) {
      fsExtra.copySync(vscodeSrc, vscodeDest);
      fsExtra.removeSync(vscodeSrc);
    }
  });

  it('node api init should work as expected', async () => {
    await init({
      cwd: outputPath,
      checkVersionUpdate: false,
      eslintType: 'index',
      enableStylelint: true,
      enableMarkdownlint: true,
      enablePrettier: true,
      rewriteConfig: true,
      disableNpmInstall: true,
    });

    // const packageJson = fsExtra.readJsonSync(`${outputPath}/package.json`);
    const settings = fsExtra.readJsonSync(`${outputPath}/.vscode/settings.json`);

    expect(settings['editor.defaultFormatter']).to.equal('esbenp.prettier-vscode');
    expect(settings['eslint.validate']).to.include('233');
    expect(settings.test).to.be.ok;
  });

  afterEach(() => {
    fsExtra.removeSync(outputPath);
  });
});
