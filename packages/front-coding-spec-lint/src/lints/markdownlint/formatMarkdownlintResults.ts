import markdownlint from 'markdownlint';
import type { ScanResult } from '../../types';

/**
 * 格式化 Markdownlint 检查结果
 * 
 * @param results - Markdownlint 原始检查结果对象（key 为文件路径，value 为错误列表）
 * @param quiet - 是否只显示错误（不显示警告），markdownlint 默认只有警告级别
 * @returns ScanResult[] - 格式化后的检查结果数组
 */
export function formatMarkdownlintResults(
  results: markdownlint.LintResults,
  quiet: boolean,
): ScanResult[] {
  // 1. 初始化结果数组
  const parsedResults: ScanResult[] = [];

  // 2. 遍历每个文件的检查结果
  for (const file in results) {
    // 2.1 跳过原型链上的属性
    if (!Object.prototype.hasOwnProperty.call(results, file)) {
      continue;
    }

    // 2.2 如果 quiet 为 true，跳过（markdownlint 默认只有警告，没有错误级别）
    if (quiet) {
      continue;
    }

    // 2.3 初始化警告计数器
    let warningCount = 0;
    let fixableWarningCount = 0;

    // 2.4 格式化每个错误消息
    const messages = results[file].map(
      ({ lineNumber, ruleNames, ruleDescription, ruleInformation, errorRange, fixInfo }) => {
        // 2.5 如果错误有修复信息，增加可修复警告计数
        if (fixInfo) {
          fixableWarningCount++;
        }
        // 2.6 增加警告计数
        warningCount++;

        // 2.7 返回格式化后的消息对象
        return {
          line: lineNumber,
          column: Array.isArray(errorRange) ? errorRange[0] : 1,
          rule: ruleNames[0],
          url: ruleInformation,
          message: ruleDescription,
          errored: false,
        };
      },
    );

    // 2.8 将文件的检查结果添加到结果数组
    parsedResults.push({
      filePath: file,
      messages,
      errorCount: 0,
      warningCount,
      fixableErrorCount: 0,
      fixableWarningCount,
    });
  }

  // 3. 返回格式化后的结果数组
  return parsedResults;
}
