const app = require('app');
import * as fs from 'fs';
import promisify from 'native-promisify';
const readFile = promisify(fs.readFile);

export async function get() {
    let data: string = await readFile(app.getPath('userData') + '/' + 'config.json', 'ascii');
    return JSON.parse(data);
}

export function set() {

}
