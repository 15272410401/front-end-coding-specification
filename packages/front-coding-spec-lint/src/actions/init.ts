// inquirer => 命令行交互工具
import inquirer from 'inquirer';
// fs-extra => 文件系统操作工具
import fsExtra from 'fs-extra';
import path from 'path';
import { OBJECT_TYPES } from '../utils/constants';
import type { InitOptions, PackageJson } from '../types';
import update from './update';
import log from '../utils/log';
// cross-spawn => 跨平台命令执行工具
import spawn from 'cross-spawn';
import npmType from '../utils/npm-type';
import { PACKAGE_NAME } from '../utils/constants';
import conflictResolve from '../utils/conflict-resolve';
import generateTemplate from '../utils/generate-template';



let step = 0;
// cli执行第一步：选择项目类型（语言和框架）
const selectObjectType = async (): Promise<string> => {
    const { value } = await inquirer.prompt([
        {
            type: 'list',
            name: 'value',
            message: `${step + 1}: 请选择要创建的项目类型`,
            choices: OBJECT_TYPES,
        },
    ]);

    step++;
    return value;
};

// cli执行第二步：选择是否启用stylelint
const selectEnableStylelint = async (defaultValue: boolean): Promise<boolean> => {
    const { value } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'value',
            message: `${step + 1}: 是否启用 stylelint`,
            default: defaultValue,
        },
    ]);

    step++;
    return value;
};

// cli执行第三步：选择是否启用markdownlint
const selectEnableMarkdownlint = async (): Promise<boolean> => {
    const { value } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'value',
            message: `${step + 1}: 是否启用 markdownlint`,
            default: true,
        },
    ]);

    step++;
    return value;
};

// cli执行第四步：选择是否启用prettier
const selectEnablePrettier = async (): Promise<boolean> => {
    const { value } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'value',
            message: `${step + 1}: 是否启用 prettier`,
            default: true,
        },
    ]);

    step++;
    return value;
};

// cli具体的初始化流程实现
export default async (options: InitOptions): Promise<void> => {
    // 获取初始化根目录
    const cwd = options.cwd || process.cwd();
    // 是否是测试环境
    const isTest = process.env.NODE_ENV === 'test';
    // 是否检查并升级 front-coding-spec-lint 的版本
    const checkVersionUpdate = options.checkVersionUpdate || false;
    // 是否禁用自动在初始化完成后安装依赖
    const disableNpmInstall = options.disableNpmInstall || false;
    // 配置信息
    const config: Record<string, any> = {};
    // package.json 路径
    const pkgPath = path.resolve(cwd, 'package.json');
    // 获取 package.json 内容
    let pkgContent: PackageJson = await fsExtra.readJsonSync(pkgPath);

    // 检查是否需要升级 front-coding-spec-lint 的版本
    if (checkVersionUpdate) {
        await update(false);
    }

    // 初始化 `enableESLint`，默认为 true，无需让用户选择
    if (typeof options.enableESLint === 'boolean') {
        config.enableESLint = options.enableESLint;
    } else {
        config.enableESLint = true;
    }

    // 初始化 `eslintType`
    if (options.eslintType && OBJECT_TYPES.find((choice) => choice.value === options.eslintType)) {
        config.eslintType = options.eslintType;
    } else {
        config.eslintType = await selectObjectType();
    }

    // 初始化 `enableStylelint`
    if (typeof options.enableStylelint === 'boolean') {
        config.enableStylelint = options.enableStylelint;
    } else {
        config.enableStylelint = await selectEnableStylelint(!/node/.test(config.eslintType));
    }

    // 初始化 `enableMarkdownlint`
    if (typeof options.enableMarkdownlint === 'boolean') {
        config.enableMarkdownlint = options.enableMarkdownlint;
    } else {
        config.enableMarkdownlint = await selectEnableMarkdownlint();
    }

    // 初始化 `enablePrettier`
    if (typeof options.enablePrettier === 'boolean') {
        config.enablePrettier = options.enablePrettier;
    } else {
        config.enablePrettier = await selectEnablePrettier();
    }

    if (!isTest) {
        log.info(`Step ${++step}. 检查并处理项目中可能存在的依赖和配置冲突`);
        pkgContent = await conflictResolve(cwd, options.rewriteConfig);
        log.success(`Step ${step}. 已完成项目依赖和配置冲突检查处理`);

        if (!disableNpmInstall) {
            log.info(`Step ${++step}. 安装依赖`);
            const npm = await npmType;
            spawn.sync(npm, ['i', '-D', PACKAGE_NAME], { stdio: 'inherit', cwd });
            log.success(`Step ${step}. 安装依赖成功`);
        }
    }

    // 更新 pkg.json
    pkgContent = await fsExtra.readJsonSync(pkgPath);
    // 在 `package.json` 中写入 `scripts` 脚本
    // 一键扫描和修复
    if (!pkgContent.scripts) {
        pkgContent.scripts = {};
    }
    if (!pkgContent.scripts[`${PACKAGE_NAME}-scan`]) {
        pkgContent.scripts[`${PACKAGE_NAME}-scan`] = `${PACKAGE_NAME} scan`;
    }
    if (!pkgContent.scripts[`${PACKAGE_NAME}-fix`]) {
        pkgContent.scripts[`${PACKAGE_NAME}-fix`] = `${PACKAGE_NAME} fix`;
    }

    // 配置 commit 卡点
    log.info(`Step ${++step}. 配置 git commit 卡点`);
    if (!pkgContent.husky) pkgContent.husky = {};
    if (!pkgContent.husky.hooks) pkgContent.husky.hooks = {};
    pkgContent.husky.hooks['pre-commit'] = `${PACKAGE_NAME} commit-file-scan`;
    pkgContent.husky.hooks['commit-msg'] = `${PACKAGE_NAME} commit-msg-scan`;
    await fsExtra.writeFileSync(pkgPath, JSON.stringify(pkgContent, null, 2));
    log.success(`Step ${step}. 配置 git commit 卡点成功`);

    log.info(`Step ${++step}. 写入配置文件`);
    await generateTemplate(cwd, config);
    log.success(`Step ${step}. 写入配置文件成功`);

    // 完成信息
    const logs = [`${PACKAGE_NAME} 初始化完成`].join('\r\n');
    log.success(logs);
};