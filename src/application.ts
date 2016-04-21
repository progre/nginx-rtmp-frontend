const app = require("app");
const BrowserWindow = require("browser-window");
import {visitor} from "./service/gafactory";
import * as log4js from "log4js";
const logger = log4js.getLogger();
import TrayIcon from "./ui/trayicon";
import {createMainWindow} from "./ui/windowfactory";
import {initMenu} from "./ui/appmenu";
import Browser from "./service/browser";
import Nginx from "./service/nginx";
import migrate from "./service/configmigrator";
import Repository, {Config} from "./service/repository";
import NginxConfig from "./service/nginxconfig";
const fetch = require("node-fetch");

const SERVICES = ["twitch", "peercaststation", "cavetube", "livecodingtv", "niconico", "other"];

export default class Application {
    private nginx = new Nginx();
    private trayIcon = new TrayIcon();
    private mainWindow: Electron.BrowserWindow = null;

    static async new() {
        let [, [repository, config, nginxConfig], ingests] = await Promise.all<any>([
            new Promise((resolve, reject) => app.once("ready", resolve))
                .then(() => keepAlive()),
            migrate()
                .then(() => Repository.new())
                .then(repository => Promise.all<any>([
                    repository,
                    repository.getConfig(),
                    repository.nginxConfig
                ])),
            fetch("https://api.twitch.tv/kraken/ingests")
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
        visitor.pageview("/").send();

        initMenu();

        app.addListener("quit", () => {
            this.release();
        });
        this.nginx.on("close", () => {
            this.trayIcon.running = false;
            visitor.event("ui", "close").send();
        });
        this.trayIcon.on("quit", () => {
            app.quit();
        });
        this.trayIcon.on("config", () => {
            this.showMainWindow();
            visitor.event("ui", "config").send();
        });
        this.trayIcon.on("click", () => {
            if (this.mainWindow != null) {
                this.showMainWindow();
            }
            visitor.event("ui", "click").send();
        });

        exportToRenderer(new Browser(repository, () => this.restart()));
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
        this.mainWindow.on("close", () => {
            this.mainWindow = null;
        });
    }

    private startServer() {
        this.nginx.start(this.config.exePath);
        this.trayIcon.running = true;
        visitor
            .event("ui", "start", broadcastingServices(this.nginxConfig).join(", "))
            .send();
    }

    private stopServer() {
        this.nginx.stop();
    }

    private restart() {
        this.stopServer();
        this.startServer();
    }
}

function exportToRenderer(browser: Browser) {
    (<any>window).browser = browser;
}

function keepAlive() {
    /* tslint:disable:no-unused-expression */
    new BrowserWindow({ width: 0, height: 0, show: false });
    /* tslint:enable:no-unused-expression */
}

function broadcastingServices(nginxConfig: NginxConfig) {
    return SERVICES.filter(x => nginxConfig.enabled(x));
}
