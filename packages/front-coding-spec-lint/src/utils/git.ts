// execa => 跨平台命令执行工具
import { execa, type Options } from 'execa';

/**
 * 获取此次 commit 修改的文件列表
 * 
 * @param options - execa 执行选项，包含工作目录等
 * @returns Promise<string[]> - 修改的文件路径数组
 */
export const getCommitFiles = async (options: Options = {}): Promise<string[]> => {
  try {
    const { stdout } = await execa(
      'git',
      [
        'diff',
        '--staged', // 比较 暂缓区 与 last commit 的差别
        '--diff-filter=ACMR', // 只显示 added、copied、modified、renamed
        '--name-only', // 只显示更改文件的名称
        '--ignore-submodules',
      ],
      {
        ...options,
        cwd: options.cwd || process.cwd(),
        encoding: 'utf8',
      },
    );
    return typeof stdout === 'string' ? stdout.split(/\s/).filter(Boolean) : [];
  } catch (e) {
    return [];
  }
};

/**
 * 获取未 add 的修改文件列表
 * 
 * @param options - execa 执行选项，包含工作目录等
 * @returns Promise<string> - 修改的文件路径列表（换行分隔）
 */
export const getAmendFiles = async (options: Options = {}): Promise<string> => {
  try {
    const { stdout } = await execa(
      'git',
      [
        'diff', // 比较 工作区 与 暂缓区的差别
        '--name-only',
      ],
      {
        ...options,
        cwd: options.cwd || process.cwd(),
        encoding: 'utf8',
      },
    );

    return typeof stdout === 'string' ? stdout : '';
  } catch (e) {
    return '';
  }
};
