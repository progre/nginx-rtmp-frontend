const app = require('app');
const BrowserWindow = require('browser-window');
import * as log4js from 'log4js';
const logger = log4js.getLogger();
import promisify from 'native-promisify';
import TrayIcon from './ui/trayicon';
import {mainWindow} from './ui/windowfactory';
import Nginx from './service/nginx';
import * as repository from './service/repository';

export default class Application {
    private nginx = new Nginx();
    private trayIcon = new TrayIcon();

    static async new() {
        await new Promise((resolve, reject) => app.once('ready', resolve));
        keepAlive();
        let config: any;
        try {
            config = await repository.get();
        } catch (e) {
        }
        let instance = new Application(config);
        if (config == null) {
            mainWindow().show();
            // return instance;
        }
        instance.startServer();
        return instance;
    }

    constructor(config: any) {
        this.trayIcon.on('quit', () => {
            app.quit();
        });
        this.nginx.exePath = config.exePath;
        this.nginx.confPath = config.confPath;
    }

    private startServer() {
        this.nginx.start();
    }

    private stopServer() {
        this.nginx.stop();
    }
}

function keepAlive() {
    new BrowserWindow({ width: 0, height: 0, show: false });
}
