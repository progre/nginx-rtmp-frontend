const app = require("app");
const BrowserWindow = require("browser-window");
import {getLogger} from "log4js";
const logger = getLogger();
import {visitor} from "./service/gafactory";
import TrayIcon from "./ui/trayicon";
import {createMainWindow} from "./ui/windowfactory";
import {initMenu} from "./ui/appmenu";
import Browser from "./service/browser";
import Nginx from "./service/nginx";
import migrate from "./service/configmigrator";
import Repository, {Config} from "./service/repository";
const fetch = require("node-fetch");

export default class Application {
    private nginx = new Nginx();
    private trayIcon = new TrayIcon();
    private mainWindow: Electron.BrowserWindow = null;

    static async create() {
        logger.debug("Start initialize.");
        let [, [repo, config], ingests] = await Promise.all<any>([
            // new Promise((resolve, reject) => app.once("ready", resolve))
            //     .then(() => keepAlive()),
            keepAlive(),
            (async () => {
                await migrate();
                let repo = await Repository.create();

                return Promise.all<any>([
                    repo,
                    repo.getConfig()
                ]);
            })(),
            fetch("https://api.twitch.tv/kraken/ingests")
                .then((res: any) => res.json())
                .then((json: any) => json.ingests)
        ]);
        logger.debug("Finish initialize.");
        let instance = new Application(repo, config, ingests);
        if (repo == null || config == null) {
            instance.showMainWindow();
            return instance;
        }
        instance.startServer();
        return instance;
    }

    constructor(
        private repository: Repository,
        private config: Config,
        twitchIngests: any
    ) {
        visitor.pageview("/").send();

        initMenu();

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

        exportToRenderer(new Browser(repository, twitchIngests, () => this.restart()));
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
        this.nginx.start(this.config.nginxPath);
        this.trayIcon.running = true;
        visitor
            .event("ui", "start", broadcastingServices(this.config).join(", "))
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

function broadcastingServices(config: Config) {
    return config.services.filter(x => x.enabled).map(x => x.name);
}
