import path from 'path';
// fs-extra => 提供了 fs 模块的额外功能，如读取 JSON 文件等
import fsExtra from 'fs-extra';
// glob => 用于使用通配符的方式，快速匹配文件路径的模式
import { glob } from 'glob';
import { LinterOptions } from 'stylelint';
import type { Config, PackageJson, ScanOptions } from '../../types';
import { STYLELINT_IGNORE_PATTERN } from '../../utils/constants';

/**
 * 获取 Stylelint 配置
 * 
 * @param opts - 扫描选项，包含工作目录、是否自动修复等
 * @param pkgContent - 项目 package.json 内容
 * @param config - 项目配置，包含是否启用 Stylelint、自定义选项等
 * @returns LinterOptions - Stylelint 配置选项
 */
export function getStylelintConfig(opts: ScanOptions, pkgContent: PackageJson, config: Config): LinterOptions {
    // 1. 从扫描选项中解构参数
    const { cwd, fix } = opts;

    // 2. 如果配置中明确禁用了 Stylelint，返回空对象
    if (config.enableStylelint === false) {
        return {} as LinterOptions;
    }

    // 3. 初始化基础配置
    const lintConfig: LinterOptions = {
        fix: Boolean(fix),
        allowEmptyInput: true,
    };

    // 4. 如果用户传入了自定义的 stylelintOptions，直接使用用户配置
    if (config.stylelintOptions) {
        Object.assign(lintConfig, config.stylelintOptions);
    } else {
        // 5. 如果没有自定义配置，使用默认配置
        // 5.1 检查项目中是否存在 .stylelintrc 配置文件或 package.json 中的 stylelint 配置
        const lintConfigFiles = glob.sync('.stylelintrc?(.@(js|yaml|yml|json))', { cwd });

        // 5.2 如果没有配置文件，使用默认的 stylelint-config-hcl 配置
        if (lintConfigFiles.length === 0 && !pkgContent.stylelint) {
            lintConfig.config = {
                extends: 'stylelint-config-hcl',
            };
        }

        // 5.3 检查项目中是否存在 .stylelintignore 文件
        const ignoreFilePath = path.resolve(cwd, '.stylelintignore');

        // 5.4 如果没有忽略文件，使用默认的忽略模式
        if (!fsExtra.existsSync(ignoreFilePath)) {
            lintConfig.ignorePattern = STYLELINT_IGNORE_PATTERN;
        }
    }

    // 6. 返回完整的配置
    return lintConfig;
}
