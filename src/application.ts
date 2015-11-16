const app = require('app');
const BrowserWindow = require('browser-window');
import TrayIcon from './ui/trayicon';
import {mainWindow} from './ui/windowfactory';
import Nginx from './service/nginx';
import * as repository from './service/repository';
import * as log4js from 'log4js';
const logger = log4js.getLogger();

export default class Application {
    private nginx = new Nginx();
    private trayIcon = new TrayIcon();

    static async new() {
        let [_, config] = await Promise.all<any>([
            (async() => {
                await new Promise((resolve, reject) => app.once('ready', resolve));
                await keepAlive();
            })(),
            (async() => {
                await repository.init();
                return await repository.getConfig();
            })()
        ]);
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
        this.trayIcon.running = true;
    }

    private stopServer() {
        this.nginx.stop();
        this.trayIcon.running = false;
    }
}

function keepAlive() {
    new BrowserWindow({ width: 0, height: 0, show: false });
}
