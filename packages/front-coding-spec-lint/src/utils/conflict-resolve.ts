import path from 'path';
// fs-extra => 提供了 fs 模块的额外功能，如读取 JSON 文件等
import fsExtra from 'fs-extra';
// glob => 用于使用通配符的方式，快速匹配文件路径的模式
import { glob } from 'glob';
// inquirer => 用于创建命令行交互式用户界面
import inquirer from 'inquirer';
import log from './log';
import { PACKAGE_NAME } from './constants';
import type { PackageJson } from '../types';

// 精确移除依赖
const packageNamesToRemove = [
  '@babel/eslint-parser',
  '@commitlint/cli',
  '@iceworks/spec',
  'babel-eslint',
  'eslint',
  'husky',
  'markdownlint',
  'prettier',
  'stylelint',
  'tslint',
];

// 按前缀移除依赖
const packagePrefixesToRemove = [
  '@commitlint/',
  '@typescript-eslint/',
  'eslint-',
  'stylelint-',
  'markdownlint-',
  'commitlint-',
];

/**
 * 待删除的无用配置文件
 * @param cwd
 */
const checkUselessConfig = (cwd: string): string[] => {
  const options = { cwd };
  const result: string[] = [];
  result.push(...(glob.sync('.eslintrc?(.@(yaml|yml|json))', options) || []))
  result.push(...(glob.sync('.stylelintrc?(.@(yaml|yml|json))', options) || []))
  result.push(...(glob.sync('.markdownlint@(rc|.@(yaml|yml|json))', options) || []))
  result.push(...(glob.sync('.prettierrc?(.@(cjs|config.js|config.cjs|yaml|yml|json|json5|toml))', options) || []))
  result.push(...(glob.sync('tslint.@(yaml|yml|json)', options) || []))
  result.push(...(glob.sync('.kylerc?(.@(yaml|yml|json))', options) || []))
  return result;
};

/**
 * 待重写的配置
 * @param cwd
 */
const checkReWriteConfig = (cwd: string) => {
  return glob
    .sync('**/*.ejs', { cwd: path.resolve(__dirname, '../config') })
    .map((name: string) => name.replace(/^_/, '.').replace(/\.ejs$/, ''))
    .filter((filename: string) => fsExtra.existsSync(path.resolve(cwd, filename)));
};

export default async (cwd: string, rewriteConfig?: boolean) => {
  const pkgPath = path.resolve(cwd, 'package.json');
  let pkgContent: PackageJson = await fsExtra.readJsonSync(pkgPath);
  const dependencies: string[] = [
    ...Object.keys(pkgContent.dependencies || {}),
    ...Object.keys(pkgContent.devDependencies || {})
  ];
  // 筛选需要移除的依赖
  const willRemovePackage = dependencies.filter(
    (name) =>
      packageNamesToRemove.includes(name) ||
      packagePrefixesToRemove.some((prefix) => name.startsWith(prefix)),
  );
  // 筛选需要删除的配置文件
  const uselessConfig = checkUselessConfig(cwd);
  // 筛选需要重写的配置文件
  const reWriteConfig = checkReWriteConfig(cwd);
  const willChangeCount = willRemovePackage.length + uselessConfig.length + reWriteConfig.length;

  // 提示是否移除原配置
  if (willChangeCount > 0) {
    log.warn(`检测到项目中存在可能与 ${PACKAGE_NAME} 冲突的依赖和配置，为保证正常运行将`);

    if (willRemovePackage.length > 0) {
      log.warn('删除以下依赖：');
      log.warn(JSON.stringify(willRemovePackage, null, 2));
    }

    if (uselessConfig.length > 0) {
      log.warn('删除以下配置文件：');
      log.warn(JSON.stringify(uselessConfig, null, 2));
    }

    if (reWriteConfig.length > 0) {
      log.warn('覆盖以下配置文件：');
      log.warn(JSON.stringify(reWriteConfig, null, 2));
    }

    if (typeof rewriteConfig === 'undefined') {
      const { isOverWrite } = await inquirer.prompt({
        type: 'confirm',
        name: 'isOverWrite',
        message: '请确认是否继续：',
      });

      if (!isOverWrite) process.exit(0);
    } else if (!reWriteConfig) {
      process.exit(0);
    }
  }

  // 删除配置文件
  for (const name of uselessConfig) {
    fsExtra.removeSync(path.resolve(cwd, name));
  }

  // 修正 package.json
  delete pkgContent.eslintConfig;
  delete pkgContent.eslintIgnore;
  delete pkgContent.stylelint;
  for (const name of willRemovePackage) {
    delete (pkgContent.dependencies || {})[name];
    delete (pkgContent.devDependencies || {})[name];
  }
  fsExtra.writeFileSync(path.resolve(cwd, 'package.json'), JSON.stringify(pkgContent, null, 2), 'utf8');

  return pkgContent;
};
