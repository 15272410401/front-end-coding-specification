import path from 'path';
// eslint => 代码规范检查工具
import { ESLint } from 'eslint';
// fast-glob => 文件系统遍历和匹配库
import fastGlob from 'fast-glob';
import { Config, PackageJson, ScanOptions } from '../../types';
import { ESLINT_FILE_EXT, ESLINT_IGNORE_PATTERN } from '../../utils/constants';

import { getESLintConfig } from './getESLintConfig';
import { formatESLintResults } from './formatESLintResults';

// 重新定义选项类型，添加 pkgContent，config 字段
export interface DoESLintOptions extends ScanOptions {
  pkgContent: PackageJson;
  config?: Config;
}

export async function doESLint(options: DoESLintOptions) {
  let files: string[];
  // 获取所有需要lint的文件
  if (options.files) {
    files = options.files.filter((name) => ESLINT_FILE_EXT.includes(path.extname(name)));
  } else {
    files = await fastGlob(`**/*.{${ESLINT_FILE_EXT.map((t) => t.replace(/^\./, '')).join(',')}}`, {
      cwd: options.cwd,
      ignore: ESLINT_IGNORE_PATTERN,
    });
  }
  // 初始化eslint实例
  const eslint = new ESLint(await getESLintConfig(options, options.pkgContent, options.config || {}));
  // 执行eslint检查
  const reports = await eslint.lintFiles(files);

  // 修复代码规范问题
  if (options.fix) {
    await ESLint.outputFixes(reports);
  }

  // 格式化结果
  return formatESLintResults(reports, options.quiet || false, eslint);
}
