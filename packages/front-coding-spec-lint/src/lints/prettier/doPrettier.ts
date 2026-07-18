import path from 'path';
// fast-glob => 文件系统遍历和匹配库
import fastGlob from 'fast-glob';
// fs-extra => 提供了 fs 模块的额外功能，如读取 JSON 文件等
import fsExtra from 'fs-extra';
import prettier from 'prettier';
import { ScanOptions } from '../../types';
import { PRETTIER_FILE_EXT, PRETTIER_IGNORE_PATTERN } from '../../utils/constants';

/**
 * Prettier 格式化选项，继承自扫描选项
 */
export interface DoPrettierOptions extends ScanOptions { }

/**
 * 执行 Prettier 格式化
 * 
 * @param options - 格式化选项，包含工作目录、文件列表、是否修复等
 * @returns Promise<void>
 */
export async function doPrettier(options: DoPrettierOptions) {
    // 1. 初始化文件列表
    let files: string[] = [];

    // 2. 如果用户指定了文件列表，过滤出 Prettier 支持的文件类型
    if (options.files && options.files.length > 0) {
        files = options.files.filter((name) =>
            PRETTIER_FILE_EXT.includes(path.extname(name))
        );
    } else {
        // 3. 如果没有指定文件列表，使用 glob 模式在工作目录中查找文件
        // 3.1 构建 glob 模式：包含所有 Prettier 支持的文件扩展名
        const fileExtensions = PRETTIER_FILE_EXT.map((ext) => ext.replace(/^\./, '')).join(',');
        const pattern = `**/*.{${fileExtensions}}`;

        // 3.2 使用 fast-glob 查找文件，排除忽略模式中的文件
        files = await fastGlob(pattern, {
            cwd: options.cwd,
            ignore: PRETTIER_IGNORE_PATTERN,
        });
    }

    // 4. 如果没有找到匹配的文件，直接返回
    if (files.length === 0) {
        return;
    }

    // 5. 并行处理所有文件的格式化
    // 使用 Promise.all 提高处理效率
    await Promise.all(files.map((filepath) => formatFile(filepath, options.cwd)));
}

/**
 * 格式化单个文件
 * 
 * @param filepath - 文件相对路径
 * @param cwd - 工作目录绝对路径
 * @returns Promise<void>
 */
async function formatFile(filepath: string, cwd: string) {
    try {
        // 1. 获取文件的绝对路径
        const absolutePath = path.resolve(cwd, filepath);

        // 2. 读取文件内容
        const text = await fsExtra.readFile(absolutePath, 'utf8');

        // 3. 解析该文件对应的 Prettier 配置
        // prettier.resolveConfig 会自动查找 .prettierrc 或 package.json 中的配置
        const prettierOptions = await prettier.resolveConfig(absolutePath);

        // 4. 执行格式化
        // 传入 filepath 参数让 Prettier 能根据文件扩展名选择正确的解析器
        // 使用 prettierOptions || {} 防止 resolveConfig 返回 undefined 时展开报错
        // prettier.format() 返回 Promise<string>，需要 await 获取结果
        const formatted = await prettier.format(text, {
            ...(prettierOptions || {}),
            filepath: absolutePath,
        });

        // 5. 将格式化后的内容写回文件
        await fsExtra.writeFile(absolutePath, formatted, 'utf8');
    } catch (error) {
        // 6. 错误处理：如果格式化失败，输出错误信息但不中断其他文件的处理
        console.error(`Prettier 格式化文件失败: ${filepath}`);
        console.error(error);
    }
}