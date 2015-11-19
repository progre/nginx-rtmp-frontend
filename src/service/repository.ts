const app = require('app');
import * as log4js from 'log4js';
const logger = log4js.getLogger();
import promisify from 'native-promisify';
import * as fs from 'fs';
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
import {normalize} from 'path';
const NginxConfFile = require('nginx-conf').NginxConfFile;
const create = promisify(NginxConfFile.create);

const CONFIG_PATH = app.getPath('userData') + '/' + 'config.json';
export const NGINX_CONFIG_PATH = app.getPath('userData') + '/' + 'nginx.conf';
const NGINX_CONFIG_TEMPLATE_PATH = normalize(__dirname + '/../res/nginx-default.conf');

export async function init() {
    let ex = await new Promise((resolve, reject) => {
        fs.exists(NGINX_CONFIG_PATH, resolve)
    });
    if (ex) {
        return;
    }
    return new Promise((resolve, reject) =>
        fs.createReadStream(NGINX_CONFIG_TEMPLATE_PATH)
            .pipe(fs.createWriteStream(NGINX_CONFIG_PATH))
            .once('error', reject)
            .once('close', resolve));
}

export async function getConfig() {
    let data: string;
    try {
        data = await readFile(CONFIG_PATH, 'ascii');
        return <Config>JSON.parse(data);
    } catch (e) {
        return <Config>{
            exePath: 'E:\\Applications\\Developments\\nginx 1.7.12.1 Lizard\\nginx.exe',
        };
    }
}

export function setConfig(config: Config) {
    logger.debug('save');
    return writeFile(CONFIG_PATH, JSON.stringify(config), { encoding: 'ascii' });
}

export interface Config {
    exePath: string;
}
