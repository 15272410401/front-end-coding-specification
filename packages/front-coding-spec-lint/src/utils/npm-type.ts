import { sync as commandExistsSync } from 'command-exists';

const promise: Promise<'npm' | 'pnpm'> = new Promise((resolve, reject) => {
    if (commandExistsSync('pnpm')) {
        resolve('pnpm');
    } else if (commandExistsSync('npm')) {
        resolve('npm');
    } else {
        reject(new Error('未安装npm和pnpm'));
    }
});

export default promise;
