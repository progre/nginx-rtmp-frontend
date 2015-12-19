const app = require('app');
const BrowserWindow = require('browser-window');
import {visitor} from './service/gafactory';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
import TrayIcon from './ui/trayicon';
import {createMainWindow} from './ui/windowfactory';
import Nginx from './service/nginx';
import {default as Repository, Config} from './service/repository';
import NginxConfig from './service/nginxconfig';
const fetch = require('node-fetch');

const SERVICES = ['twitch', 'peercaststation', 'cavetube', 'livecodingtv', 'niconico', 'other'];

export default class Application {
    private nginx = new Nginx();
    private trayIcon = new TrayIcon();
    private mainWindow: GitHubElectron.BrowserWindow = null;

    static async new() {
        let [, [repository, config, nginxConfig], ingests] = await Promise.all<any>([
            new Promise((resolve, reject) => app.once('ready', resolve))
                .then(() => keepAlive()),
            Repository.new()
                .then(repository => Promise.all<any>([
                    repository,
                    repository.getConfig(),
                    repository.nginxConfig
                ])),
            fetch('https://api.twitch.tv/kraken/ingests')
                .then((res: any) => res.json())
                .then((json: any) => json.ingests)
        ]);
        let instance = new Application(repository, config, nginxConfig, ingests);
        if (repository == null || config == null || nginxConfig == null) {
            instance.showMainWindow();
            return instance;
        }
        instance.startServer();
        return instance;
    }

    constructor(
        private repository: Repository,
        private config: Config,
        private nginxConfig: NginxConfig,
        ingests: any
    ) {
        visitor.pageview('/').send();

        app.addListener('quit', () => {
            this.release();
        });
        this.nginx.on('close', () => {
            this.trayIcon.running = false;
            visitor.event('ui', 'close').send();
        });
        this.trayIcon.on('quit', () => {
            app.quit();
        });
        this.trayIcon.on('config', () => {
            this.showMainWindow();
            visitor.event('ui', 'config').send();
        });
        this.trayIcon.on('click', () => {
            if (this.mainWindow != null) {
                this.showMainWindow();
            }
            visitor.event('ui', 'click').send();
        });

        let self = this;
        (<any>global).mainProcess = {
            config,
            nginxConfig: {
                port() { return nginxConfig.port; },
                setPort(value: number) { nginxConfig.port = value; },
                fms(service: string) { return nginxConfig.fms(service); },
                setFms(service: string, fms: string) { nginxConfig.setFms(service, fms); },
                key(service: string) { return nginxConfig.key(service); },
                setKey(service: string, key: string) { nginxConfig.setKey(service, key); },
                enabled(service: string) { return nginxConfig.enabled(service); },
                enable(service: string) { nginxConfig.enable(service); },
                disable(service: string) { nginxConfig.disable(service); }
            },
            ingests,
            save() {
                Promise.all([
                    repository.setConfig(config),
                    nginxConfig.save()
                ]).catch(e => {
                    logger.error(e);
                });
                visitor.event('ui', 'save').send();
            },
            restart() {
                self.stopServer();
                self.startServer();
                visitor
                    .event('ui', 'restart', broadcastingServices(nginxConfig).join(', '))
                    .send();
            }
        };
    }

    release() {
        this.repository.release();
    }

    private showMainWindow() {
        if (this.mainWindow == null) {
            this.initMainWindow();
        }
        this.mainWindow.show();
    }

    private initMainWindow() {
        this.mainWindow = createMainWindow();
        this.mainWindow.on('close', () => {
            this.mainWindow = null;
        });
    }

    private startServer() {
        this.nginx.start(this.config.exePath);
        this.trayIcon.running = true;
    }

    private stopServer() {
        this.nginx.stop();
    }
}

function keepAlive() {
    new BrowserWindow({ width: 0, height: 0, show: false });
}

function broadcastingServices(nginxConfig: NginxConfig) {
    return SERVICES.filter(x => nginxConfig.enabled(x));
}
