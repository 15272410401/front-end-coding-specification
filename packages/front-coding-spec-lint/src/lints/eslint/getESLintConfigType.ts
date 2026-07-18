// glob => 用于使用通配符的方式，快速匹配文件路径的模式
import { glob } from 'glob';
import type { PackageJson } from '../../types';

/**
 * 获取 当前项目的 ESLint 配置类型
 * @param cwd 当前项目的根目录
 * @param pkgContent 当前项目的 package.json 内容
 * @returns eslint-config-hcl/index
 * @returns eslint-config-hcl/typescript/index
 */
export function getESLintConfigType(cwd: string, pkgContent: PackageJson): string {
  const options = { cwd };
  const tsFiles = glob.sync('./!(node_modules)/**/*.@(ts|tsx)', options);
  const vueFiles = glob.sync('./!(node_modules)/**/*.vue', options);
  const dependencies = Object.keys(pkgContent.dependencies || {});
  const language = tsFiles.length > 0 ? 'typescript' : '';
  let dsl = '';

  if (vueFiles.length > 0 || dependencies.some((name) => /^vue(-|$)/.test(name))) {
    dsl = 'vue';
  }

  let configPath = 'eslint-config-hcl';
  
  if (language && dsl) {
    configPath += `/${language}/${dsl}`;
  } else if (language) {
    configPath += `/${language}`;
  } else if (dsl) {
    configPath += `/${dsl}`;
  }

  return configPath;
}