import path from 'path';
// glob => 用于使用通配符的方式，快速匹配文件路径的模式
import { glob } from 'glob';
import { readConfig } from 'markdownlint/sync';
// 导出 markdownlint 配置项类型
import { Options as markdownlintOptions } from 'markdownlint';
import markdownLintConfig from 'markdownlint-config-hcl';
import type { ScanOptions, PackageJson, Config } from '../../types';

/**
 * Markdownlint 配置选项类型，扩展自 markdownlint.Options，添加 fix 属性
 */
type LintOptions = markdownlintOptions & { fix?: boolean };

/**
 * 获取 Markdownlint 配置
 * 
 * @param opts - 扫描选项，包含工作目录、是否自动修复等
 * @param pkgContent - 项目 package.json 内容（当前未使用，预留）
 * @param config - 项目配置，包含是否启用 markdownlint、自定义选项等
 * @returns LintOptions - Markdownlint 配置选项
 */
export function getMarkdownlintConfig(opts: ScanOptions, pkgContent: PackageJson, config: Config): LintOptions {
  // 1. 从扫描选项中解构参数
  const { cwd } = opts;

  // 2. 初始化基础配置
  // fix: 是否自动修复可修复的错误
  const lintConfig: LintOptions = {
    fix: Boolean(opts.fix),
  };

  // 3. 如果用户传入了自定义的 markdownlintOptions，直接使用用户配置
  if (config.markdownlintOptions) {
    Object.assign(lintConfig, config.markdownlintOptions);
  } else {
    // 4. 如果没有自定义配置，使用默认配置或项目中的配置文件
    // 4.1 查找项目中是否存在 .markdownlint 配置文件
    const lintConfigFiles = glob.sync('.markdownlint(.@(yaml|yml|json))', { cwd });

    if (lintConfigFiles.length === 0) {
      // 4.2 如果没有配置文件，使用默认的 markdownlint-config-hcl 配置
      lintConfig.config = markdownLintConfig as any;
    } else {
      // 4.3 如果有配置文件，读取并使用
      lintConfig.config = readConfig(path.resolve(cwd, lintConfigFiles[0]));
    }
  }

  // 5. 返回完整的配置
  return lintConfig;
}
