import { LintResult } from 'stylelint';
import type { ScanResult } from '../../types';
import { getStylelintRuleDocUrl } from './getStylelintDocUrl';

/**
 * 格式化 Stylelint 检查结果
 * 
 * @param results - Stylelint 原始检查结果数组
 * @param quiet - 是否只显示错误（不显示警告）
 * @returns ScanResult[] - 格式化后的检查结果数组
 */
export function formatStylelintResults(results: LintResult[], quiet: boolean): ScanResult[] {
    // 1. 遍历每个文件的检查结果
    return results.map(({ source, warnings }) => {
        // 2. 初始化错误和警告计数器
        let errorCount = 0;
        let warningCount = 0;

        // 3. 过滤和格式化警告信息
        // 3.1 如果 quiet 为 true，只保留错误级别的警告
        // 3.2 转换为统一的消息格式
        const messages = warnings.filter((item) => !quiet || item.severity === 'error').map((item) => {
            const { line = 0, column = 0, rule, severity, text } = item;

            // 3.3 更新错误和警告计数
            if (severity === 'error') {
                errorCount++;
            } else {
                warningCount++;
            }

            // 3.4 返回格式化后的消息对象
            return {
                line,
                column,
                rule,
                url: getStylelintRuleDocUrl(rule),
                // 3.5 清理错误消息中的规则名称后缀
                message: text.replace(/([^ ])\.$/u, '$1').replace(new RegExp(`\\(${rule}\\)`), ''),
                errored: severity === 'error',
            };
        });

        // 4. 返回单个文件的检查结果
        return {
            filePath: source,
            messages,
            errorCount,
            warningCount,
            fixableErrorCount: 0,
            fixableWarningCount: 0,
        };
    });
}
