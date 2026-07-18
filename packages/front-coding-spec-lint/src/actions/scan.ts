import path from 'path';
// fs-extra => 提供了 fs 模块的额外功能，如读取 JSON 文件等
import fsExtra from 'fs-extra';
import { Config, PackageJson, ScanOptions, ScanReport, ScanResult } from '../types';
import { PACKAGE_NAME } from '../utils/constants';
import { doESLint, doMarkdownlint, doPrettier, doStylelint } from '../lints';

export default async (options: ScanOptions): Promise<ScanReport> => {
    const { cwd, fix, outputReport, config: scanConfig } = options;

    // 读取配置文件
    const readConfigFile = async (pathStr: string): Promise<any> => {
        const localPath = path.resolve(cwd, pathStr);
        if (!fsExtra.existsSync(localPath)) {
            return {};
        }
        if (pathStr.endsWith('.json')) {
            return fsExtra.readJsonSync(localPath);
        }
        const config = await import(localPath);
        return config.default || config;
    };

    // 初始化需要用到的变量
    const pkgContent: PackageJson = fsExtra.existsSync(path.resolve(cwd, 'package.json')) 
        ? fsExtra.readJsonSync(path.resolve(cwd, 'package.json')) 
        : {};
    const config: Config = scanConfig || await readConfigFile(`${PACKAGE_NAME}.config.js`);
    let results: ScanResult[] = [];
    const runErrors: Error[] = [];

    // 先格式化代码确保代码格式一致，后进行代码检查
    // prettier => 格式化代码
    if (fix && config.enablePrettier !== false) {
        await doPrettier(options);
    }
    // eslint => 检查代码是否符合 eslint 规则
    if (config.enableESLint !== false) {
        try {
            const eslintResults = await doESLint({ ...options, pkgContent, config });
            results = results.concat(eslintResults);
        } catch (error) {
            runErrors.push(error as Error);
        }
    }
    // stylelint => 检查代码是否符合 stylelint 规则
    if (config.enableStylelint !== false) {
        try {
            const stylelintResults = await doStylelint({ ...options, pkgContent, config });
            results = results.concat(stylelintResults);
        } catch (error) {
            runErrors.push(error as Error);
        }
    }
    // markdown => 检查代码是否符合 markdown 规则
    if (config.enableMarkdownlint !== false) {
        try {
            const markdownlintResults = await doMarkdownlint({ ...options, pkgContent, config });
            results = results.concat(markdownlintResults);
        } catch (error) {
            runErrors.push(error as Error);
        }
    }
    // 生成报告报告文件
    if (outputReport) {
        const reportPath = path.resolve(process.cwd(), `./${PACKAGE_NAME}-report.json`);
        fsExtra.outputFile(reportPath, JSON.stringify(results, null, 2), () => { });
    }

    return {
        results,
        errorCount: results.reduce((count, { errorCount }) => count + errorCount, 0),
        warningCount: results.reduce((count, { warningCount }) => count + warningCount, 0),
        runErrors,
    };
};