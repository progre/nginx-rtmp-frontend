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
    private mainWindow = mainWindow();

    static async new() {
        let [, config] = await Promise.all<any>([
            new Promise((resolve, reject) => app.once('ready', resolve))
                .then(() => keepAlive()),
            repository.init()
                .then(() => repository.getConfig())
        ]);
        let instance = new Application(config);
        if (config == null) {
            instance.mainWindow.show();
            return instance;
        }
        instance.startServer();
        return instance;
    }

    constructor(private config: repository.Config) {
        (<any>global).mainProcess = {
            config,
            save() {
                repository.setConfig(config)
            }
        };

        let onClose = () => {
            logger.info('on close');
            this.mainWindow = mainWindow();
            this.mainWindow.on('close', onClose);
        }
        this.mainWindow.on('close', onClose);
        this.trayIcon.on('quit', () => {
            app.quit();
        });
        this.trayIcon.on('config', () => {
            this.mainWindow.show();
        });
    }

    private startServer() {
        this.nginx.start(this.config.exePath);
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
