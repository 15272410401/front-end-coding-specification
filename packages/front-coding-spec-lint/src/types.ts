import { ESLint } from 'eslint';
import stylelint from 'stylelint';
// 导出 markdownlint 配置项类型
import { Options as markdownlintOptions } from 'markdownlint';

// 项目初始化时选项
export interface InitOptions {
    cwd: string;
    // 是否检查并升级 front-coding-spec-lint 的版本
    checkVersionUpdate: boolean;
    // 是否需要自动重写 lint 配置
    rewriteConfig?: boolean;
    // eslint 类型
    eslintType?: string;
    // 是否启用 ESLint
    enableESLint?: boolean;
    // 是否启用 stylelint
    enableStylelint?: boolean;
    // 是否启用 markdownlint
    enableMarkdownlint?: boolean;
    // 是否启用 prettier
    enablePrettier?: boolean;
    // 是否禁用自动在初始化完成后安装依赖
    disableNpmInstall?: boolean;
}

// 项目 package.json 内容类型
export interface PackageJson {
    // eslint 配置
    eslintConfig?: any;
    // eslint 忽略文件
    eslintIgnore?: string[];
    // stylelint 配置
    stylelint?: any;
    // peerDependencies 依赖
    peerDependencies?: Record<string, string>;
    // devDependencies 依赖
    devDependencies?: Record<string, string>;
    // dependencies 依赖
    dependencies?: Record<string, string>;

    // 用于保存原有的内容
    [key: string]: any;
}

// 项目配置项
export interface Config {
    // 是否启用 ESLint
    enableESLint?: boolean;
    // 是否启用 stylelint
    enableStylelint?: boolean;
    // 是否启用 markdown lint
    enableMarkdownlint?: boolean;
    // 是否启用 prettier
    enablePrettier?: boolean;
    // ESLint 配置项
    eslintOptions?: ESLint.Options;
    // stylelint 配置项
    stylelintOptions?: stylelint.LinterOptions;
    // markdownlint 配置项
    markdownlintOptions?: markdownlintOptions;
}

// 项目扫描时选项类型
export interface ScanOptions {
    // lint 运行的工程目录
    cwd: string;
    // 进行规范扫描的目录
    include: string;
    // 进行规范扫描的文件列表
    files?: string[];
    // 仅报告错误信息
    quiet?: boolean;
    // 忽略 eslint 的 ignore 配置文件和 ignore 规则
    ignore?: boolean;
    // 自动修复
    fix?: boolean;
    // 生成报告文件
    outputReport?: boolean;
    // scan 时指定 front-coding-spec-lint 配置项，优先级高于 front-coding-spec-lint.config.js
    config?: Config;
}

// 项目扫描结果类型
export interface ScanResult {
    // 文件路径
    filePath: string;
    // 错误数量
    errorCount: number;
    // 警告数量
    warningCount: number;
    // 可修复错误数量
    fixableErrorCount: number;
    // 可修复警告数量
    fixableWarningCount: number;
    // 错误信息列表
    messages: Array<{
        // 行号
        line: number;
        // 列号
        column: number;
        // 规则名称
        rule: string;
        // 规则链接
        url: string;
        // 错误信息
        message: string;
        // 是否为错误
        errored: boolean;
    }>;
}

// 项目扫描报告类型
export interface ScanReport {
    results: ScanResult[];
    errorCount: number;
    warningCount: number;
    runErrors: Error[];
}
