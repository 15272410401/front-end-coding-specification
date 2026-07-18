import initAction from './actions/init';
import scanAction from './actions/scan';
import printReport from './utils/print-report';
import { PACKAGE_NAME } from './utils/constants';
import type { InitOptions, ScanOptions } from './types';
// ora => 终端加载动画工具
import ora from 'ora';

// 重新声明类型 InitOptions，移除 checkVersionUpdate 字段
type IInitOptions = Omit<InitOptions, 'checkVersionUpdate'>;

export const init = async (options: IInitOptions) => {
  return await initAction({
    ...options,
    checkVersionUpdate: false,
  });
};

export const scan = async (options: ScanOptions) => {
  const checking = ora();
  checking.start(`执行 ${PACKAGE_NAME} 代码检查`);

  const report = await scanAction(options);
  const { results, errorCount, warningCount } = report;

  if (errorCount > 0) {
    checking.fail();
  } else if (warningCount > 0) {
    checking.warn();
  } else {
    checking.succeed();
  }

  if (results.length > 0) {
    printReport(results, false);
  }
  return report;
};
