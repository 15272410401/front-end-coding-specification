import path from 'path';
// fs-extra => 提供了 fs 模块的额外功能，如读取 JSON 文件等
import fsExtra from 'fs-extra';


// 获取 package.json 中的数据
const pkgContent: Record<string, any> = JSON.parse(fsExtra.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8'));
// 导出 项目名称和版本号
export const PACKAGE_NAME = pkgContent.name;
export const PACKAGE_VERSION = pkgContent.version;

// 导出 对与错 的 unicode 字符
export const UNICODE = {
    success: '\u2714', // ✔
    failure: '\u2716', // ✖
} as const;

// 导出 初始化项目时可以选择的项目类型
export const OBJECT_TYPES = [{
    name: '单 JavaScript 项目',
    value: 'index',
},
{
    name: '单 TypeScript 项目',
    value: 'typescript',
},
{
    name: 'Vue 项目（JavaScript）',
    value: 'vue',
},
{
    name: 'Vue 项目（TypeScript）',
    value: 'typescript/vue',
},
{
    name: 'Node.js 项目（JavaScript）',
    value: 'node',
},
{
    name: 'Node.js 项目（TypeScript）',
    value: 'typescript/node',
},
{
    name: '使用 ES5 及之前版本 JavaScript 的老项目',
    value: 'es5',
}];


/**
 * eslint 扫描文件扩展名
 */
export const ESLINT_FILE_EXT: string[] = ['.js', '.ts', '.vue'];

/**
 * eslint 扫描忽略的文件或文件目录
 * 需要同步到 config/.eslintignore.ejs
 */
export const ESLINT_IGNORE_PATTERN: string[] = [
    'node_modules',
    'build',
    'dist',
    'coverage',
    'es',
    'lib',
    '**/*.min.js',
    '**/*-min.js',
    '**/*.bundle.js',
];

/**
 * stylelint 扫描文件扩展名
 */
export const STYLELINT_FILE_EXT: string[] = ['.css', '.scss', '.less', '.sass'];

/**
 * stylelint 扫描忽略的文件或文件目录
 * 需要同步到 config/.stylelintignore.ejs
 */
export const STYLELINT_IGNORE_PATTERN: string[] = [
    'node_modules/',
    'build/',
    'dist/',
    'coverage/',
    'es/',
    'lib/',
    '**/*.min.css',
    '**/*-min.css',
    '**/*.bundle.css',
];

/**
 * markdownlint 扫描文件扩展名
 */
export const MARKDOWN_LINT_FILE_EXT: string[] = ['.md', '.markdown'];

/**
 * markdownLint 扫描忽略的文件或文件目录
 */
export const MARKDOWN_LINT_IGNORE_PATTERN: string[] = [
    'node_modules/',
    'build/',
    'dist/',
    'coverage/',
    'es/',
    'lib/',
];


/**
 * Prettier 扫描文件扩展名
 */
export const PRETTIER_FILE_EXT = [
    ...ESLINT_FILE_EXT,
    ...STYLELINT_FILE_EXT,
    ...MARKDOWN_LINT_FILE_EXT,
];

/**
 * Prettier 扫描忽略的文件或文件目录
 */
export const PRETTIER_IGNORE_PATTERN: string[] = [
    'node_modules/**/*',
    'build/**/*',
    'dist/**/*',
    'lib/**/*',
    'es/**/*',
    'coverage/**/*',
];