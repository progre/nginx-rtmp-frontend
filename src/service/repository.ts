const app = require('app');
import * as fs from 'fs';
import promisify from 'native-promisify';
const readFile = promisify(fs.readFile);

export async function get() {
    let data: string;
    try {
        data = await readFile(app.getPath('userData') + '/' + 'config.json', 'ascii');
        return JSON.parse(data);
    } catch (e) {
        return {
            exePath: 'E:\\Applications\\Developments\\nginx 1.9.7.1 Kitty\\nginx.exe',
            confPath: 'E:\\Developments\\rtmpmulti\\nginx.conf'
        };
    }
}

export function set() {
}
