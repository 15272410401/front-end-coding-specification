import path from 'path';
// fast-glob => 文件系统遍历和匹配库
import fastGlob from 'fast-glob';
// fs-extra => 提供了 fs 模块的额外功能，如读取 JSON 文件等
import fsExtra from 'fs-extra';
import { LintError } from 'markdownlint';
import { lint } from 'markdownlint/promise';
import markdownlintRuleHelpers from 'markdownlint-rule-helpers';
import { Config, PackageJson, ScanOptions } from '../../types';

import { MARKDOWN_LINT_FILE_EXT, MARKDOWN_LINT_IGNORE_PATTERN } from '../../utils/constants';
import { formatMarkdownlintResults } from './formatMarkdownlintResults';
import { getMarkdownlintConfig } from './getMarkdownlintConfig';

/**
 * Markdownlint 检查选项，继承自扫描选项，添加 package.json 内容和配置
 */
export interface DoMarkdownlintOptions extends ScanOptions {
  pkgContent: PackageJson;
  config?: Config;
}

/**
 * 执行 Markdownlint 检查
 * 
 * @param options - Markdownlint 检查选项，包含工作目录、文件列表、是否修复等
 * @returns Promise<ScanResult[]> - 检查结果数组
 */
export async function doMarkdownlint(options: DoMarkdownlintOptions) {
  // 1. 初始化文件列表
  let files: string[] = [];

  // 2. 如果用户指定了文件列表，过滤出 Markdownlint 支持的文件类型
  if (options.files && options.files.length > 0) {
    files = options.files.filter((name) =>
      MARKDOWN_LINT_FILE_EXT.includes(path.extname(name))
    );
  } else {
    // 3. 如果没有指定文件列表，使用 glob 模式在工作目录中查找文件
    // 3.1 构建 glob 模式：包含所有 Markdownlint 支持的文件扩展名
    const fileExtensions = MARKDOWN_LINT_FILE_EXT.map((ext) => ext.replace(/^\./, '')).join(',');
    const pattern = `**/*.{${fileExtensions}}`;

    // 3.2 使用 fast-glob 查找文件，排除忽略模式中的文件
    files = await fastGlob(pattern, {
      cwd: options.cwd,
      ignore: MARKDOWN_LINT_IGNORE_PATTERN,
    });
  }

  // 4. 如果没有找到匹配的文件，直接返回空数组
  if (files.length === 0) {
    return [];
  }

  try {
    // 5. 获取 Markdownlint 配置
    const markdownlintConfig = getMarkdownlintConfig(options, options.pkgContent, options.config || {});

    // 6. 执行 Markdownlint 检查
    // 使用 Promise API，从 markdownlint/promise 子路径导入
    const results = await lint({
      ...markdownlintConfig,
      files,
    });

    // 7. 如果启用了自动修复，对可修复的文件进行修复
    if (options.fix) {
      await Promise.all(
        Object.keys(results).map((filename) => formatMarkdownFile(filename, results[filename], options.cwd)),
      );
    }

    // 8. 格式化检查结果并返回
    return formatMarkdownlintResults(results, options.quiet || false);
  } catch (error) {
    // 9. 错误处理：输出错误信息并返回空数组
    console.error('Markdownlint 检查失败');
    console.error(error);
    return [];
  }
}

/**
 * 修复单个 Markdown 文件
 * 
 * @param filename - 文件相对路径
 * @param errors - 该文件的错误列表
 * @param cwd - 工作目录绝对路径
 * @returns Promise<LintError[]> - 未修复的错误列表
 */
async function formatMarkdownFile(filename: string, errors: LintError[], cwd: string) {
  // 1. 过滤出可修复的错误
  const fixes = errors?.filter((error) => error.fixInfo);

  // 2. 如果没有可修复的错误，直接返回
  if (!fixes || fixes.length === 0) {
    return errors;
  }

  try {
    // 3. 获取文件的绝对路径
    const absolutePath = path.resolve(cwd, filename);

    // 4. 读取原始文件内容
    const originalText = await fsExtra.readFile(absolutePath, 'utf8');

    // 5. 应用修复
    const fixedText = markdownlintRuleHelpers.applyFixes(originalText, fixes as any);

    // 6. 如果内容有变化，写回文件
    if (originalText !== fixedText) {
      await fsExtra.writeFile(absolutePath, fixedText, 'utf8');
    }

    // 7. 返回未修复的错误（没有 fixInfo 的错误）
    return errors.filter((error) => !error.fixInfo);
  } catch (error) {
    // 8. 错误处理：输出错误信息并返回原始错误列表
    console.error(`Markdownlint 修复文件失败: ${filename}`);
    console.error(error);
    return errors;
  }
}