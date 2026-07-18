// execSync => 内置模块，用于执行系统命令
import { execSync } from 'child_process';
// ora => 终端加载动画工具
import ora from 'ora';
import npmType from '../utils/npm-type';
import { PACKAGE_NAME, PACKAGE_VERSION } from '../utils/constants';
import log from '../utils/log';

// 检测包的最新版本号
const checkVersionUpdate = async (): Promise<string | null> => {
    const npm = await npmType;

    // 获取当前包的最新版本号
    const latestVersion = execSync(`${npm} view ${PACKAGE_NAME} version`).toString('utf-8').trim();
    if (latestVersion === PACKAGE_VERSION) {
        return null;
    }
    // 如果当前包大于最新包，返回null，否则返回最新版
    const versionArr = PACKAGE_VERSION.split('.').map(Number);
    const latestVersionArr = latestVersion.split('.').map(Number);
    for (let i = 0; i < versionArr.length; i++) {
        if (versionArr[i] > latestVersionArr[i]) {
            return null;
        } else if (versionArr[i] < latestVersionArr[i]) {
            return latestVersion;
        }
    }
    return null;
}

// 如果有最新版本，默认为自动更新安装最新
export default async (install: boolean = true) => {
    const checking = ora(`[${PACKAGE_NAME}] 正在检查最新版本...`);
    checking.start();
    try {
        const npm = await npmType;
        const latestVersion = await checkVersionUpdate();
        checking.stop();
        if (latestVersion && install) {
            const update = ora(`[${PACKAGE_NAME}] 存在新版本，将升级至 ${latestVersion}`);
            update.start();
            // 开始安装最新版本
            execSync(`${npm} i -g ${PACKAGE_NAME}`);
            update.stop();
        } else if (latestVersion) {
            log.warn(`最新版本为 ${latestVersion}，本地版本为 ${PACKAGE_VERSION}，请尽快升级到最新版本。\n你可以执行 ${npm} install -g ${PACKAGE_NAME}@latest 来安装此版本\n`);
        } else if (install) {
            log.info(`当前已是最新版本`);
        }
    } catch (error) {
        checking.stop();
        log.error(error as string);
    }
}