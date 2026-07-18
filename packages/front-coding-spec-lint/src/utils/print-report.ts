// chalk => 终端颜色输出工具
import chalk from 'chalk';
import { ChalkInstance } from 'chalk';
// text-table => 终端表格输出工具
import table from 'text-table';
// terminal-link => 终端链接输出工具
import terminalLink from 'terminal-link';
// is-docker => 检查是否在docker环境中运行
import isDocker from 'is-docker';
// strip-ansi => 移除字符串中的ansi转义序列
import stripAnsi from 'strip-ansi';
import { PACKAGE_NAME, UNICODE } from './constants';
import type { ScanResult } from '../types';

/**
 * 在控制台打印扫描报告
 * @param results 所有扫描结果
 * @param fix 是否自动修复
 */
export default (results: ScanResult[], fix: boolean): void => {
    let output = '\n';
    let errorCount = 0;
    let warningCount = 0;
    let fixableErrorCount = 0;
    let fixableWarningCount = 0;
    let summaryColor: keyof ChalkInstance = 'yellow';

    const transformMessage = ({ line, column, rule, url, message, errored }: ScanResult['messages'][0]) => {
        if (errored) summaryColor = 'red';
        let text = '';
        if (rule && url) {
            text = terminalLink(chalk.blue(rule), chalk.dim(` ${url} `), { fallback: !isDocker() });
        } else if (rule) {
            text = chalk.blue(rule);
        }

        return [
            '',
            chalk.dim(`${line}:${column}`),
            errored ? chalk.red('error') : chalk.yellow('warning'),
            message,
            text,
        ];
    };

    for (const result of results) {
        if (result.messages.length === 0) continue;
        const { messages } = result;

        errorCount += result.errorCount;
        warningCount += result.warningCount;
        fixableErrorCount += result.fixableErrorCount;
        fixableWarningCount += result.fixableWarningCount;

        output += `${chalk.underline(result.filePath)}\n`;
        output += `${table(messages.map(transformMessage), {
            align: ['.', 'r', 'l'],
            stringLength: (str: string) => stripAnsi(str).length,
        })}\n\n`;
    }

    const total = errorCount + warningCount;
    const pluralize = (word: string, count: number) => (count === 1 ? word : `${word}s`);

    // 修复日志
    if (fix) output += chalk.green('代码规范问题自动修复完成，请通过 git diff 确认修复效果 :D\n');
    if (fix && total > 0) {
        output += chalk.green('ps: 以上显示的是无法被自动修复的问题，需要手动进行修复\n');
    }

    // 扫描日志，预期:
    // ✖ x 个问题 (y 个错误, z 个警告)
    // y 个错误和z 个警告可以通过`${PACKAGE_NAME} fix`来修复。
    //
    // ✔ 无问题
    if (!fix && total > 0) {
        output += chalk[summaryColor].bold(
            [
                `${UNICODE.failure} `,
                total,
                pluralize('个问题', total),
                ' (',
                errorCount,
                pluralize('个错误', errorCount),
                ', ',
                warningCount,
                pluralize('个警告', warningCount),
                ')\n',
            ].join(''),
        );
        if (fixableErrorCount > 0 || fixableWarningCount > 0) {
            output += chalk[summaryColor].bold(
                [
                    '  ',
                    fixableErrorCount,
                    pluralize(' 个错误', fixableErrorCount),
                    ' 和 ',
                    fixableWarningCount,
                    pluralize(' 个警告', fixableWarningCount),
                    ` 可以通过\`${PACKAGE_NAME} fix\`来修复。`,
                ].join(''),
            );
        }
    }
    if (!fix && total === 0) output = chalk.green.bold(`${UNICODE.success} 无问题`);

    console.log(chalk.reset(output));
};
