import path from 'path';
import { ESLint } from 'eslint';
// fs-extra => 提供了 fs 模块的额外功能，如读取 JSON 文件等
import fsExtra from 'fs-extra';
import type { Config, PackageJson, ScanOptions } from '../../types';
import { ESLINT_FILE_EXT } from '../../utils/constants';
import { getESLintConfigType } from './getESLintConfigType';

/**
 * 获取 ESLint 配置（ESLint 9+ 扁平配置格式）
 * 
 * @param opts - 扫描选项，包含工作目录、是否自动修复、是否忽略配置等
 * @param pkgContent - 项目 package.json 内容
 * @param config - 项目配置，包含是否启用 ESLint、Prettier 等配置项
 * @returns ESLint.Options - ESLint 初始化选项
 */
export async function getESLintConfig(opts: ScanOptions, pkgContent: PackageJson, config: Config): Promise<ESLint.Options> {
  // 1. 从扫描选项中解构出需要的参数
  const { cwd, fix, ignore } = opts;

  // 2. 初始化基础的 ESLint 配置对象
  // cwd: 指定 ESLint 工作目录
  // fix: 是否自动修复可修复的问题
  // ignore: 是否忽略 .eslintignore 配置
  // errorOnUnmatchedPattern: 当指定的文件模式没有匹配到文件时是否报错，设为 false 避免不必要的错误
  const lintConfig: ESLint.Options = {
    cwd,
    fix,
    ignore,
    errorOnUnmatchedPattern: false,
  };

  // 3. 检查用户是否传入了自定义的 eslintOptions
  // 如果用户在配置中自定义了 eslintOptions，直接使用用户的配置，不再生成默认配置
  if (config.eslintOptions) {
    // 3.1 如果用户传入的 overrideConfig 是数组，直接使用
    if (Array.isArray(config.eslintOptions.overrideConfig)) {
      (lintConfig as any).overrideConfig = config.eslintOptions.overrideConfig;
    } else if (config.eslintOptions.overrideConfig) {
      // 3.2 如果用户传入的是单个配置对象，包装成数组（扁平配置要求数组格式）
      (lintConfig as any).overrideConfig = [config.eslintOptions.overrideConfig];
    }
    // 3.3 直接返回，不继续处理
    return lintConfig;
  }

  // 4. 检查项目根目录是否存在 eslint.config.js 文件
  // ESLint 9+ 默认使用 eslint.config.js 作为配置文件
  const eslintConfigPath = path.resolve(cwd, 'eslint.config.js');
  const hasEslintConfig = fsExtra.existsSync(eslintConfigPath);

  // 4.1 如果存在自定义配置文件，直接返回基础配置，让 ESLint 自动读取配置文件
  if (hasEslintConfig) {
    return lintConfig;
  }

  // 5. 如果项目没有配置文件，需要动态生成扁平配置

  // 5.1 根据项目类型（JS/TS/Vue/Node）获取对应的配置类型路径
  // 例如：'eslint-config-hcl'、'eslint-config-hcl/typescript'、'eslint-config-hcl/typescript/vue'
  const configType = getESLintConfigType(cwd, pkgContent);

  // 5.2 初始化扁平配置数组（ESLint 9+ 的扁平配置是数组形式）
  const flatConfig: ESLint.ConfigData[] = [];

  // 5.3 动态导入 eslint-config-hcl 配置包
  // 使用 await import() 是因为 eslint-config-hcl 已改为 ESM 模块
  try {
    const hclConfig = await import(configType);
    // 处理 ESM 模块导出，优先取 default 导出
    if (Array.isArray(hclConfig.default)) {
      flatConfig.push(...hclConfig.default);
    } else if (Array.isArray(hclConfig)) {
      flatConfig.push(...hclConfig);
    }
  } catch (e) {
    // 如果导入失败（如依赖未安装），静默处理，继续执行
  }

  // 6. 如果启用了 Prettier，导入 eslint-config-prettier 配置
  // eslint-config-prettier 会禁用所有与 Prettier 冲突的 ESLint 规则
  if (config.enablePrettier) {
    try {
      const prettierConfig = await import('eslint-config-prettier') as any;
      // 兼容不同导出格式
      let prettierArray: any[] = [];
      if (Array.isArray(prettierConfig.default)) {
        prettierArray = prettierConfig.default;
      } else if (Array.isArray(prettierConfig)) {
        prettierArray = prettierConfig;
      } else if (typeof prettierConfig === 'object') {
        prettierArray = [prettierConfig];
      }
      
      flatConfig.push(...prettierArray);
    } catch (e) {
      // 如果 eslint-config-prettier 未安装，静默处理
    }
  }

  // 7. 添加文件匹配模式，指定 ESLint 需要检查的文件类型
  // ESLINT_FILE_EXT 定义在 constants.ts 中，默认包含 .js, .ts, .vue
  const fileExt = ESLINT_FILE_EXT.map(t => t.replace(/^\./, '')).join(',');
  flatConfig.push({
    // @ts-expect-error ESLint 类型定义不完整，files 属性在扁平配置中是有效的
    files: [`**/*.{${fileExt}}`],
  });

  // 8. 添加默认的忽略模式
  // 这些目录和文件不需要进行 ESLint 检查
  const ignores = [
    '**/node_modules/**',   // 忽略第三方依赖
    '**/dist/**',           // 忽略构建产物
    '**/build/**',          // 忽略构建产物
    '**/coverage/**',       // 忽略测试覆盖率报告
    '**/.git/**',           // 忽略 Git 版本控制目录
    '**/*.min.js',          // 忽略压缩后的文件
    '**/*.d.ts',            // 忽略 TypeScript 类型声明文件
    '**/.eslintcache',      // 忽略 ESLint 缓存文件
  ];

  // 8.1 只有当 package.json 中没有自定义 eslintIgnore 配置时，才添加默认忽略规则
  if (!pkgContent.eslintIgnore || !pkgContent.eslintIgnore.length) {
    flatConfig.push({ ignores } as ESLint.ConfigData);
  }

  // 9. 将构建好的扁平配置数组赋值给 overrideConfig
  // 在 ESLint 9+ 中，ESLint 类等同于 FlatESLint，overrideConfig 接受扁平配置数组
  // 使用 any 类型断言是因为 ESLint 类型定义可能不完整，但运行时是支持的
  (lintConfig as any).overrideConfig = flatConfig;

  // 10. 返回完整的 ESLint 配置选项
  return lintConfig;
}