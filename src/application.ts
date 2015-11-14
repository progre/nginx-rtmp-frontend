const app = require('app');
const BrowserWindow = require('browser-window');
import * as log4js from 'log4js';
const logger = log4js.getLogger();
import promisify from 'native-promisify';
const nginx = require('nginx-server');
import TrayIcon from './ui/trayicon';
import {mainWindow} from './ui/windowfactory';
import * as repository from './service/repository';

export default class Application {
    private server: any;

    static async new() {
        await new Promise((resolve, reject) => app.once('ready', resolve));
        keepAlive();
        let trayIcon = new TrayIcon();
        trayIcon.on('quit', () => {
            app.quit();
        });
        let config: any;
        try {
            config = await repository.get();
        } catch (e) {
        }
        let instance = new Application();
        if (config == null) {
            mainWindow().show();
            // return instance;
        }
        await instance.startServer();
        return instance;
    }

    constructor() {
        this.initServer();
    }

    private initServer() {
        var options = {
            command: 'E:\\Applications\\Developments\\nginx 1.9.7.1 Kitty\\nginx.exe',
            config: 'E:\\Developments\\rtmpmulti\\nginx.conf'
        };
        this.server = nginx(options);
        this.server.startAsync = promisify(this.server.start);
        this.server.stopAsync = promisify(this.server.stop);
    }

    private async startServer() {
        logger.debug('nginx starting.');
        logger.debug('', this.server.start);
        this.server.start((a: any, b: any) => {
            logger.info('nginx started.', a, b);
        });
    }

    private async stopServer() {
        await this.server.stop();
        logger.info('nginx stopped.');
    }
}

function keepAlive() {
    new BrowserWindow({ width: 0, height: 0, show: false });
}
