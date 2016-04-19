const app = require("app");
import * as promisify from "native-promisify";
import * as fs from "fs";
const readFile = promisify(fs.readFile);
const exists = (path: string) =>
    new Promise((resolve, reject) => fs.exists(path, resolve));
const create = promisify(require("nginx-conf").NginxConfFile.create);
import Repository from "./repository";
const SERVICES = ["twitch", "peercaststation", "cavetube", "livecodingtv", "niconico", "other"];

/** v0.2.9からそれ以降のconfigへマイグレート */
export default async function migrate() {
    let config = await getConfig();
    if (!is0_2_9(config)) {
        return;
    }
    let nginxConfig = await NginxConfig.create(getNginxConfigPath());
    if (nginxConfig == null) {
        return;
    }
    let repo = await Repository.new();
    repo.setConfig({
        /** @deprecated */ exePath: config.exePath,
        listenPort: nginxConfig.port,
        nginxPath: config.exePath,
        services: SERVICES.map(service => ({
            enabled: nginxConfig.enabled(service),
            fmsURL: nginxConfig.fms(service),
            streamKey: nginxConfig.key(service)
        }))
    });
    nginxConfig.release();
}

function is0_2_9(config: any) {
    return config != null && config.exePath != null;
}

async function getConfig() {
    try {
        let data = await readFile(getConfigPath(), "ascii");
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
}

function getConfigPath() {
    return app.getPath("userData") + "/" + "config.json";
}

function getNginxConfigPath() {
    return app.getPath("userData") + "/" + "nginx.conf";
}

class NginxConfig {
    private enabledServices: EnabledServices;
    private disabledServices: DisabledServices;

    static async create(configPath: string) {
        if (!(await exists(configPath))) {
            return <NginxConfig>null;
        }
        return new this(configPath, await create(configPath));
    }

    constructor(private configPath: string, private conf: any) {
        this.enabledServices = new EnabledServices(conf.nginx.rtmp.server.application);
        this.disabledServices = new DisabledServices(conf.nginx.rtmp._comments);
    }

    release() {
        this.conf.die(this.configPath);
    }

    get port() {
        return <number>this.server.listen._value;
    }

    fms(service: string) {
        let e = this.enabledServices.get(service);
        if (e != null) {
            return e.fms;
        }
        let d = this.disabledServices.get(service);
        if (d != null) {
            return d.fms;
        }
        return null;
    }

    key(service: string) {
        let e = this.enabledServices.get(service);
        if (e != null) {
            return e.key;
        }
        let d = this.disabledServices.get(service);
        if (d != null) {
            return d.key;
        }
        return null;
    }

    enabled(service: string) {
        return this.enabledServices.get(service) != null;
    }

    private get server() {
        return this.conf.nginx.rtmp.server;
    }
}

interface Service {
    index: number;
    service: string;
    fms: string;
    key: string;
}

class EnabledServices {
    constructor(private container: any) {
    }

    get(service: string) {
        let items = this.items()
            .filter(x => x.service === service);
        if (items.length <= 0) {
            return null;
        }
        return items[0];
    }

    private items() {
        return this.getPushList()
            .map((x, index) => {
                let [fms, key] = (<string>x._value).split(" ");
                if (key == null) {
                    key = "";
                }
                return <Service>{
                    index,
                    service: x._comments[0],
                    fms,
                    key: key.replace(/^playpath=/, "")
                };
            });
    }

    private getPushList() {
        let push = this.container.push;
        if (push == null) {
            return [];
        }
        if (!(push instanceof Array)) {
            return [push];
        }
        return <any[]>push;
    }
}

class DisabledServices {
    constructor(private container: string[]) {
    }

    get(service: string) {
        let items = this.items()
            .filter(x => x.service === service);
        if (items.length <= 0) {
            return null;
        }
        return items[0];
    }

    private items() {
        return this.container
            .map((x, index) => {
                let [service, fms, key] = x.split(" ");
                return <Service>{
                    index,
                    service,
                    fms,
                    key: key.replace(/^playpath=/, "")
                };
            });
    }
}
