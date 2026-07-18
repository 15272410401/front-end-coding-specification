import path from 'path';
// fast-glob => 文件系统遍历和匹配库
import fastGlob from 'fast-glob';
import stylelint from 'stylelint';
import { PackageJson, ScanOptions } from '../../types';
import { STYLELINT_FILE_EXT, STYLELINT_IGNORE_PATTERN } from '../../utils/constants';
import { formatStylelintResults } from './formatStylelintResults';
import { getStylelintConfig } from './getStylelintConfig';

/**
 * Stylelint 格式化选项，继承自扫描选项，添加 package.json 内容
 */
export interface DoStylelintOptions extends ScanOptions {
    pkgContent: PackageJson;
}

/**
 * 执行 Stylelint 检查
 * 
 * @param options - Stylelint 检查选项，包含工作目录、文件列表、是否修复等
 * @returns Promise<ScanResult[]> - 检查结果数组
 */
export async function doStylelint(options: DoStylelintOptions) {
    // 1. 初始化文件列表
    let files: string[] = [];

    // 2. 如果用户指定了文件列表，过滤出 Stylelint 支持的文件类型
    if (options.files && options.files.length > 0) {
        files = options.files.filter((name) =>
            STYLELINT_FILE_EXT.includes(path.extname(name))
        );
    } else {
        // 3. 如果没有指定文件列表，使用 glob 模式在工作目录中查找文件
        // 3.1 构建 glob 模式：包含所有 Stylelint 支持的文件扩展名
        const fileExtensions = STYLELINT_FILE_EXT.map((ext) => ext.replace(/^\./, '')).join(',');
        const pattern = `**/*.{${fileExtensions}}`;

        // 3.2 使用 fast-glob 查找文件，排除忽略模式中的文件
        files = await fastGlob(pattern, {
            cwd: options.cwd,
            ignore: STYLELINT_IGNORE_PATTERN,
        });
    }

    // 4. 如果没有找到匹配的文件，直接返回空数组
    if (files.length === 0) {
        return [];
    }

    try {
        // 5. 获取 Stylelint 配置
        const stylelintConfig = getStylelintConfig(options, options.pkgContent, options.config || {});

        // 6. 执行 Stylelint 检查
        const data = await stylelint.lint({
            ...stylelintConfig,
            files,
        });

        // 7. 格式化检查结果并返回
        return formatStylelintResults(data.results, options.quiet || false);
    } catch (error) {
        // 8. 错误处理：输出错误信息并返回空数组
        console.error('Stylelint 检查失败');
        console.error(error);
        return [];
    }
}